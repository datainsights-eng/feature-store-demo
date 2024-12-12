from typing import Dict
import asyncio
import pandas as pd

class BasicFeatureStore:
    def __init__(self, data: pd.DataFrame):
        self.data = data

    async def get_features(self, user_id: int) -> Dict[str, float]:
        """
        Basic feature computation with simulated database latency
        """
        # Simulate database query latency
        await asyncio.sleep(0.1)
        
        user_data = self.data[self.data['user_id'] == user_id].iloc[0]
        
        # Compute features on-demand
        features = {
            'avg_purchase_value': user_data['total_spend'] / max(user_data['purchase_count'], 1),
            'purchase_frequency': user_data['purchase_count'] / 30,  # per month
            'user_lifetime_value': user_data['total_spend'] * (user_data['age'] / 50),
            'engagement_score': (user_data['loyalty_score'] * 0.4 + 
                               user_data['purchase_count'] * 0.6),
            'churn_risk': max(0, min(100, 
                user_data['days_since_last_purchase'] / 30 * 100 / 
                max(user_data['purchase_count'], 1)))
        }
        
        return features