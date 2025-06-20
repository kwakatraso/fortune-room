import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const fortunes = [
  "오늘은 작은 행운이 따라올 예감이에요.",
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
  const [fortune, setFortune] = useState("");
  const [fortuneText, setFortuneText] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      const score = Math.floor(Math.random() * 31) + 70;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const item = items[Math.floor(Math.random() * items.length)];

      const final = `🔮 ${randomFortune}\n\n📈 오늘의 운세 총점: ${score}점\n🎨 행운의 색: ${color}\n🎁 행운의 아이템: ${item}`;
      setFortune(final);
      const link = "https://fortune-room.netlify.app";
      const shareText = `${final}\n\n🔗 더 많은 운세 보기: ${link}`;
      setFortuneText(shareText);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(fortuneText)
      .then(() => alert("📋 운세가 복사되었어요! 친구에게 붙여넣어보세요."))
      .catch(() => alert("❌ 복사에 실패했습니다. 아래 텍스트를 직접 복사해주세요."));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "⭐ 오늘의 운세",
          text: fortuneText,
        });
      } catch (err) {
        alert("❌ 공유가 취소되었거나 실패했습니다.");
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-yellow-100 via-white to-purple-100 flex items-center justify-center font-serif p-4">
      <Card className="text-center p-8 w-full max-w-md shadow-xl space-y-4">
        <h2 className="text-2xl font-bold text-purple-700">✨ 오늘의 운세 ✨</h2>

        {loading ? (
          <p className="text-gray-600 text-lg animate-pulse">🔮 운세를 확인하는 중...</p>
        ) : (
          <>
            <pre className="text-gray-800 whitespace-pre-wrap text-sm">{fortune}</pre>

            <div className="flex flex-col gap-2">
              <Button onClick={() => window.location.reload()}>🔄 다시 보기</Button>
              <Button onClick={handleShare}>📤 운세 공유하기</Button>
            </div>

            <div className="mt-4 text-left text-sm text-gray-500">
              <p className="mb-1">👇 복사가 안 될 경우 아래 내용을 직접 드래그해서 복사해보세요</p>
              <textarea
                readOnly
                value={fortuneText}
                className="w-full h-32 p-2 border border-gray-300 rounded resize-none text-xs"
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}