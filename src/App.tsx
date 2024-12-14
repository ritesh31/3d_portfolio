import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Navbar } from "./components";
import { Home, About, Projects, Contacts } from "./pages";

function App() {
  return (
    <main className="bg-slate-300/20 h-full">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contacts" element={<Contacts />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
