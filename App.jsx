import { useState } from "react"
import Landing from "./pages/Landing"
import Dashboard from "./pages/Dashboard"

export default function App() {
  const [entered, setEntered] = useState(false)
  return entered ? <Dashboard/> : <Landing onEnter={() => setEntered(true)} />
}
