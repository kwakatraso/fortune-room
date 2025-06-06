import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
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
  const [mode, setMode] = useState("choose"); // choose, apply, applyInput, check
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [question, setQuestion] = useState("");
  const [consults, setConsults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      if (u) setUser(u);
      else navigate("/login");
    });
  }, [navigate]);

  const toggleAdvisor = (advisor) => {
    if (selectedAdvisor?.id === advisor.id) {
      setSelectedAdvisor(null);
    } else {
      setSelectedAdvisor(advisor);
    }
  };

  const submitConsult = async () => {
    if (!selectedAdvisor || !question) return alert("상담사와 질문을 모두 입력해주세요");
    try {
      await addDoc(collection(db, "consults"), {
        uid: user.uid,
        advisor: selectedAdvisor.name,
        advisorId: selectedAdvisor.id,
        question,
        answer: "",
        createdAt: new Date().toISOString(),
      });
      alert("상담 신청이 완료되었습니다");
      setMode("choose");
      setSelectedAdvisor(null);
      setQuestion("");
    } catch (err) {
      console.error(err);
      alert("상담 신청 실패");
    }
  };

  const fetchConsults = async () => {
    if (!user) return;
    const q = query(collection(db, "consults"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setConsults(list);
  };

  useEffect(() => {
    if (mode === "check") fetchConsults();
  }, [mode]);

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-purple-100 via-white to-pink-100 p-4 font-serif overflow-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-center gap-4 mb-6">
          <Button onClick={() => { setMode("apply"); setSelectedAdvisor(null); }}>📩 새로운 상담 신청</Button>
          <Button onClick={() => setMode("check")}>📜 기존 상담 확인</Button>
        </div>

        {mode === "apply" && (
          <div>
            <h2 className="text-xl font-bold text-center mb-4 text-purple-800">상담사 선택</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advisors.map((a) => (
                <Card
                  key={a.id}
                  className={`relative cursor-pointer ${selectedAdvisor?.id === a.id ? "ring-2 ring-purple-500" : ""}`}
                  onClick={() => toggleAdvisor(a)}
                >
                  <div className="flex items-center gap-3">
                    <img src={a.image} className="w-12 h-12 rounded-full" alt={a.name} />
                    <div>
                      <p className="font-bold">{a.name}</p>
                      <p className="text-sm text-gray-600">{a.desc}</p>
                    </div>
                  </div>
                  <p className="text-xs mt-2 text-gray-500">{a.intro}</p>
                  <div className="mt-3">
                    <button
                      className="text-sm text-white bg-purple-500 hover:bg-purple-600 px-3 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMode("applyInput");
                      }}
                    >
                      선택
                    </button>
                  </div>
                </Card>
              ))}
            </div>

            <ReviewList advisor={selectedAdvisor?.name} key={selectedAdvisor?.id || "all"} />
          </div>
        )}

        {mode === "applyInput" && selectedAdvisor && (
          <div className="mt-6">
            <Button onClick={() => setMode("apply")} className="mb-3">
              ← 뒤로
            </Button>
            <h3 className="text-lg font-semibold mb-2 text-purple-700">상담 질문 입력</h3>
            <Textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="ex. 요즘 너무 불안한데 어떻게 해야 할까요?"
            />
            <Button className="mt-3" onClick={submitConsult}>
              상담 신청하기
            </Button>
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
                    작성일: {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                  </p>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
