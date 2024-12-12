export default function PerformanceMetrics({ stats }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Basic Implementation</h3>
          <dl className="mt-2 grid grid-cols-1 gap-2">
            <div className="bg-gray-50 px-4 py-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Total Requests</dt>
              <dd className="text-lg font-semibold">{stats.basic.total_requests}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Average Computation Time</dt>
              <dd className="text-lg font-semibold">
                {stats.basic.avg_computation_time.toFixed(2)} ms
              </dd>
            </div>
          </dl>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Optimized Implementation</h3>
          <dl className="mt-2 grid grid-cols-1 gap-2">
            <div className="bg-gray-50 px-4 py-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Total Requests</dt>
              <dd className="text-lg font-semibold">{stats.optimized.total_requests}</dd>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Average Computation Time</dt>
              <dd className="text-lg font-semibold">
                {stats.optimized.avg_computation_time.toFixed(2)} ms
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-3 rounded-lg">
              <dt className="text-sm font-medium text-gray-500">Cache Size</dt>
              <dd className="text-lg font-semibold">{stats.optimized.cache_size} entries</dd>
            </div>
          </dl>
        </div>
      </div>
    );
  }