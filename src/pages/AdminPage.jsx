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
  const [avgRating, setAvgRating] = useState(0);
  const [latestDate, setLatestDate] = useState("");

  const correctPassword = "admin123";

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
    list.sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순 정렬
    setReviews(list);

    // 평균 별점 계산
    const ratings = list
      .filter((r) => typeof r === "object" && r.rating)
      .map((r) => r.rating);
    const avg =
      ratings.length > 0
        ? (ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length).toFixed(1)
        : 0;
    setAvgRating(avg);

    // 가장 최신 후기 날짜
    if (list.length > 0 && list[0].date) {
      const latest = new Date(list[0].date).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setLatestDate(latest);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("정말로 삭제할까요?");
    if (!confirm) return;

    await deleteDoc(doc(db, "reviews", id));
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  if (!authenticated) {
    return (
      <div className="max-w-md mx-auto p-4 mt-10">
        <Card>
          <p className="mb-2 font-semibold">🔐 관리자 비밀번호 입력</p>
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
    <>
      <div className="bg-purple-50 p-4 rounded-lg shadow text-sm space-y-1">
        <p>📋 총 후기 수: <span className="font-semibold">{reviews.length}</span></p>
        <p>⭐ 평균 별점: <span className="font-semibold">{avgRating}</span> / 5</p>
        <p>🕒 최근 후기: <span className="text-gray-600">{latestDate || "없음"}</span></p>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4 font-serif">
        <h1 className="text-2xl font-bold text-center text-purple-700">🛠 관리자 후기 관리</h1>

        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">작성된 후기가 없습니다.</p>
        ) : (
          reviews.map((r) => (
            <Card
              key={r.id}
              className="bg-white border border-purple-100 p-4 shadow"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-purple-800">{r.name || "익명"} ({r.advisor})</p>
                <p className="text-yellow-500 text-sm">
                  {"★".repeat(r.rating || 0)}{" "}
                  <span className="text-gray-400">({r.rating || 0})</span>
                </p>
              </div>
              <p className="text-gray-600 text-sm mb-2 whitespace-pre-line">{r.content}</p>
              <div className="text-xs text-gray-400">
                예약일: {r.reservationDate || "-"}<br />
                질문: {r.question || "-"}<br />
                작성일:{" "}
                {r.date &&
                  new Date(r.date).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </div>

              <Button
                className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handleDelete(r.id)}
              >
                삭제하기
              </Button>
            </Card>
          ))
        )}
      </div>
    </>
  );
}