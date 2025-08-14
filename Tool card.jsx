import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { endpoints } from "../api";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip);

export default function ToolCard({ name, url }) {
  const [count, setCount] = useState(0);
  const [trend, setTrend] = useState([]);

  useEffect(() => {
    fetch(endpoints.kpis())
      .then((res) => res.json())
      .then((data) => {
        const tool = data.find((d) => d.FeatureName === name);
        if (tool) setCount(tool.KPI_Count);
      });

    fetch(endpoints.trend(name))
      .then((res) => res.json())
      .then(setTrend);
  }, [name]);

  const handleClick = () => {
    fetch(endpoints.increment(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feature_name: name }),
    });
    window.open(url, "_blank");
    setCount((prev) => prev + 1);
  };

  return (
    <div
      className="card p-4 flex flex-col justify-between cursor-pointer"
      onClick={handleClick}
    >
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-400">Hits: {count}</p>
      </div>
      {trend.length > 0 && (
        <div className="h-20">
          <Line
            data={{
              labels: trend.map((t) =>
                new Date(t.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              ),
              datasets: [
                {
                  data: trend.map((t) => t.count),
                  borderColor: "rgb(99, 102, 241)",
                  backgroundColor: "rgba(99, 102, 241, 0.2)",
                  fill: true,
                  tension: 0.3,
                  pointRadius: 0,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
              scales: { x: { display: false }, y: { display: false } },
            }}
          />
        </div>
      )}
    </div>
  );
}
