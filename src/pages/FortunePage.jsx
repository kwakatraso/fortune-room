import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const fortunes = [
  "오늘은 작은 행운이 따를 예감이에요.",
  "마음먹은 일이 순조롭게 풀릴 것 같아요.",
  "예상치 못한 기회가 찾아올 수도 있어요.",
  "지금 하는 선택이 당신의 미래를 바꿔요.",
  "주변 사람들과의 관계에 신경 써보세요.",
  "감정적이지 말고 현명하게 판단하세요.",
  "노력의 결과가 서서히 드러나는 날이에요.",
];

const colors = ["빨간색", "노란색", "파란색", "보라색", "초록색", "검정색"];
const items = ["볼펜", "책", "손거울", "이어폰", "지갑", "열쇠고리"];

export default function FortunePage() {
  const [loading, setLoading] = useState(true);
  const [fortune, setFortune] = useState({ text: "", score: 0, color: "", item: "" });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      const score = Math.floor(Math.random() * 71) + 30;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const item = items[Math.floor(Math.random() * items.length)];

      setFortune({ text: randomFortune, score, color, item });
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-yellow-100 via-white to-purple-100 flex items-center justify-center font-serif p-4">
      <Card className="text-center p-8 w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-2xl font-bold text-purple-700 mb-2">✨ 오늘의 운세 ✨</h2>
        {loading ? (
          <p className="text-gray-600 text-lg animate-pulse">🔮 운세를 확인하는 중...</p>
        ) : (
          <>
            <p className="text-lg font-semibold text-purple-700">{fortune.text}</p>
            <p>📈 총점: <span className="font-bold">{fortune.score}점</span></p>
            <p>🎨 행운의 색: {fortune.color}</p>
            <p>🎁 행운의 아이템: {fortune.item}</p>

            <Button className="mt-4" onClick={() => window.location.reload()}>
              🔄 다시 보기
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
