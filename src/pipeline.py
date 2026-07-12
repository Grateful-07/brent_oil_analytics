import pandas as pd
import numpy as np
import logging
from statsmodels.tsa.stattools import adfuller

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def load_and_preprocess_data(file_path: str) -> pd.DataFrame:
    try:
        logging.info(f"Loading raw data from {file_path}")
        df = pd.read_csv(file_path)
        
        # Parse mixed date strings ('20-May-87' and '"Aug 09, 2022"') intelligently
        df['Date'] = pd.to_datetime(df['Date'], format='mixed')
        df.dropna(subset=['Date'], inplace=True)
        
        df.set_index('Date', inplace=True)
        df.sort_index(inplace=True)
        
        # Resample to daily intervals and forward-fill weekend non-trading blanks
        df = df.resample('D').ffill()
        df['Log_Return'] = np.log(df['Price'] / df['Price'].shift(1))
        df.dropna(inplace=True)
        
        return df
    except Exception as e:
        logging.error(f"Error in data preprocessing: {str(e)}")
        raise e

def perform_stationarity_test(series: pd.Series, name: str) -> dict:
    result = adfuller(series)
    return {
        'ADF Statistic': result[0],
        'p-value': result[1],
        '1% Critical Value': result[4]['1%'],
        '5% Critical Value': result[4]['5%']
    }