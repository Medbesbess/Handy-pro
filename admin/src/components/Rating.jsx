import React from "react";
import { Star, StarHalf, Star as StarOutline } from "lucide-react";

 const Rating = ({ rating }) => {
  // Round rating to nearest 0.5
  const roundedRating = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(roundedRating);
  const hasHalfStar = roundedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex">
      {/* Render full stars */}
      {[...Array(fullStars)].map((_, index) => (
        <Star key={`full-${index}`} className="h-5 w-5 text-yellow-500" />
      ))}
      {/* Render half star if applicable */}
      {hasHalfStar && <StarHalf className="h-5 w-5 text-yellow-500" />}
      {/* Render empty stars */}
      {[...Array(emptyStars)].map((_, index) => (
        <StarOutline key={`empty-${index}`} className="h-5 w-5 text-gray-300" />
      ))}
    </div>
  );
};

export default Rating