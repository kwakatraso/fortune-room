export default function AdvisorPage() {
  const dummyQuestions = [
    {
      id: 1,
      user: "익명1",
      date: "2025-06-01",
      question: "올해 취업운이 어떻게 될까요?",
    },
    {
      id: 2,
      user: "익명2",
      date: "2025-06-03",
      question: "헤어진 사람과 재회가 가능할까요?",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 font-serif">
      <h1 className="text-2xl font-bold text-purple-700 mb-4">📋 상담 요청 목록</h1>
      {dummyQuestions.map((q) => (
        <div key={q.id} className="border-b py-4">
          <p className="text-sm text-gray-500">{q.date} / {q.user}</p>
          <p className="text-lg">{q.question}</p>
        </div>
      ))}
    </div>
  );
}
