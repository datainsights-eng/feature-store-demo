from typing import Dict
import pandas as pd
import numpy as np
from datetime import datetime

class OptimizedFeatureStore:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.cache = {}
        
        # Pre-compute features
        self._precompute_features()
        
    def _precompute_features(self):
        """Pre-compute features for faster retrieval"""
        # Basic features
        self.data['avg_purchase_value'] = (
            self.data['total_spend'] / 
            self.data['purchase_count'].clip(lower=1)
        )
        self.data['purchase_frequency'] = self.data['purchase_count'] / 30
        
        # Advanced features
        self.data['user_lifetime_value'] = (
            self.data['total_spend'] * 
            (self.data['age'] / 50)
        )
        self.data['engagement_score'] = (
            self.data['loyalty_score'] * 0.4 + 
            self.data['purchase_count'] * 0.6
        )
        self.data['churn_risk'] = np.clip(
            self.data['days_since_last_purchase'] / 30 * 100 / 
            self.data['purchase_count'].clip(lower=1),
            0, 100
        )
        
    async def get_features(self, user_id: int) -> Dict[str, float]:
        """
        Get pre-computed features for a user
        """
        # Check cache first
        if user_id in self.cache:
            return self.cache[user_id]
            
        # Get pre-computed features
        user_data = self.data[self.data['user_id'] == user_id].iloc[0]
        
        features = {
            'avg_purchase_value': float(user_data['avg_purchase_value']),
            'purchase_frequency': float(user_data['purchase_frequency']),
            'user_lifetime_value': float(user_data['user_lifetime_value']),
            'engagement_score': float(user_data['engagement_score']),
            'churn_risk': float(user_data['churn_risk'])
        }
        
        # Cache the results
        self.cache[user_id] = features
        return features