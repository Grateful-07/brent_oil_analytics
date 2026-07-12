# Birhan Energies: Brent Crude Oil Price Sensitivity Analysis
### Quantitative Analysis of Geopolitical & Macroeconomic Market Shocks

An enterprise-grade statistical pipeline designed to analyze and quantify how major political events, regional conflicts, international sanctions, and OPEC policy changes impact global Brent Crude Oil spot prices using Bayesian Change Point Analysis (`PyMC`).

---

## 📂 Repository Structure

```text
├── .vscode/
│   └── settings.json         # Workspace specific IDE preferences
├── .github/
│   └── workflows/
│       └── unittests.yml     # Automated CI/CD execution for PyTest
├── data/
│   ├── raw/                  # Ingested immutable source data streams
│   └── processed/            # Cleaned, resampled, stationary data arrays
├── notebooks/
│   ├── __init__.py
│   └── README.md             # Notebook process documentation
├── src/
│   ├── __init__.py
│   └── pipeline.py           # Production-ready data cleaning & testing modules
├── scripts/
│   ├── __init__.py
│   ├── README.md
│   └── run_eda.py            # Execution runner for initial statistical assessment
├── tests/
│   ├── __init__.py
│   └── test_pipeline.py      # Unit testing suites
├── .gitignore                # Environment and raw data tracking blocks
├── requirements.txt          # Python dependency checklist
└── README.md                 # Complete project documentation
Analytical Workflow & FoundationsThis analytical framework breaks down the historical price line into distinct structural eras by checking for variance and distribution shifts:Data ETL Pipeline: Standardizes time series data from May 1987 to September 2022, handling holiday trading gaps via forward-filling methods.Statistical Property Profiling: Implements log-return transformations to eliminate deterministic trends and uses Augmented Dickey-Fuller (ADF) tests to confirm absolute stationarity.Bayesian Change Point Estimation: Deploys a Markov Chain Monte Carlo (MCMC) sampler within a PyMC infrastructure to discover change points ($\tau$) based on shifting mean ($\mu$) and variance ($\sigma^2$) parameters.Geopolitical Overlay: Maps isolated break dates directly against a hand-curated timeline of major global shocks to assess temporal correlation.
🛠️ Local Installation & SetupClone the Repository into your local directory:Bashgit clone <your-repository-url>
cd brent-oil-analytics
Verify your branch settings:Make sure you are currently on the correct feature branch before launching execution tasks:PowerShell git checkout task1
Initialize Environment and Dependencies:Ensure you are using a Python 3.10+ environment, then execute:Bashpip install -r requirements.txt
Verify the Ingestion Directory Setup:Confirm that your raw source data file is placed at: data/raw/BrentOilPrices.csv📊 Running the Analytical PipelineTo execute the baseline exploratory data analysis, run the statistical scripts, and output your initial stationarity test results, run the following command in your terminal:Bashpython scripts/run_eda.py
Expected Execution Outputs:Mathematical ADF Statistics and corresponding $p$-values will print directly to your terminal.High-contrast performance plots tracking raw prices alongside daily stationary log returns will be generated and saved to notebooks/eda_plots.png.
📝 Task 1a: Core Analytical Assumptions & Structural Limitations

A. Foundational Modeling Assumptions
Instantaneous Regime Migration: The underlying Bayesian Change Point model operates under the structural assumption that macroeconomic shocks manifest as clean, abrupt mathematical breaks ($\tau$) in parameters, rather than smooth, multi-year linear migrations.
Independent and Identically Distributed (i.i.d.) Residuals: We assume that once log-return transformations eliminate deterministic trends, the returns within isolated structural regimes behave as normally distributed variations centered around a stable mean ($\mu_k$) and variance ($\sigma_k^2$).
Data Feed Uniformity: The pipeline treats the historical pricing data from the U.S. Energy Information Administration (EIA) as an authoritative, structurally consistent data feed across its entire 1987–2022 lifecycle.

B. Analytical & Model Limitations
Temporal Proximity vs. Direct Causality: Aligning a statistically isolated price change point with an item in our structured event dataset (`data/raw/gpr_events.csv`) confirms **temporal association**, but does not inherently prove mathematical causality. The model cannot completely isolate oil-specific shocks from concurrent macroeconomic background noise (e.g., shifts in the US Dollar Index $DXY$, domestic interest rate adjustments, or global maritime freight capacity constraints).
Information Censoring at Trading Gaps: Using forward-fill (`ffill`) adjustments to handle weekend and holiday market closures introduces minor artificial stability. This masks intraday news pricing that occurs while formal trading floors are offline.
Historical Asymmetry: The historical impact of early events (e.g., the 1990 Gulf War) occurred within a market devoid of high-frequency algorithmic trading desks. Comparing these directly to modern shocks (e.g., the 2022 Russia-Ukraine war) introduces structural baseline biases that a pure mathematical model cannot entirely normalize.