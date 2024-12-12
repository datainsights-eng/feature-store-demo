export default function FeatureCard({ label, value }) {
    return (
      <div className="bg-gray-50 px-4 py-3 rounded-lg">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="text-lg font-semibold">{value}</dd>
      </div>
    );
  }