import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import FeatureCard from './FeatureCard';
import PerformanceMetrics from './PerformanceMetrics';

export default function FeatureStoreDemo() {
  const [userId, setUserId] = useState(1);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch overall stats periodically
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const testFeatureStore = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [basicRes, optimizedRes] = await Promise.all([
        fetch(`http://localhost:8000/basic/${userId}`),
        fetch(`http://localhost:8000/optimized/${userId}`)
      ]);

      const basicData = await basicRes.json();
      const optimizedData = await optimizedRes.json();

      const newResult = {
        timestamp: new Date().toLocaleTimeString(),
        basicTime: basicData.computation_time,
        basicMetrics: basicData.metrics,
        optimizedTime: optimizedData.computation_time,
        optimizedMetrics: optimizedData.metrics,
        features: optimizedData.features,
        improvement: ((basicData.computation_time - optimizedData.computation_time) / 
                     basicData.computation_time * 100).toFixed(1)
      };

      setResults(prev => [...prev, newResult].slice(-10)); // Keep last 10 results
    } catch (err) {
      setError('Failed to fetch features. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Test Feature Store Performance</h2>
        <div className="flex items-center gap-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
              User ID
            </label>
            <input
              type="number"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(Math.max(1, parseInt(e.target.value) || 1))}
              className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              min="1"
              max="999"
            />
          </div>
          <button
            onClick={testFeatureStore}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? 'Testing...' : 'Test Performance'}
          </button>
        </div>
        {error && (
          <div className="mt-4 text-sm text-red-600">{error}</div>
        )}
      </div>

      {stats && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Overall Statistics</h2>
          <PerformanceMetrics stats={stats} />
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Performance Comparison</h2>
            <div className="h-[300px]">
              <LineChart width={800} height={300} data={results}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="basicTime" 
                  name="Basic Implementation" 
                  stroke="#4f46e5" 
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="optimizedTime" 
                  name="Optimized Implementation" 
                  stroke="#059669" 
                  strokeWidth={2}
                />
              </LineChart>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium mb-4">Latest Request Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Basic Implementation</h3>
                <dl className="mt-2 grid grid-cols-1 gap-2">
                  <FeatureCard label="Computation Time" value={`${results[results.length-1].basicTime.toFixed(2)} ms`} />
                  <FeatureCard label="Cache Hit" value={results[results.length-1].basicMetrics.cache_hit ? 'Yes' : 'No'} />
                  <FeatureCard label="Memory Usage" value={`${results[results.length-1].basicMetrics.memory_usage_mb.toFixed(2)} MB`} />
                </dl>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Optimized Implementation</h3>
                <dl className="mt-2 grid grid-cols-1 gap-2">
                  <FeatureCard label="Computation Time" value={`${results[results.length-1].optimizedTime.toFixed(2)} ms`} />
                  <FeatureCard label="Cache Hit" value={results[results.length-1].optimizedMetrics.cache_hit ? 'Yes' : 'No'} />
                  <FeatureCard label="Memory Usage" value={`${results[results.length-1].optimizedMetrics.memory_usage_mb.toFixed(2)} MB`} />
                </dl>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}