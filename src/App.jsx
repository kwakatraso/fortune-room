import { useState } from "react";
import UserPage from "./pages/UserPage";
import AdvisorPage from "./pages/AdvisorPage";
import AdminPage from "./pages/AdminPage";

<Route path="/admin" element={<AdminPage />} />

function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-100 to-pink-100 font-serif p-4">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">운세룸</h1>
        <p className="mb-2">접속 유형을 선택하세요</p>
        <div className="space-x-4">
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow"
            onClick={() => setRole("user")}
          >
            사용자
          </button>
          <button
            className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow"
            onClick={() => setRole("advisor")}
          >
            상담사
          </button>
        </div>
      </div>
    );
  }

  return role === "user" ? <UserPage /> : <AdvisorPage />;
}

export default App;
