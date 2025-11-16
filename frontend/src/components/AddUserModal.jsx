import { useState } from 'react';
import Modal from './Modal';
import FormInput from './FormInput';
import Toast from './Toast';
import { createUser } from '../services/admin';

function AddUserModal({ isOpen, onClose, onUserAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be 20-60 characters';
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = 'Password must be 8-16 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }
    
    if (formData.address && formData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await createUser(formData);
      
      setToast({ type: 'success', message: 'User created successfully!' });
      setTimeout(() => {
        onClose();
        setFormData({ name: '', email: '', password: '', address: '', role: 'user' });
        if (onUserAdded) onUserAdded();
      }, 1500);
    } catch (error) {
      setToast({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to create user' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            helperText="20-60 characters"
          />
          
          <FormInput
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          
          <FormInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            helperText="8-16 chars, 1 uppercase, 1 special character"
          />
          
          <FormInput
            label="Address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            helperText="Max 400 characters (optional)"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </Modal>
      
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default AddUserModal;
