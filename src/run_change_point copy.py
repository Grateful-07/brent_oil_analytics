import pandas as pd
import numpy as np
import pymc as pm
import arviz as az
import matplotlib.pyplot as plt
import os

# 1. Load and Prepare Data
data_path = "../data/raw/BrentOilPrices.csv"
if not os.path.exists(data_path):
    data_path = "data/raw/BrentOilPrices.csv"

# Load Brent Oil data
df = pd.read_csv(data_path)
df['Date'] = pd.to_datetime(df['Date'])
df.sort_values('Date', inplace=True)
df.reset_index(drop=True, inplace=True)

# Define target variable (for modeling speed, we look at a subset or daily prices)
# Let's subset to a highly volatile era to make the Bayesian sampler run fast and converge clearly
# (e.g., around the 2020 OPEC+ Price War and COVID Crash)
subset_df = df[(df['Date'] >= '2019-06-01') & (df['Date'] <= '2021-06-01')].copy()
subset_df.reset_index(drop=True, inplace=True)

# Extract price array and create a time index
prices = subset_df['Price'].values
time_idx = np.arange(len(prices))
dates = subset_df['Date'].values

print(f"Data successfully loaded. Running model on {len(prices)} trading days.")

# 2. Build the PyMC Bayesian Change Point Model
with pm.Model() as change_point_model:
    # Prior for switch point (tau) - discrete uniform across all index days
    tau = pm.DiscreteUniform("tau", lower=0, upper=len(prices) - 1)
    
    # Priors for the mean prices before and after the switch point
    mu_1 = pm.Normal("mu_1", mu=prices.mean(), sigma=prices.std())
    mu_2 = pm.Normal("mu_2", mu=prices.mean(), sigma=prices.std())
    
    # Prior for standard deviation (variance assumed shared across the eras for simplicity)
    sigma = pm.Exponential("sigma", lam=1.0)
    
    # The switch function logic: if time index < tau, use mu_1, else use mu_2
    mu_switch = pm.math.switch(time_idx < tau, mu_1, mu_2)
    
    # Likelihood
    likelihood = pm.Normal("y", mu=mu_switch, sigma=sigma, observed=prices)
    
    # 3. Run the MCMC Sampler
    print("Starting Bayesian MCMC Sampling...")
    idata = pm.sample(draws=1500, tune=1000, return_inferencedata=True, random_seed=42)

# 4. Interpret and Visualize Model Outputs
print("\n--- Inference Complete. Generating Diagnostics ---")

# Summary metrics (Verify convergence: R-hat should be close to 1.0)
summary = az.summary(idata, var_names=["mu_1", "mu_2", "sigma"])
print(summary)

# Plot Trace to examine convergence visually
az.plot_trace(idata, var_names=["mu_1", "mu_2", "sigma"])
plt.gcf().savefig("../notebooks/mcmc_trace.png", dpi=300)
plt.close()

# Extract posterior values
tau_samples = idata.posterior["tau"].values.flatten()
mu1_samples = idata.posterior["mu_1"].values.flatten()
mu2_samples = idata.posterior["mu_2"].values.flatten()

# Find the peak (Mode) of the Switch Point (tau) distribution
tau_mode = int(pd.Series(tau_samples).mode()[0])
change_point_date = dates[tau_mode]

# Calculate quantified shift statistics
mean_mu1 = mu1_samples.mean()
mean_mu2 = mu2_samples.mean()
percentage_shift = ((mean_mu2 - mean_mu1) / mean_mu1) * 100

print("\n" + "="*50)
print("             MODEL CHANGE POINT RESULTS")
print("="*50)
print(f"Detected Shift Index:  {tau_mode}")
print(f"Isolated Break Date:  {pd.to_datetime(change_point_date).strftime('%Y-%m-%d')}")
print(f"Average Price Before: ${mean_mu1:.2f}")
print(f"Average Price After:  ${mean_mu2:.2f}")
print(f"Quantified Price Shift: {percentage_shift:+.2f}%")
print("="*50)

# Save the change point posterior distribution visualization
plt.figure(figsize=(10, 5))
plt.hist(tau_samples, bins=50, density=True, color='teal', alpha=0.7)
plt.axvline(tau_mode, color='red', linestyle='--', label=f'Detected Break: {pd.to_datetime(change_point_date).strftime("%Y-%m-%d")}')
plt.title("Posterior Probability Distribution of Switch Point ($τ$)")
plt.xlabel("Trading Day Index")
plt.ylabel("Probability Density")
plt.legend()
plt.tight_layout()
plt.savefig("../notebooks/change_point_posterior.png", dpi=300)
plt.close()