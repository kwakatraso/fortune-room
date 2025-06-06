import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import ReviewList from "../components/ReviewList";

export default function AdvisorPage() {
  const [sessions, setSessions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [advisorName, setAdvisorName] = useState("");
  const [tab, setTab] = useState("pending"); // pending | answered

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const advisorSnapshot = await getDocs(
          query(collection(db, "users"), where("email", "==", user.email))
        );
        const advisorData = advisorSnapshot.docs[0]?.data();
        if (advisorData?.role === "advisor") {
          setAdvisorName(advisorData.name);
        } else {
          alert("상담사 권한이 없습니다.");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!advisorName) return;

    const fetchSessions = async () => {
      const snapshot = await getDocs(
        query(collection(db, "consults"), where("advisor", "==", advisorName))
      );

      const list = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const consult = { id: docSnap.id, ...docSnap.data() };

          let birth = "-";
          let birthTime = "-";

          if (consult.uid) {
            const userDoc = await getDoc(doc(db, "users", consult.uid));
            const userData = userDoc.exists() ? userDoc.data() : null;
            if (userData) {
              birth = userData.birth || "-";
              birthTime = userData.birthTime || "-";
            }
          }

          return {
            ...consult,
            birth,
            birthTime,
          };
        })
      );

      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setSessions(list);
    };

    fetchSessions();
  }, [advisorName]);

  const handleAnswerChange = (id, text) => {
    setAnswers((prev) => ({ ...prev, [id]: text }));
  };

  const submitAnswer = async (id) => {
    const answer = answers[id];
    if (!answer) return alert("답변을 입력해주세요.");

    await updateDoc(doc(db, "consults", id), {
      answer,
      answeredAt: new Date().toISOString(),
    });

    alert("답변이 등록되었습니다.");
    setAnswers((prev) => ({ ...prev, [id]: "" }));
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, answer } : s))
    );
  };

  const filteredSessions = sessions.filter((s) =>
    tab === "pending" ? !s.answer : !!s.answer
  );

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-6 font-serif overflow-auto">
      <h1 className="text-2xl font-bold text-purple-800 mb-6 text-center">
        상담 요청 목록
      </h1>

      {/* 탭 */}
      <div className="flex justify-center gap-4 mb-6">
        <Button
          onClick={() => setTab("pending")}
          className={`px-4 py-2 rounded ${
            tab === "pending" ? "bg-purple-600 text-white" : "bg-white"
          }`}
        >
          📥 대기중 상담
        </Button>
        <Button
          onClick={() => setTab("answered")}
          className={`px-4 py-2 rounded ${
            tab === "answered" ? "bg-purple-600 text-white" : "bg-white"
          }`}
        >
          ✅ 답변 완료
        </Button>
      </div>

      {filteredSessions.length === 0 ? (
        <p className="text-center text-gray-500">해당 목록이 없습니다.</p>
      ) : (
        filteredSessions.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl shadow p-4 mb-6 border border-purple-100"
          >
            <p className="text-sm text-gray-600 mb-1">
              👤 사용자 ID: {s.uid}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              🎂 생년월일: {s.birth} / 🕒 생시: {s.birthTime}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              📅 신청일:{" "}
              {s.createdAt &&
                new Date(s.createdAt).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
            </p>

            <p className="text-gray-800 mb-2 whitespace-pre-line">
              💬 질문: {s.question}
            </p>

            {s.answer ? (
              <div className="bg-purple-50 p-3 rounded mt-2 text-sm text-gray-700">
                <p className="font-semibold text-purple-700 mb-1">📩 답변</p>
                <p className="whitespace-pre-line">{s.answer}</p>
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                <Textarea
                  placeholder="답변을 입력해주세요"
                  value={answers[s.id] || ""}
                  onChange={(e) => handleAnswerChange(s.id, e.target.value)}
                />
                <Button onClick={() => submitAnswer(s.id)}>답변 제출</Button>
              </div>
            )}
          </div>
        ))
      )}

      {advisorName && (
        <div className="mt-12">
          <ReviewList advisor={advisorName} />
        </div>
      )}
    </div>
  );
}