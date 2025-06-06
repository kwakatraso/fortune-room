import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { useEffect } from "react";
import { RatingStars } from "../components/RatingStars";
import { useRef } from "react";

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
  const [visibleCount, setVisibleCount] = useState(3); // 초기 3개만 표시
  const [sortOption, setSortOption] = useState("latest");
  const [ratingFilter, setRatingFilter] = useState(null); // null은 전체 보기

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, "reviews"));
      const list = snapshot.docs.map((doc) => doc.data());
      list.sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순 정렬
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

  const reviewListRef = useRef(null);
  
  const handleReviewSubmit = async () => {
    if (!review || rating === 0) {
      alert("후기와 별점을 모두 입력해주세요!");
      return;
    }

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
      setReviews([...reviews, reviewData]); // 로컬에 추가
      setReview("");
      setRating(0);
      setName("");
      setReservationDate("");
      setAdvisor(null);
      setQuestion("");
      setFortune("");
      setTypingIndex(0);
      setPaymentDone(false);

      setStep(0); // 첫 화면으로 이동

      // ✅ 후기 영역으로 부드럽게 이동
      setTimeout(() => {
        if (reviewListRef.current) {
          reviewListRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 300);

      alert("✅ 후기 작성이 완료되었어요!");
    } catch (e) {
      console.error("후기 저장 실패:", e);
      alert("❌ 저장 중 오류가 발생했어요.");
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

  const processedReviews = [...filteredReviews]
    .filter((r) => (ratingFilter ? r.rating === ratingFilter : true))
    .sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.date) - new Date(a.date);
      }
      if (sortOption === "high") {
        return b.rating - a.rating;
      }
      if (sortOption === "low") {
        return a.rating - b.rating;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-pink-100 font-serif p-4 md:p-6">
      <div className="max-w-md md:max-w-xl mx-auto space-y-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-purple-800">
          운세룸 - 내 마음의 이야기
        </h1>
        <p className="text-center text-yellow-500 text-sm">
          ⭐ 평균 별점: {averageRating} / 5
        </p>

        {step === 0 && (
          <Card>
            <h2 className="text-xl font-bold text-purple-700 mb-2">1단계. 상담사 선택</h2>
            <p className="text-sm text-gray-600 mb-4">마음이 가는 상담사를 선택해주세요.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advisors.map((a) => (
                <button
                  key={a.id}
                  onClick={() => {
                    setAdvisor(a);
                    setStep(1);
                  }}
                  className="border rounded-xl p-4 shadow hover:shadow-md transition text-left bg-white"
                >
                  <p className="font-bold text-lg">{a.name}</p>
                  <p className="text-sm text-gray-500">{a.desc}</p>
                </button>
              ))}
            </div>
          </Card>
        )}

        {step === 1 && (
          <Card>
            <h2 className="text-xl font-bold text-purple-700 mb-2">2단계. 예약 날짜 선택</h2>
            <p className="text-sm text-gray-600 mb-4">
              상담을 원하는 날짜를 선택해주세요.
            </p>
            <Input
              type="date"
              className="w-full"
              value={reservationDate}
              onChange={(e) => setReservationDate(e.target.value)}
            />
            <Button
              className="mt-4 w-full md:w-auto"
              onClick={() => {
                if (reservationDate) {
                  setReserved(true);
                  setStep(2);
                }
              }}
            >
              예약하고 다음 단계로 →
            </Button>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <h2 className="text-xl font-bold text-purple-700 mb-2">3단계. 질문 작성 및 결과 확인</h2>

            {!paymentDone ? (
              <>
                <p className="text-sm text-gray-600 mb-2">궁금한 점을 입력해주세요</p>
                <Textarea
                  placeholder="ex. 앞으로의 진로는 어떻게 될까요?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                <Button
                  className="mt-4 w-full md:w-auto"
                  onClick={() => {
                    if (question) {
                      handlePayment();
                      setPaymentDone(true);
                    } else {
                      alert("질문을 입력해주세요!");
                    }
                  }}
                >
                  운세 해석 요청 + 결제 시뮬
                </Button>
              </>
            ) : (
              <>
                {/* 상담사 정보 표시 */}
                {advisor && (
                  <div className="flex items-center gap-3 mb-4 mt-2">
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

                {/* 운세 결과 */}
                <p className="mb-2 whitespace-pre-line">{fortune}</p>
                <p className="text-sm text-gray-600 mb-4">
                  예약일: {reservationDate} / 상담사: {advisor?.name}
                </p>

                {/* 후기 작성 */}
                <p className="text-sm">별점을 선택해주세요:</p>
                <RatingStars value={rating} onChange={setRating} />

                <Textarea
                  className="w-full mt-2 text-sm sm:text-base"
                  placeholder="후기를 남겨주세요"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />

                <Button
                  className="mt-2 w-full"
                  onClick={handleReviewSubmit}
                >
                  후기 작성 완료
                </Button>
              </>
            )}
          </Card>
        )}

        <Card ref={reviewListRef}>
          <h2 className="text-lg font-semibold text-purple-700">💬 사용자 후기</h2>

          <Input
            type="text"
            className="my-2"
            placeholder="후기 검색 (이름/내용/별점)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-2 my-2 text-sm">
            <select
              className="border px-2 py-1 rounded"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="latest">🕒 최신순</option>
              <option value="high">⭐ 별점 높은 순</option>
              <option value="low">⭐ 별점 낮은 순</option>
            </select>

            <select
              className="border px-2 py-1 rounded"
              value={ratingFilter || ""}
              onChange={(e) =>
                setRatingFilter(e.target.value ? parseInt(e.target.value) : null)
              }
            >
              <option value="">전체 별점</option>
              <option value="5">⭐ 5점만</option>
              <option value="4">⭐ 4점만</option>
              <option value="3">⭐ 3점만</option>
              <option value="2">⭐ 2점만</option>
              <option value="1">⭐ 1점만</option>
            </select>
          </div>

          {filteredReviews.length > 0 ? (
            <>
              {processedReviews.slice(0, visibleCount).map((r, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow p-4 mb-3 border border-purple-100"
                >
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-purple-700">{r.name || "익명"}</p>
                    {r.rating && (
                      <p className="text-yellow-500 text-sm">
                        {"★".repeat(r.rating)}{" "}
                        <span className="text-gray-400 text-xs">({r.rating})</span>
                      </p>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-line">{r.content}</p>
                  <p className="text-gray-400 text-xs text-right mt-2">
                    {new Date(r.date).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}

              {visibleCount < processedReviews.length && (
                <div className="text-center mt-2">
                  <Button
                    onClick={() => setVisibleCount((prev) => prev + 3)}
                    className="text-purple-700 border border-purple-300 bg-white hover:bg-purple-50 transition"
                  >
                    후기 더 보기
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 text-sm p-4">
              ❗아직 작성된 후기가 없어요.<br />
              첫 번째 후기를 남겨주세요!
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}