const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export const endpoints = {
  kpis: () => `${API_BASE}/kpis`,
  kpiTools: () => `${API_BASE}/kpis/tools`,
  kpiCategories: () => `${API_BASE}/kpis/categories`,
  increment: () => `${API_BASE}/kpis/increment`,
  trend: (feature) => `${API_BASE}/kpis/trend/${encodeURIComponent(feature)}?window_minutes=240`,
  chatbot: (q) => `${API_BASE}/chatbot?q=${encodeURIComponent(q)}`,
  ws: () => `${API_BASE.replace(/^http/, "ws")}/ws/kpi`,
};
