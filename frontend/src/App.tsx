
// import Dashboard from "./Dashboard";

// function App() {
//   return <Dashboard />;
// }

// export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proposal" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
