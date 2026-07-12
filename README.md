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
Analytical Workflow & FoundationsThis analytical framework breaks down the historical price line into distinct structural eras by checking for variance and distribution shifts:Data ETL Pipeline: Standardizes time series data from May 1987 to September 2022, handling holiday trading gaps via forward-filling methods.Statistical Property Profiling: Implements log-return transformations to eliminate deterministic trends and uses Augmented Dickey-Fuller (ADF) tests to confirm absolute stationarity.Bayesian Change Point Estimation: Deploys a Markov Chain Monte Carlo (MCMC) sampler within a PyMC infrastructure to discover change points ($\tau$) based on shifting mean ($\mu$) and variance ($\sigma^2$) parameters.Geopolitical Overlay: Maps isolated break dates directly against a hand-curated timeline of major global shocks to assess temporal correlation.🛠️ Local Installation & SetupClone the Repository into your local directory:Bashgit clone <your-repository-url>
cd brent-oil-analytics
Verify your branch settings:Make sure you are currently on the correct feature branch before launching execution tasks:PowerShell git checkout task1
Initialize Environment and Dependencies:Ensure you are using a Python 3.10+ environment, then execute:Bashpip install -r requirements.txt
Verify the Ingestion Directory Setup:Confirm that your raw source data file is placed at: data/raw/BrentOilPrices.csv📊 Running the Analytical PipelineTo execute the baseline exploratory data analysis, run the statistical scripts, and output your initial stationarity test results, run the following command in your terminal:Bashpython scripts/run_eda.py
Expected Execution Outputs:Mathematical ADF Statistics and corresponding $p$-values will print directly to your terminal.High-contrast performance plots tracking raw prices alongside daily stationary log returns will be generated and saved to notebooks/eda_plots.png.