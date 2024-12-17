import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Page/home";
import Chat from "./Page/chat";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
};

export default App;
