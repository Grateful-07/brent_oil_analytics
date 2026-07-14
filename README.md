# Birhan Energies: Brent Crude Oil Quantitative Analytics & Structural Break Dashboard

An end-to-end quantitative analytics platform designed to model, analyze, and visualize the structural impacts of major geopolitical and economic events on Brent Crude oil prices from 2019 to the present.

This repository features a robust data engineering pipeline, advanced Bayesian structural break inference utilizing PyMC, and a high-performance interactive dashboard built with React and Flask.

---

## 🚀 Key Features

* **Data Engineering & Statistical Baseline:** Cleansed daily spot prices, evaluated time-series stationarity using Augmented Dickey-Fuller (ADF) tests, and engineered features (such as daily log returns).
* **Bayesian Change Point Detection:** Utilizes **PyMC** and Markov Chain Monte Carlo (MCMC) NUTS sampling to isolate structural eras and calculate statistical change points before/after major global shocks.
* **Modern Full-Stack Dashboard:**
  * **Frontend:** Built with React, Vite, **Tailwind CSS v4** (lightning-fast Rust-based styling engine), and **Recharts** for highly interactive, fluid timelines.
  * **Backend:** A lightweight Flask API serving clean, structured endpoints with handled CORS policies.

---

## 🛠️ Tech Stack

* **Backend / Quantitative Modeling:** Python 3.12+, Flask, PyMC, Pandas, NumPy, Statsmodels
* **Frontend UI:** React 18, Vite, Tailwind CSS v4, Recharts, Lucide Icons
* **Workflow & Version Control:** Git, GitHub

---

## 📂 Repository Structure

```text
├── backend/
│   ├── app.py                     # Flask API Server (Port 5001)
│   └── requirements.txt           # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # React interactive dashboard source
│   │   ├── index.css              # Tailwind CSS directives & imports
│   │   └── main.jsx
│   ├── package.json               # Node packages (recharts, lucide-react)
│   ├── postcss.config.js          # Tailwind v4 PostCSS adapter configuration
│   └── vite.config.js
├── data/
│   └── raw/                       # Historical price CSVs and event sheets
├── src/
│   ├── run_change_point.py        # Bayesian change point model runner
└── README.md                      # Project documentation
1. Start the Flask Backend
Open a PowerShell window, navigate to the backend folder, install dependencies, and run the server:

PowerShell
cd backend
pip install -r requirements.txt
python app.py
The server will initialize on http://localhost:5001.

2. Run the React Frontend Dashboard
Open a second PowerShell tab/window, navigate to the frontend folder, install dependencies, and launch Vite:

PowerShell
cd frontend
npm install
npm run dev
Open http://localhost:5173 in your browser to view the live dashboard.


