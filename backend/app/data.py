import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_sample_data(n_users: int = 1000) -> pd.DataFrame:
    """Generate sample user data for demonstration"""
    np.random.seed(42)  # For reproducibility
    
    return pd.DataFrame({
        'user_id': range(n_users),
        'age': np.random.randint(18, 80, n_users),
        'purchase_count': np.random.randint(0, 100, n_users),
        'total_spend': np.random.uniform(0, 1000, n_users),
        'last_purchase_date': pd.date_range(
            end=datetime.now(),
            periods=n_users
        ),
        'loyalty_score': np.random.uniform(0, 100, n_users),
        'average_order_value': np.random.uniform(10, 200, n_users),
        'days_since_last_purchase': np.random.randint(0, 365, n_users)
    })