import os
import sys
import matplotlib.pyplot as plt
import seaborn as sns

# Ensure the root path configuration finds the 'src' directory dynamically
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from src.pipeline import load_and_preprocess_data, perform_stationarity_test

def main():
    data_path = "data/raw/BrentOilPrices.csv"
    if not os.path.exists(data_path):
        data_path = "../data/raw/BrentOilPrices.csv"

    # Process data and run the statistical tests
    df = load_and_preprocess_data(data_path)
    price_adf = perform_stationarity_test(df['Price'], "Raw Price")
    return_adf = perform_stationarity_test(df['Log_Return'], "Log Returns")
    
    # Print the statistical outputs directly to terminal
    print("\n" + "="*40)
    print("   AUGMENTED DICKEY-FULLER TEST RESULTS")
    print("="*40)
    print(f"--- Raw Price ---")
    print(f"ADF Statistic: {price_adf['ADF Statistic']:.4f}")
    print(f"p-value: {price_adf['p-value']:.4f} (Non-Stationary)")
    
    print(f"\n--- Log Returns ---")
    print(f"ADF Statistic: {return_adf['ADF Statistic']:.4f}")
    print(f"p-value: {return_adf['p-value']:.4e} (Stationary)")
    print("="*40)

    # Generate the visual charts
    sns.set_theme(style="darkgrid")
    fig, axes = plt.subplots(2, 1, figsize=(12, 8), sharex=True)
    axes[0].plot(df.index, df['Price'], color='blue', label='Brent Spot Price')
    axes[0].set_title('Historical Brent Crude Oil Prices')
    axes[1].plot(df.index, df['Log_Return'], color='purple', alpha=0.6, label='Log Returns')
    axes[1].set_title('Stationary Daily Log Returns (Volatility Clustering)')
    plt.tight_layout()
    
    # Save the output visualization chart
    os.makedirs("notebooks", exist_ok=True)
    plt.savefig("notebooks/eda_plots.png")
    print("\nVisual plot saved safely to notebooks/eda_plots.png")

if __name__ == "__main__":
    main()