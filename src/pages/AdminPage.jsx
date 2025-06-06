import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import ReviewList from "../components/ReviewList";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [latestDate, setLatestDate] = useState("");
  const [deletingIds, setDeletingIds] = useState([]);
  const [newAdvisor, setNewAdvisor] = useState({
    id: "",
    password: "",
    name: "",
    phone: "",
    birth: "",
    birthTime: "",
  });

  const correctPassword = "admin123";

  useEffect(() => {
    if (authenticated) {
      loadReviews();
    }
  }, [authenticated]);

  const loadReviews = async () => {
    const snapshot = await getDocs(collection(db, "reviews"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
    setReviews(list);

    const ratings = list.filter((r) => r.rating).map((r) => r.rating);
    const avg =
      ratings.length > 0
        ? (ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length).toFixed(1)
        : 0;
    setAvgRating(avg);

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
    if (!window.confirm("정말로 삭제할까요?")) return;
    setDeletingIds((prev) => [...prev, id]);
    setTimeout(async () => {
      await deleteDoc(doc(db, "reviews", id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setDeletingIds((prev) => prev.filter((d) => d !== id));
    }, 300);
  };

  const handleAdvisorRegister = async (e) => {
    e.preventDefault();
    const email = `${newAdvisor.id}@user.com`;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        newAdvisor.password
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        ...newAdvisor,
        email,
        role: "advisor",
      });

      alert("✅ 상담사 등록 완료!");
      setNewAdvisor({ id: "", password: "", name: "", phone: "", birth: "", birthTime: "" });
    } catch (err) {
      console.error(err);
      alert("❌ 상담사 등록 실패: " + err.message);
    }
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
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6 font-serif">
      <Card className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-purple-700">👤 상담사 등록</h2>
        <form onSubmit={handleAdvisorRegister} className="grid grid-cols-1 gap-2 text-sm">
          <input name="id" placeholder="아이디" value={newAdvisor.id} onChange={(e) => setNewAdvisor({ ...newAdvisor, id: e.target.value })} className="border p-2 rounded" required />
          <input name="password" type="password" placeholder="비밀번호" value={newAdvisor.password} onChange={(e) => setNewAdvisor({ ...newAdvisor, password: e.target.value })} className="border p-2 rounded" required />
          <input name="name" placeholder="이름" value={newAdvisor.name} onChange={(e) => setNewAdvisor({ ...newAdvisor, name: e.target.value })} className="border p-2 rounded" required />
          <input name="phone" placeholder="전화번호" value={newAdvisor.phone} onChange={(e) => setNewAdvisor({ ...newAdvisor, phone: e.target.value })} className="border p-2 rounded" required />
          <input name="birth" placeholder="생년월일 (8자리)" value={newAdvisor.birth} onChange={(e) => setNewAdvisor({ ...newAdvisor, birth: e.target.value })} className="border p-2 rounded" required />
          <select name="birthTime" value={newAdvisor.birthTime} onChange={(e) => setNewAdvisor({ ...newAdvisor, birthTime: e.target.value })} className="border p-2 rounded" required>
            <option value="">-- 생시 선택 --</option>
            <option value="자시">자시 (23:30~1:30)</option>
            <option value="축시">축시 (1:30~3:30)</option>
            <option value="인시">인시 (3:30~5:30)</option>
            <option value="묘시">묘시 (5:30~7:30)</option>
            <option value="진시">진시 (7:30~9:30)</option>
            <option value="사시">사시 (9:30~11:30)</option>
            <option value="오시">오시 (11:30~13:30)</option>
            <option value="미시">미시 (13:30~15:30)</option>
            <option value="신시">신시 (15:30~17:30)</option>
            <option value="유시">유시 (17:30~19:30)</option>
            <option value="술시">술시 (19:30~21:30)</option>
            <option value="해시">해시 (21:30~23:30)</option>
            <option value="모름">모름</option>
          </select>
          <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white py-2">상담사 등록</Button>
        </form>
      </Card>

      {/* 후기 필터 및 정렬용 UI */}
      <ReviewList advisor={""} />

      <div className="bg-white rounded-xl border border-purple-200 shadow p-4 space-y-2 text-sm">
        <h2 className="text-lg font-semibold text-purple-700">📊 후기 통계</h2>
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <p>📋 총 후기 수: <span className="font-bold text-purple-800">{reviews.length}</span></p>
          <p>⭐ 평균 별점: <span className="font-bold text-yellow-500">{avgRating}</span> / 5</p>
          <p>🕒 최근 후기: <span className="text-gray-600">{latestDate || "없음"}</span></p>
        </div>
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-center text-purple-700">🛠 관리자 후기 관리</h1>
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500">작성된 후기가 없습니다.</p>
        ) : (
          reviews.map((r) => (
            <Card
              key={r.id}
              className={`bg-white border border-purple-100 p-4 shadow transition-all duration-300 ease-in-out transform ${
                deletingIds.includes(r.id) ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold text-purple-800">{r.name || "익명"} ({r.advisor})</p>
                <p className="text-yellow-500 text-sm">{"★".repeat(r.rating || 0)} <span className="text-gray-400">({r.rating || 0})</span></p>
              </div>
              <p className="text-gray-600 text-sm mb-2 whitespace-pre-line">{r.content}</p>
              <div className="text-xs text-gray-400">
                예약일: {r.reservationDate || "-"}<br />
                질문: {r.question || "-"}<br />
                작성일: {r.date && new Date(r.date).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <Button className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={() => handleDelete(r.id)}>삭제하기</Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}