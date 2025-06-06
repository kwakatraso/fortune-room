import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import UserPage from "./pages/UserPage";
import AdvisorPage from "./pages/AdvisorPage";
import AdminPage from "./pages/AdminPage";
import React from "react";
import { Card } from "./components/ui/Card";
import { Button } from "./components/ui/Button";

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
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-purple-100 via-white to-pink-100 flex items-center justify-center font-serif p-6">
      <div className="text-center space-y-8 max-w-xl w-full">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-800">운세룸</h1>
          <p className="mt-2 text-gray-600 text-lg">진짜 타로마스터와 나만의 운세 상담</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:shadow-xl transition p-6">
            <h2 className="text-xl font-bold text-purple-700 mb-2">🔮 사용자 입장</h2>
            <p className="text-sm text-gray-600">운세를 보고 상담 후 후기를 남기고 싶다면</p>
            <Button className="mt-4 w-full" onClick={() => navigate("/user")}>
              사용자로 입장
            </Button>
          </Card>

          <Card className="cursor-pointer hover:shadow-xl transition p-6">
            <h2 className="text-xl font-bold text-pink-600 mb-2">🛠 상담사 입장</h2>
            <p className="text-sm text-gray-600">상담 후기 열람 및 관리하려면</p>
            <Button className="mt-4 w-full" onClick={() => navigate("/admin")}>
              상담사로 입장
            </Button>
          </Card>
        </div>

        <p className="text-xs text-gray-400 mt-12">© 2025 운세룸. All rights reserved.</p>
      </div>
    </div>
  );
}

export default App;