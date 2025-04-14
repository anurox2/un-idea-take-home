import "./App.css";
import { ApiProvider } from "./ContextStore";
import Dashboard from "./Dashboard";

function App() {
  return (
    <ApiProvider>
      <Dashboard />
    </ApiProvider>
  );
}

export default App;
