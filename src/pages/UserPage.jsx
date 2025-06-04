import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { useEffect } from "react";
import { RatingStars } from "../components/RatingStars";

const advisors = [
  { id: 1, name: "사라", desc: "연애 전문 타로마스터" },
  { id: 2, name: "도윤", desc: "현실 조언 전문가" },
];

export default function Home() {
  const [step, setStep] = useState(0);
  const [advisor, setAdvisor] = useState(null);
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [paymentDone, setPaymentDone] = useState(false);
  const [reservationDate, setReservationDate] = useState("");
  const [reserved, setReserved] = useState(false);
  const [fortune, setFortune] = useState("");
  const [rating, setRating] = useState(0); // 별점

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, "reviews"));
      const list = snapshot.docs.map((doc) => doc.data());
      setReviews(list);
    };
    fetchReviews();
  }, []);

  const handleSubmit = () => {
    const randomThemes = ["사랑", "재물", "성장", "위험", "새로운 시작"];
    const randomAdvice = [
      "당신의 길은 밝아지고 있습니다.",
      "주의가 필요하지만 기회는 곧 옵니다.",
      "과거를 정리하고 앞으로 나아가세요.",
      "마음을 여는 순간 변화가 시작됩니다.",
    ];
    const theme = randomThemes[Math.floor(Math.random() * randomThemes.length)];
    const advice = randomAdvice[Math.floor(Math.random() * randomAdvice.length)];
    setResult(`🔮 질문: ${question}\n💡 주제: ${theme}\n✨ 조언: ${advice}`);
    setStep(3);
  };

  const handleReviewSubmit = async () => {
    if (!review) return;

    const reviewData = {
      name: name || "익명",
      content: review,
      rating,
      date: new Date().toISOString(),
      advisor: advisor?.name || "선택 안 됨",
      question,
      reservationDate,
    };

    try {
      await addDoc(collection(db, "reviews"), reviewData);
      setReviews([...reviews, reviewData]); // 로컬에도 추가
      setReview("");
      setStep(0); // 다시 첫 화면으로
    } catch (e) {
      console.error("후기 저장 실패:", e);
    }
  };

  function handlePayment() {
  // 결제 시뮬 + 운세 결과 생성
  const result = "🌟 당신에게 곧 좋은 일이 찾아올 것입니다!";
  setFortune(result);
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-pink-100 font-serif p-4">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center text-purple-800">
          운세룸 - 내 마음의 이야기
        </h1>

        {step === 0 && (
          <Card>
            <p className="text-lg font-semibold">상담사를 선택하세요</p>
            <div className="space-y-2 mt-2">
              {advisors.map((a) => (
                <Button key={a.id} onClick={() => { setAdvisor(a); setStep(1); }}>
                  {a.name} – {a.desc}
                </Button>
              ))}
            </div>
          </Card>
        )}

        {step === 1 && (
        <Card>
            <p className="text-lg">상담 받을 날짜를 선택해주세요</p>
            <Input
            type="date"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
            />
            <Button
            className="mt-2"
            onClick={() => {
                if (reservationDate) {
                setReserved(true);
                setStep(2); // 질문 입력 단계로 넘어감
                }
            }}
            >
            예약하고 질문 작성하기
            </Button>
        </Card>
        )}


        {step === 2 && (
          <Card>
            <p className="text-lg mb-2">궁금한 질문을 입력해주세요</p>
            <Textarea
              placeholder="ex. 앞으로의 진로는 어떻게 될까요?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button
              className="mt-4"
              onClick={() => {
                if (question) {
                  handlePayment();
                  setStep(3);
                }
              }}
            >
              운세 해석 요청 + 결제 시뮬
            </Button>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <h2 className="text-xl font-bold mb-2">🔮 운세 해석 결과</h2>
            <p className="mb-2">{fortune}</p>
            <p className="text-sm text-gray-600 mb-4">
              예약일: {reservationDate} / 상담사: {advisor?.name}
            </p>

            <RatingStars rating={rating} onChange={setRating} />

            <Textarea
              placeholder="후기를 남겨주세요"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <p className="mt-2 text-sm">별점을 선택해주세요:</p>
            <RatingStars value={rating} onChange={setRating} />

            <Button
              className="mt-2"
              onClick={() => {
                if (review && rating > 0) {
                  handleReviewSubmit();
                } else {
                  alert("후기와 별점을 모두 입력해주세요!");
                }
              }}
            >
              후기 작성하기
            </Button>

            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-1">📣 후기</h3>
              {reviews.map((r, i) => (
                <div key={i} className="border-t pt-2 text-sm text-gray-700">
                  <p>
                    ⭐{" "}
                    {typeof r === "string"
                      ? "(별점 없음)"
                      : "★".repeat(r.rating || 0)}
                  </p>
                  <p>{typeof r === "string" ? r : r.content}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {reviews.length > 0 && (
          <Card>
            <h2 className="text-lg font-semibold">💬 사용자 후기</h2>
            {reviews.map((r, index) => (
              <div key={index} className="border-b py-2">
                <p className="font-bold">{typeof r === "object" ? r.name : "익명"}</p>
                {typeof r === "object" && r.rating && (
                  <p className="text-yellow-500">{"★".repeat(r.rating)}</p>
                )}
                <p>{typeof r === "object" ? r.content : r}</p>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}