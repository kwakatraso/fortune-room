import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
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
  const [rating, setRating] = useState(0);
  const [search, setSearch] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [sortOption, setSortOption] = useState("latest");
  const [ratingFilter, setRatingFilter] = useState(null);
  const [selectedAdvisorForReview, setSelectedAdvisorForReview] = useState(null);
  const reviewListRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, "reviews"));
      const list = snapshot.docs.map((doc) => doc.data());
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
      setReviews(list);

      const ratings = list.filter((r) => r.rating).map((r) => r.rating);
      const avg = ratings.length > 0 ? (ratings.reduce((acc, cur) => acc + cur, 0) / ratings.length).toFixed(1) : 0;
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
    const themes = ["사랑", "재물", "성장", "위험", "새로운 시작"];
    const advice = [
      "당신의 길은 밝아지고 있습니다.",
      "주의가 필요하지만 기회는 곧 옵니다.",
      "과거를 정리하고 앞으로 나아가세요.",
      "마음을 여는 순간 변화가 시작됩니다.",
    ];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    const selectedAdvice = advice[Math.floor(Math.random() * advice.length)];
    setResult(`🔮 질문: ${question}\n💡 주제: ${theme}\n✨ 조언: ${selectedAdvice}`);
    setStep(3);
  };

  const handleReviewSubmit = async () => {
    if (!review || rating === 0) {
      alert("후기와 별점을 모두 입력해주세요!");
      return;
    }

    const newReview = {
      name: name || "익명",
      content: review,
      rating,
      date: new Date().toISOString(),
      advisor: advisor?.name || "선택 안 됨",
      question,
      reservationDate,
    };

    try {
      await addDoc(collection(db, "reviews"), newReview);
      setReviews([...reviews, newReview]);
      setName(""); setReview(""); setRating(0); setAdvisor(null); setReservationDate("");
      setQuestion(""); setFortune(""); setTypingIndex(0); setPaymentDone(false); setStep(0);
      setTimeout(() => reviewListRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
      alert("✅ 후기 작성이 완료되었어요!");
    } catch (e) {
      console.error("후기 저장 실패:", e);
      alert("❌ 저장 중 오류가 발생했어요.");
    }
  };

  const filteredReviews = reviews.filter((r) => {
    return (
      (!selectedAdvisorForReview || r.advisor === selectedAdvisorForReview.name) &&
      (r.name?.includes(search) || r.content?.includes(search) || String(r.rating).includes(search))
    );
  });

  const processedReviews = [...filteredReviews]
    .filter((r) => (ratingFilter ? r.rating === ratingFilter : true))
    .sort((a, b) => {
      if (sortOption === "latest") return new Date(b.date) - new Date(a.date);
      if (sortOption === "high") return b.rating - a.rating;
      if (sortOption === "low") return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-white to-pink-100 font-serif p-4 md:p-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-purple-700">상담사 선택</h2>
          {advisors.map((a) => (
            <div
              key={a.id}
              onClick={() => setSelectedAdvisorForReview(a)}
              className={`cursor-pointer border rounded-xl p-4 shadow hover:shadow-md transition bg-white ${selectedAdvisorForReview?.id === a.id ? "ring-2 ring-purple-400" : ""}`}
            >
              <div className="flex items-center gap-3">
                <img src={a.image} alt={a.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-bold text-lg">{a.name}</p>
                  <p className="text-sm text-gray-500">{a.desc}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2">{a.intro}</p>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-purple-700">💬 사용자 후기</h2>
          <Input
            type="text"
            className="my-2"
            placeholder="후기 검색 (이름/내용/별점)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap gap-2 my-2 text-sm">
            <select className="border px-2 py-1 rounded" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="latest">🕒 최신순</option>
              <option value="high">⭐ 별점 높은 순</option>
              <option value="low">⭐ 별점 낮은 순</option>
            </select>

            <select
              className="border px-2 py-1 rounded"
              value={ratingFilter || ""}
              onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
            >
              <option value="">전체 별점</option>
              <option value="5">⭐ 5점만</option>
              <option value="4">⭐ 4점만</option>
              <option value="3">⭐ 3점만</option>
              <option value="2">⭐ 2점만</option>
              <option value="1">⭐ 1점만</option>
            </select>
          </div>

          {processedReviews.length > 0 ? (
            processedReviews.slice(0, visibleCount).map((r, i) => (
              <div key={i} className="bg-white rounded-xl shadow p-4 mb-3 border border-purple-100">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-purple-700">{r.name || "익명"}</p>
                  {r.rating && (
                    <p className="text-yellow-500 text-sm">
                      {"★".repeat(r.rating)} <span className="text-gray-400 text-xs">({r.rating})</span>
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
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm p-4">
              ❗ 선택한 상담사에 대한 후기가 없습니다.
            </div>
          )}

          {visibleCount < processedReviews.length && (
            <div className="text-center mt-2">
              <Button onClick={() => setVisibleCount((prev) => prev + 3)} className="text-purple-700 border border-purple-300 bg-white hover:bg-purple-50 transition">
                후기 더 보기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
