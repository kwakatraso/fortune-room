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

  // 로그인된 상담사의 이름 불러오기
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const advisorSnapshot = await getDocs(
          query(collection(db, "users"), where("email", "==", user.email)) // 🔧 수정: uid → email
        );
        const advisorData = advisorSnapshot.docs[0]?.data();
        if (advisorData?.role === "advisor") {
          setAdvisorName(advisorData.name); // ex. "도윤"
        } else {
          alert("상담사 권한이 없습니다.");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // 본인에게 온 상담 요청 목록 불러오기
  useEffect(() => {
    if (!advisorName) return;

    const fetchSessions = async () => {
      const snapshot = await getDocs(
        query(collection(db, "consults"), where("advisor", "==", advisorName))
      );
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
    if (!answer) {
      alert("답변을 입력해주세요.");
      return;
    }

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

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 p-6 font-serif overflow-auto">
      <h1 className="text-2xl font-bold text-purple-800 mb-6 text-center">
        상담 요청 목록
      </h1>

      {sessions.length === 0 ? (
        <p className="text-center text-gray-500">📭 아직 상담 요청이 없습니다.</p>
      ) : (
        sessions.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-xl shadow p-4 mb-6 border border-purple-100"
          >
            <p className="text-sm text-gray-500 mb-1">
              👤 사용자 ID: {s.uid} | 신청일:{" "}
              {new Date(s.createdAt).toLocaleString("ko-KR")}
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

      {/* 상담사에 대한 후기 확인 */}
      {advisorName && (
        <div className="mt-12">
          <ReviewList advisor={advisorName} />
        </div>
      )}
    </div>
  );
}
