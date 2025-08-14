import { useEffect, useState } from "react";
import ToolCard from "../components/ToolCard";
import CategoryCard from "../components/CategoryCard";
import Chatbot from "../components/Chatbot";
import { getKpiData } from "../api";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getKpiData().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading dashboard...
      </div>
    );
  }

  const categories = data.filter((d) => d.is_category);
  const tools = data.filter((d) => !d.is_category);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🚀 PIS Dashboard</h1>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {categories.map((cat) => (
          <CategoryCard key={cat.FeatureName} data={cat} />
        ))}
      </div>

      {/* Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.FeatureName} data={tool} />
        ))}
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}
