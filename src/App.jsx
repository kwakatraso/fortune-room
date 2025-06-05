import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import UserPage from "./pages/UserPage";
import AdvisorPage from "./pages/AdvisorPage";
import AdminPage from "./pages/AdminPage";
import React from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/advisor" element={<AdvisorPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 font-sans p-6">
      <div className="max-w-xl mx-auto space-y-6 text-center">
        <h1 className="text-4xl font-extrabold text-purple-700">운세룸</h1>
        <p className="text-gray-600 text-lg">진짜 타로마스터와의 나만의 운세 상담</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <a href="/user" className="block bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <img src="/images/user-icon.png" className="w-16 h-16 mx-auto mb-2" alt="사용자" />
            <h2 className="font-bold text-purple-600">사용자로 입장</h2>
            <p className="text-sm text-gray-500 mt-1">운세를 직접 받고 후기도 남겨보세요</p>
          </a>

          <a href="/advisor" className="block bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
            <img src="/images/advisor-icon.png" className="w-16 h-16 mx-auto mb-2" alt="상담사" />
            <h2 className="font-bold text-pink-600">상담사로 입장</h2>
            <p className="text-sm text-gray-500 mt-1">상담을 제공하고 후기도 확인해요</p>
          </a>
        </div>

        <p className="text-xs text-gray-400 mt-12">© 2025 운세룸. All rights reserved.</p>
      </div>
    </div>
  );
}

export default App;