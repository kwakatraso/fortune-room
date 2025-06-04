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
  const [search, setSearch] = useState("");
  const [typingIndex, setTypingIndex] = useState(0); // 타이핑 애니메이션용
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, "reviews"));
      const list = snapshot.docs.map((doc) => doc.data());
      setReviews(list);

      // ⭐ 평균 별점 계산
      const ratings = list
        .filter((r) => typeof r === "object" && r.rating)
        .map((r) => r.rating);
      const avg =
        ratings.length > 0
          ? (ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length).toFixed(1)
          : 0;
      setAverageRating(avg);
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    if (typingIndex < fortune.length) {
      const timeout = setTimeout(() => {
        setTypingIndex((prev) => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, fortune]);

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
  setTypingIndex(0); // 타이핑 효과 초기화
  setStep(3); // 운세 결과 페이지로 이동
}
  const filteredReviews = reviews.filter((r) => {
    // 예전 데이터 호환 처리
    const name = typeof r === "object" ? (r.name || "") : "";
    const content = typeof r === "object" ? (r.content || "") : r;
    const rating = typeof r === "object" && r.rating ? String(r.rating) : "";
    return (
      name.includes(search) ||
      content.includes(search) ||
      rating.includes(search)
    );
  });

  const handleCopyResult = () => {
    const fullText = `✨ 운세 결과 ✨\n${fortune}`;
    navigator.clipboard.writeText(fullText).then(() => {
      alert("결과가 클립보드에 복사되었어요!");
    });
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-pink-100 font-serif p-4 md:p-6">
      <div className="max-w-md md:max-w-xl mx-auto space-y-4">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-purple-800">
          운세룸 - 내 마음의 이야기
        </h1>
        <p className="text-center text-yellow-500 text-sm">
          ⭐ 평균 별점: {averageRating} / 5
        </p>

        {step === 0 && (
          <Card>
            <p className="text-lg font-semibold mb-2">상담사를 선택하세요</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {advisors.map((a) => (
                <button
                  key={a.id}
                  onClick={() => { setAdvisor(a); setStep(1); }}
                  className="flex flex-col items-center border rounded-2xl p-4 bg-white hover:shadow-lg transition"
                >
                  <img
                    src={a.image}
                    alt={a.name}
                    className="w-24 h-24 object-cover rounded-full mb-2"
                  />
                  <p className="font-bold">{a.name}</p>
                  <p className="text-sm text-gray-600 mb-2">{a.desc}</p>
                  <p className="text-xs text-gray-500">{a.intro}</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        {step === 1 && (
        <Card>
            <p className="text-lg">상담 받을 날짜를 선택해주세요</p>
            <Input
            className="w-full md:w-auto"
            type="date"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
            />
            <Button
            className="mt-2 w-full md:w-auto"
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
              className="mt-2 w-full md:w-auto"
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
            
            {advisor && (
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={advisor.image}
                  alt={advisor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">{advisor.name}</p>
                  <p className="text-xs text-gray-600">{advisor.desc}</p>
                </div>
              </div>
            )}

            <p className="mb-2 whitespace-pre-line">
              {fortune.slice(0, typingIndex)}
              {typingIndex < fortune.length && <span className="animate-pulse">|</span>}
            </p>

            <Button
              className="mb-2 w-full md:w-auto"
              onClick={handleCopyResult}
            >
              결과 공유하기
            </Button>

            <p className="text-sm text-gray-600 mb-4">
              예약일: {reservationDate} / 상담사: {advisor?.name}
            </p>

            <RatingStars rating={rating} onChange={setRating} />

            <Textarea
              className="w-full md:w-auto"
              placeholder="후기를 남겨주세요"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />

            <p className="mt-2 text-sm">별점을 선택해주세요:</p>
            <RatingStars value={rating} onChange={setRating} />

            <Button
              className="mt-2 w-full md:w-auto"
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
            <Input
              type="text"
              className="w-full md:w-auto"
              placeholder="후기 검색 (상담사/내용/별점)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {filteredReviews.map((r, index) => (
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