import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [reviews, setReviews] = useState([]);

  const correctPassword = "admin123"; // 원하는 비번으로 바꿔도 됨

  useEffect(() => {
    if (authenticated) {
      loadReviews();
    }
  }, [authenticated]);

  const loadReviews = async () => {
    const snapshot = await getDocs(collection(db, "reviews"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReviews(list);
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "reviews", id));
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto p-4 mt-10">
        <Card>
          <p className="mb-2">관리자 비밀번호 입력</p>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            className="mt-2"
            onClick={() => {
              if (password === correctPassword) {
                setAuthenticated(true);
              } else {
                alert("비밀번호가 틀렸습니다");
              }
            }}
          >
            로그인
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center text-purple-800">🛠 관리자 페이지</h1>
      {reviews.map((r) => (
        <Card key={r.id}>
          <p>👤 {r.name} / ⭐ {r.rating || "?"}</p>
          <p className="text-sm text-gray-600">{r.content}</p>
          <p className="text-xs text-gray-400">📅 {r.date}</p>
          <Button
            className="mt-2 bg-red-500 text-white"
            onClick={() => handleDelete(r.id)}
          >
            삭제하기
          </Button>
        </Card>
      ))}
    </div>
  );
}