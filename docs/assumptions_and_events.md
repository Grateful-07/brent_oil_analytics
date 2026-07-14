# Model Assumptions and Geopolitical Event Catalog

## 1. Core Model Assumptions

Our quantitative system operates under the following mathematical and economic assumptions:

* **Stationary Inputs:** Raw spot prices are highly non-stationary ($I(1)$ process). Therefore, we model the daily log returns, which are proven stationary ($I(0)$) via the Augmented Dickey-Fuller test, stabilizing mean and variance estimates.
* **Abrupt Regime Shifts:** We assume that changes in market regimes happen abruptly (represented by discrete change point parameter $\tau$) rather than smoothly over time, reflecting sudden global shocks.
* **Volatility-Driven Segments:** Geopolitical events primarily affect price volatility ($\sigma$) rather than structural long-term mean return drift ($\mu \approx 0$).

---

## 2. Tracked Geopolitical Events Dataset

Below is the verified historical reference catalog used to cross-reference our structural models:

| Event Date | Geopolitical Event Name | Macroeconomic/Energy Market Impact Impact |
| :--- | :--- | :--- |
| **Jan 03, 2020** | US Strike on Qasem Soleimani | Immediate $3\%$ spike in Brent crude; heightened Middle East premium. |
| **Mar 08, 2020** | Russia-Saudi Price War Init | OPEC+ alliance breakdown; historic collapse of prices below $\$30$/bbl. |
| **Jan 05, 2021** | Saudi Arabia Voluntary Cut | Saudi Arabia cuts 1 million bpd; price recovery momentum established. |
| **Feb 24, 2022** | Russia Invades Ukraine | Global supply disruption panic; Brent spikes briefly to over $\$120$/bbl. |
| **Oct 07, 2023** | Hamas-Israel Conflict Begins | Geopolitical risk premium re-introduced; increased shipping costs. |