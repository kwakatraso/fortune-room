export default function RatingStars({ rating, onChange }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer text-2xl ${
            star <= rating ? "text-yellow-400" : "text-gray-400"
          }`}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}