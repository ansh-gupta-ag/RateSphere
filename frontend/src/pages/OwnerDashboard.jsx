import { useState, useEffect } from 'react';
import { getStores, getStoreRaters } from '../services/stores';
import { getCurrentUser } from '../services/auth';
import NavBar from '../components/NavBar';
import Toast from '../components/Toast';
import PasswordUpdateModal from '../components/PasswordUpdateModal';

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [raters, setRaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    fetchOwnerStores();
  }, []);

  const fetchOwnerStores = async () => {
    try {
      setLoading(true);
      const data = await getStores({ limit: 100 });
      const ownerStores = data.stores.filter(store => store.owner_id === user.id);
      setStores(ownerStores);
      if (ownerStores.length > 0) {
        setSelectedStore(ownerStores[0]);
        fetchRaters(ownerStores[0].id);
      }
    } catch (error) {
      setToast({ message: 'Failed to load stores', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchRaters = async (storeId) => {
    try {
      const data = await getStoreRaters(storeId);
      setRaters(data.raters);
    } catch (error) {
      setToast({ message: 'Failed to load raters', type: 'error' });
    }
  };

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    fetchRaters(store.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex items-center justify-center h-96">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Store Owner Dashboard</h1>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Update Password
          </button>
        </div>

        {stores.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-xl text-gray-600">You don't own any stores yet.</p>
            <p className="text-gray-500 mt-2">Contact an administrator to assign stores to your account.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Your Stores</h2>
                <div className="space-y-3">
                  {stores.map((store) => (
                    <button
                      key={store.id}
                      onClick={() => handleStoreSelect(store)}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        selectedStore?.id === store.id
                          ? 'bg-primary-100 border-2 border-primary-600'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <h3 className="font-semibold text-gray-800">{store.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-2xl text-yellow-400">★</span>
                        <span className="font-medium">{store.avg_rating}</span>
                        <span className="text-sm text-gray-500">
                          ({store.rating_count} ratings)
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Ratings for {selectedStore?.name}
                </h2>

                {raters.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No ratings yet</p>
                ) : (
                  <div className="space-y-4">
                    {raters.map((rater) => (
                      <div key={rater.id} className="border-b pb-4 last:border-b-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-800">{rater.user_name}</h3>
                            <p className="text-sm text-gray-500">{rater.user_email}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-2xl text-yellow-400">★</span>
                            <span className="font-bold text-lg">{rater.rating}</span>
                          </div>
                        </div>
                        {rater.comment && (
                          <p className="text-gray-700 mt-2 bg-gray-50 p-3 rounded-lg">
                            {rater.comment}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(rater.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <PasswordUpdateModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
};

export default OwnerDashboard;
