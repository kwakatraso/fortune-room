import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function ReviewList({ advisor }) {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sort, setSort] = useState("latest"); // latest | high | low

  useEffect(() => {
    const fetchReviews = async () => {
      const baseQuery = advisor
        ? query(collection(db, "reviews"), where("advisor", "==", advisor))
        : query(collection(db, "reviews"));

      const snapshot = await getDocs(baseQuery);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReviews(list);
    };

    fetchReviews();
  }, [advisor]);

  const getFilteredSortedReviews = () => {
    let filtered = [...reviews];

    if (search) {
      filtered = filtered.filter((r) =>
        r.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (ratingFilter > 0) {
      filtered = filtered.filter((r) => r.rating >= ratingFilter);
    }

    if (sort === "latest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === "high") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === "low") {
      filtered.sort((a, b) => a.rating - b.rating);
    }

    return filtered;
  };

  const sortedReviews = getFilteredSortedReviews();

  return (
    <div className="bg-white bg-opacity-60 p-4 rounded-xl shadow mt-6">
      <h3 className="text-lg font-bold text-purple-700 mb-4">
        📝 {advisor ? `${advisor} 상담사에 대한 후기` : "상담 후기 목록"}
      </h3>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="내용 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value={0}>⭐ 전체 별점</option>
          <option value={3}>⭐ 3점 이상</option>
          <option value={4}>⭐ 4점 이상</option>
          <option value={5}>⭐ 5점만</option>
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="latest">🕒 최신순</option>
          <option value="high">⬆️ 별점 높은순</option>
          <option value="low">⬇️ 별점 낮은순</option>
        </select>
      </div>

      {sortedReviews.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">후기가 없습니다.</p>
      ) : (
        sortedReviews.map((r) => (
          <div
            key={r.id}
            className="border rounded p-3 mb-3 bg-white bg-opacity-80"
          >
            <p className="text-sm text-gray-800 mb-1">💬 {r.content}</p>
            <p className="text-xs text-gray-600">
              ⭐ {r.rating}점 | {r.name || "익명"} |{" "}
              {new Date(r.date).toLocaleDateString("ko-KR")}
            </p>
          </div>
        ))
      )}
    </div>
  );
}