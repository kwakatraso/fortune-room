import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import UserPage from "./pages/UserPage";
import AdvisorPage from "./pages/AdvisorPage";
import AdminPage from "./pages/AdminPage";
import React, { useState } from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelector />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/advisor" element={<AdvisorPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

function RoleSelector() {
  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-100 to-pink-100 font-serif p-4">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">운세룸</h1>
        <p className="mb-2">접속 유형을 선택하세요</p>
        <div className="space-x-4">
          <a href="/user">
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow">
              사용자
            </button>
          </a>
          <a href="/advisor">
            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow">
              상담사
            </button>
          </a>
        </div>
      </div>
    );
  }

  return null; // 여긴 안 쓰이게 될 것
}

export default App;