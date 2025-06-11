import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";

const fortunes = [
  {
    text: "오늘은 당신에게 기쁜 소식이 찾아올 것입니다.",
    score: 85,
    color: "노란색",
    item: "행운의 열쇠고리",
  },
  {
    text: "새로운 도전이 좋은 성과를 가져올 수 있어요.",
    score: 92,
    color: "하늘색",
    item: "책갈피",
  },
  {
    text: "잠시 휴식을 취하는 것이 도움이 됩니다.",
    score: 70,
    color: "초록색",
    item: "아로마캔들",
  },
  {
    text: "뜻밖의 사람이 당신에게 도움을 줄 것입니다.",
    score: 78,
    color: "보라색",
    item: "메모지",
  },
];

export default function FortunePage() {
  const [fortune, setFortune] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const random = fortunes[Math.floor(Math.random() * fortunes.length)];
      setFortune(random);
      setLoading(false);
    }, 2000); // 2초 로딩
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-red-100 flex flex-col items-center justify-center text-center font-serif p-6">
      <h1 className="text-2xl font-bold text-purple-800 mb-6">🔮 오늘의 운세</h1>
      {loading ? (
        <p className="text-lg text-gray-700 animate-pulse">오늘의 운세를 확인하는 중...</p>
      ) : (
        <div className="bg-white p-6 rounded shadow-lg w-full max-w-md space-y-4">
          <p className="text-xl font-semibold text-purple-600">"{fortune.text}"</p>
          <p className="text-sm text-gray-600">총점: {fortune.score}점</p>
          <p className="text-sm text-gray-600">행운의 색: {fortune.color}</p>
          <p className="text-sm text-gray-600">행운의 아이템: {fortune.item}</p>
          <Button onClick={() => window.location.reload()}>다시 보기</Button>
        </div>
      )}
    </div>
  );
}