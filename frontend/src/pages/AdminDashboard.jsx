import { useState, useEffect } from 'react';
import { getMetrics, getUsers, deleteUser } from '../services/admin';
import { getStores, createStore, updateStore, deleteStore } from '../services/stores';
import NavBar from '../components/NavBar';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import Toast from '../components/Toast';
import AddUserModal from '../components/AddUserModal';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const [storeForm, setStoreForm] = useState({ name: '', email: '', address: '' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMetrics();
    fetchUsers();
    fetchStores();
  }, []);

  const fetchMetrics = async () => {
    try {
      const data = await getMetrics();
      setMetrics(data);
    } catch (error) {
      setToast({ message: 'Failed to load metrics', type: 'error' });
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.users);
    } catch (error) {
      setToast({ message: 'Failed to load users', type: 'error' });
    }
  };

  const fetchStores = async () => {
    try {
      const data = await getStores({ limit: 100 });
      setStores(data.stores);
    } catch (error) {
      setToast({ message: 'Failed to load stores', type: 'error' });
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await deleteUser(id);
      setToast({ message: 'User deleted successfully', type: 'success' });
      fetchUsers();
      fetchMetrics();
    } catch (error) {
      setToast({ message: error.response?.data?.error || 'Failed to delete user', type: 'error' });
    }
  };

  const handleDeleteStore = async (id) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    
    try {
      await deleteStore(id);
      setToast({ message: 'Store deleted successfully', type: 'success' });
      fetchStores();
      fetchMetrics();
    } catch (error) {
      setToast({ message: 'Failed to delete store', type: 'error' });
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingStore) {
        await updateStore(editingStore.id, storeForm);
        setToast({ message: 'Store updated successfully', type: 'success' });
      } else {
        await createStore(storeForm);
        setToast({ message: 'Store created successfully', type: 'success' });
      }
      setShowStoreModal(false);
      setEditingStore(null);
      setStoreForm({ name: '', email: '', address: '' });
      fetchStores();
      fetchMetrics();
    } catch (error) {
      setToast({ message: 'Failed to save store', type: 'error' });
    }
  };

  const openStoreModal = (store = null) => {
    if (store) {
      setEditingStore(store);
      setStoreForm({ name: store.name, email: store.email || '', address: store.address || '' });
    } else {
      setEditingStore(null);
      setStoreForm({ name: '', email: '', address: '' });
    }
    setShowStoreModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-primary-600">{metrics.totalUsers}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Stores</h3>
            <p className="text-4xl font-bold text-accent-600">{metrics.totalStores}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Ratings</h3>
            <p className="text-4xl font-bold text-green-600">{metrics.totalRatings}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'overview'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'users'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('stores')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'stores'
                  ? 'border-b-2 border-primary-600 text-primary-600'
                  : 'text-gray-600'
              }`}
            >
              Stores
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">System Overview</h2>
                <p className="text-gray-600">
                  Welcome to the admin dashboard. Use the tabs above to manage users and stores.
                </p>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">User Management</h2>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    + Add User
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3 text-sm">{user.name}</td>
                          <td className="px-4 py-3 text-sm">{user.email}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'stores' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Store Management</h2>
                  <button
                    onClick={() => openStoreModal()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    Add Store
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Address</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Rating</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stores.map((store) => (
                        <tr key={store.id}>
                          <td className="px-4 py-3 text-sm">{store.name}</td>
                          <td className="px-4 py-3 text-sm">{store.address}</td>
                          <td className="px-4 py-3 text-sm">{store.avg_rating} ★</td>
                          <td className="px-4 py-3 text-sm space-x-2">
                            <button
                              onClick={() => openStoreModal(store)}
                              className="text-primary-600 hover:text-primary-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStore(store.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        title={editingStore ? 'Edit Store' : 'Add Store'}
      >
        <form onSubmit={handleStoreSubmit}>
          <FormInput
            label="Store Name"
            type="text"
            value={storeForm.name}
            onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
            required
          />
          <FormInput
            label="Email"
            type="email"
            value={storeForm.email}
            onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
          />
          <FormInput
            label="Address"
            type="text"
            value={storeForm.address}
            onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {editingStore ? 'Update Store' : 'Create Store'}
          </button>
        </form>
      </Modal>

      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserAdded={() => {
          fetchUsers();
          fetchMetrics();
        }}
      />
    </div>
  );
};

export default AdminDashboard;
