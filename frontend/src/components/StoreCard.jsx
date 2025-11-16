import RatingStars from './RatingStars';

const StoreCard = ({ store, onRate, userRating }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h3>
      <p className="text-gray-600 text-sm mb-4">{store.address}</p>
      
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <RatingStars rating={parseFloat(store.avg_rating)} readonly />
          <span className="text-sm font-medium text-gray-700">
            {store.avg_rating}
          </span>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          {store.rating_count} {store.rating_count === 1 ? 'rating' : 'ratings'}
        </span>
      </div>

      {userRating && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 font-medium mb-1">Your Rating:</p>
          <RatingStars rating={userRating.rating} readonly />
        </div>
      )}

      <button
        onClick={() => onRate(store)}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
      >
        {userRating ? 'Update Rating' : 'Rate Store'}
      </button>
    </div>
  );
};

export default StoreCard;
