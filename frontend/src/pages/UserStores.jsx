import { useState, useEffect } from 'react';
import { getStores } from '../services/stores';
import { createRating, updateRating } from '../services/ratings';
import NavBar from '../components/NavBar';
import StoreCard from '../components/StoreCard';
import Modal from '../components/Modal';
import RatingStars from '../components/RatingStars';
import Toast from '../components/Toast';
import PasswordUpdateModal from '../components/PasswordUpdateModal';

const UserStores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [sort, setSort] = useState('name');
  const [selectedStore, setSelectedStore] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [toast, setToast] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const data = await getStores({ search, address: addressFilter, sort });
      setStores(data.stores);
    } catch (error) {
      setToast({ message: 'Failed to load stores', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchStores, 300);
    return () => clearTimeout(timer);
  }, [search, addressFilter, sort]);

  const handleRateClick = (store) => {
    setSelectedStore(store);
    setRating(store.user_rating?.rating || 0);
    setComment(store.user_rating?.comment || '');
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      setToast({ message: 'Please select a rating', type: 'error' });
      return;
    }

    try {
      const ratingData = { store_id: selectedStore.id, rating, comment };
      
      if (selectedStore.user_rating) {
        await updateRating(selectedStore.user_rating.id, { rating, comment });
        setToast({ message: 'Rating updated successfully!', type: 'success' });
      } else {
        await createRating(ratingData);
        setToast({ message: 'Rating submitted successfully!', type: 'success' });
      }
      
      setSelectedStore(null);
      fetchStores();
    } catch (error) {
      setToast({ message: error.response?.data?.error || 'Failed to submit rating', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Browse Stores</h1>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Update Password
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="text"
              placeholder="Filter by address..."
              value={addressFilter}
              onChange={(e) => setAddressFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="created_at">Sort by Date</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Loading stores...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No stores found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                userRating={store.user_rating}
                onRate={handleRateClick}
              />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!selectedStore}
        onClose={() => setSelectedStore(null)}
        title={selectedStore?.user_rating ? 'Update Rating' : 'Rate Store'}
      >
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2">{selectedStore?.name}</h3>
          <p className="text-sm text-gray-600 mb-4">Select your rating:</p>
          <div className="flex justify-center mb-4">
            <RatingStars rating={rating} onRatingChange={setRating} />
          </div>
          <textarea
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows="3"
          />
        </div>
        <button
          onClick={handleSubmitRating}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          Submit Rating
        </button>
      </Modal>

      <PasswordUpdateModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default UserStores;
