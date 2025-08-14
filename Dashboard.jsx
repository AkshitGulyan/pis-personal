import { useEffect, useState } from "react";
import ToolCard from "../components/ToolCard";
import Chatbot from "../components/Chatbot";
import { endpoints } from "../api";

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    fetch(endpoints.kpiCategories())
      .then((res) => res.json())
      .then(setCategories);

    fetch(endpoints.kpiTools())
      .then((res) => res.json())
      .then(setTools);

    // WebSocket for realtime updates
    const ws = new WebSocket(endpoints.ws());
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "kpi_update") {
        setTools((prev) =>
          prev.map((t) =>
            t.FeatureName === data.feature
              ? { ...t, KPI_Count: data.count }
              : t
          )
        );
        setCategories((prev) =>
          prev.map((c) =>
            data.feature.startsWith(c.FeatureName)
              ? { ...c, KPI_Count: c.KPI_Count + 1 }
              : c
          )
        );
      }
    };
    return () => ws.close();
  }, []);

  // Group tools under categories
  const grouped = categories.map((cat) => ({
    category: cat.FeatureName,
    total: cat.KPI_Count,
    tools: tools.filter((t) => t.FeatureName.startsWith(cat.FeatureName)),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-6 py-6">
      <h1 className="text-4xl font-bold mb-6">📊 Dashboard</h1>
      {grouped.map((g) => (
        <div key={g.category} className="mb-10">
          <h2 className="text-2xl mb-4">
            {g.category} <span className="text-gray-400">(Hits: {g.total})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {g.tools.map((tool) => (
              <ToolCard
                key={tool.FeatureName}
                name={tool.FeatureName}
                url="https://example.com" // Replace with actual tool link
              />
            ))}
          </div>
        </div>
      ))}
      <Chatbot />
    </div>
  );
}
