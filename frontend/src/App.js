import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MenuPage from "./components/MenuPage";
import PopularPage from "./components/PopularPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/section:menu/:category" element={<MenuPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;