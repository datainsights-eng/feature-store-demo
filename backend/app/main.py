from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.feature_store.basic import BasicFeatureStore
from app.feature_store.optimized import OptimizedFeatureStore
from app.data import generate_sample_data
import time
from typing import Dict
import psutil
import os

app = FastAPI(title="Feature Store Demo API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize data and feature stores
df = generate_sample_data()
basic_store = BasicFeatureStore(df)
optimized_store = OptimizedFeatureStore(df)

# Initialize performance tracking
request_counts = {"basic": 0, "optimized": 0}
total_times = {"basic": 0, "optimized": 0}

def get_memory_usage():
    """Get current memory usage of the process"""
    process = psutil.Process(os.getpid())
    return process.memory_info().rss / 1024 / 1024  # Convert to MB

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.get("/basic/{user_id}")
async def get_basic_features(user_id: int):
    """Get features using basic implementation"""
    try:
        # Track request
        request_counts["basic"] += 1
        
        # Measure computation time
        start_time = time.time()
        
        # Get features
        features = await basic_store.get_features(user_id)
        
        # Calculate metrics
        computation_time = (time.time() - start_time) * 1000  # ms
        total_times["basic"] += computation_time
        
        return {
            "features": features,
            "computation_time": computation_time,
            "metrics": {
                "cache_hit": False,  # Basic never uses cache
                "memory_usage_mb": get_memory_usage(),
                "avg_computation_time": total_times["basic"] / request_counts["basic"],
                "total_requests": request_counts["basic"],
                "feature_count": len(features)
            }
        }
    except IndexError:
        raise HTTPException(status_code=404, detail="User not found")

@app.get("/optimized/{user_id}")
async def get_optimized_features(user_id: int):
    """Get features using optimized implementation"""
    try:
        # Track request
        request_counts["optimized"] += 1
        
        # Check if in cache before computation
        was_cached = user_id in optimized_store.cache
        
        # Measure computation time
        start_time = time.time()
        
        # Get features
        features = await optimized_store.get_features(user_id)
        
        # Calculate metrics
        computation_time = (time.time() - start_time) * 1000  # ms
        total_times["optimized"] += computation_time
        
        return {
            "features": features,
            "computation_time": computation_time,
            "metrics": {
                "cache_hit": was_cached,
                "memory_usage_mb": get_memory_usage(),
                "avg_computation_time": total_times["optimized"] / request_counts["optimized"],
                "total_requests": request_counts["optimized"],
                "feature_count": len(features),
                "precomputed": True
            }
        }
    except IndexError:
        raise HTTPException(status_code=404, detail="User not found")

@app.get("/stats")
async def get_stats():
    """Get overall performance statistics"""
    return {
        "basic": {
            "total_requests": request_counts["basic"],
            "avg_computation_time": total_times["basic"] / max(request_counts["basic"], 1),
            "total_computation_time": total_times["basic"]
        },
        "optimized": {
            "total_requests": request_counts["optimized"],
            "avg_computation_time": total_times["optimized"] / max(request_counts["optimized"], 1),
            "total_computation_time": total_times["optimized"],
            "cache_size": len(optimized_store.cache)
        },
        "memory_usage_mb": get_memory_usage()
    }