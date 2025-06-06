import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Textarea";
import ReviewList from "../components/ReviewList";

const advisors = [
  {
    id: 1,
    name: "사라",
    desc: "연애 전문 타로마스터",
    image: "/advisors/sara.png",
    intro: "20년 경력의 연애·인생 전문 타로마스터. 다정한 상담으로 유명.",
  },
  {
    id: 2,
    name: "도윤",
    desc: "현실 조언 전문가",
    image: "/advisors/doyoon.png",
    intro: "이성적이고 현실적인 조언을 주는 상담사. 고민 해결에 탁월.",
  },
];

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("choose");
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [question, setQuestion] = useState("");
  const [consults, setConsults] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewTexts, setReviewTexts] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else navigate("/login");
    });
  }, [navigate]);

  const fetchConsults = async () => {
    if (!user) return;
    const q = query(collection(db, "consults"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setConsults(list);
  };

  const fetchReviews = async () => {
    if (!user) return;
    const q = query(collection(db, "reviews"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({ consultId: doc.data().consultId }));
    setReviews(list.map((r) => r.consultId));
  };

  useEffect(() => {
    if (mode === "check") {
      fetchConsults();
      fetchReviews();
    }
  }, [mode]);

  const submitConsult = async () => {
    if (!selectedAdvisor || !question) return alert("상담사와 질문을 모두 입력해주세요");
    await addDoc(collection(db, "consults"), {
      uid: user.uid,
      advisor: selectedAdvisor.name,
      advisorId: selectedAdvisor.id,
      question,
      answer: "",
      createdAt: new Date().toISOString(),
    });
    alert("상담 신청이 완료되었습니다.");
    setMode("choose");
    setSelectedAdvisor(null);
    setQuestion("");
  };

  const submitReview = async (consultId, advisor, text) => {
    if (!text.trim()) return alert("후기 내용을 입력해주세요.");
    await addDoc(collection(db, "reviews"), {
      uid: user.uid,
      advisor,
      consultId,
      content: text,
      rating: 5,
      date: new Date().toISOString(),
      name: user.displayName || "익명",
    });
    alert("후기가 등록되었습니다.");
    setReviews((prev) => [...prev, consultId]);
    setReviewTexts((prev) => ({ ...prev, [consultId]: "" }));
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-purple-100 via-white to-pink-100 p-4 font-serif overflow-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={() => { setMode("apply"); setSelectedAdvisor(null); }}>
            📩 새로운 상담 신청
          </Button>
          <Button onClick={() => setMode("check")}>📜 기존 상담 확인</Button>
        </div>

        {mode === "apply" && selectedAdvisor === null && (
          <>
            <h2 className="text-xl font-bold text-center mb-4 text-purple-800">상담사 선택</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advisors.map((a) => (
                <Card
                  key={a.id}
                  className="relative cursor-pointer"
                  onClick={() => { setSelectedAdvisor(a); setMode("applyInput"); }}
                >
                  <div className="flex items-center gap-3">
                    <img src={a.image} className="w-12 h-12 rounded-full" />
                    <div>
                      <p className="font-bold">{a.name}</p>
                      <p className="text-sm text-gray-600">{a.desc}</p>
                    </div>
                  </div>
                  <p className="text-xs mt-2 text-gray-500">{a.intro}</p>
                </Card>
              ))}
            </div>
            <ReviewList advisor={""} />
          </>
        )}

        {mode === "applyInput" && selectedAdvisor && (
          <div className="mt-6">
            <Card className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <img src={selectedAdvisor.image} className="w-16 h-16 rounded-full" />
                <div>
                  <h3 className="text-lg font-bold text-purple-700">{selectedAdvisor.name}</h3>
                  <p className="text-sm text-gray-600">{selectedAdvisor.desc}</p>
                </div>
              </div>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="ex. 요즘 너무 불안한데 어떻게 해야 할까요?"
              />
              <div className="flex gap-2 mt-3">
                <Button onClick={submitConsult}>상담 신청하기</Button>
                <Button className="bg-gray-300 text-black" onClick={() => { setMode("apply"); setSelectedAdvisor(null); setQuestion(""); }}>
                  상담사 다시 선택
                </Button>
              </div>
            </Card>
            <ReviewList advisor={selectedAdvisor.name} />
          </div>
        )}

        {mode === "check" && (
          <div>
            <h2 className="text-xl font-bold text-center mb-4 text-purple-800">📋 나의 상담 목록</h2>
            {consults.length === 0 ? (
              <p className="text-center text-gray-500">신청한 상담이 없습니다.</p>
            ) : (
              consults.map((c) => (
                <Card key={c.id} className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">🧙 상담사: {c.advisor}</p>
                  <p className="text-sm whitespace-pre-line">💬 질문: {c.question}</p>
                  <p className="text-sm whitespace-pre-line mt-2">✅ 답변: {c.answer || "(아직 상담사가 답변하지 않았습니다)"}</p>
                  <p className="text-xs text-right text-gray-400 mt-2">
                    작성일: {c.createdAt && new Date(c.createdAt).toLocaleDateString("ko-KR")}
                  </p>

                  {c.answer && !reviews.includes(c.id) && (
                    <div className="mt-2">
                      <Textarea
                        placeholder="후기를 작성해주세요"
                        value={reviewTexts[c.id] || ""}
                        onChange={(e) => setReviewTexts({ ...reviewTexts, [c.id]: e.target.value })}
                      />
                      <Button className="mt-2" onClick={() => submitReview(c.id, c.advisor, reviewTexts[c.id])}>
                        후기 작성
                      </Button>
                    </div>
                  )}

                  {reviews.includes(c.id) && (
                    <p className="text-sm text-green-600 mt-2">✅ 이미 후기를 작성하셨습니다.</p>
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
