import { useState } from 'react';

const RatingStars = ({ rating, onRatingChange, readonly = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`text-2xl transition-all ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${
            star <= (hover || rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

export default RatingStars;
