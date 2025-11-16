import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/auth';
import FormInput from '../components/FormInput';
import Toast from '../components/Toast';

const SignupPage = () => {
  const navigate = useNavigate();
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
      newErrors.name = 'Name must be between 20 and 60 characters';
    }
    
    if (formData.address && formData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }
    
    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be 8-16 characters with at least one uppercase and one special character';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await signup(formData);
      setToast({ message: 'Account created successfully!', type: 'success' });
      setTimeout(() => navigate('/stores'), 1000);
    } catch (error) {
      const errorDetails = error.response?.data?.details;
      if (errorDetails) {
        const newErrors = {};
        errorDetails.forEach(err => {
          newErrors[err.field] = err.message;
        });
        setErrors(newErrors);
      } else {
        const errorMsg = error.response?.data?.error || 'Signup failed';
        setErrors({ general: errorMsg });
        setToast({ message: errorMsg, type: 'error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-primary-700 mb-6">
          Store Ratings
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <FormInput
            label="Full Name (20-60 characters)"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
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
            label="Password (8-16 chars, 1 uppercase, 1 special)"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <FormInput
            label="Address (optional, max 400 chars)"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="user">Normal User</option>
              <option value="owner">Store Owner</option>
            </select>
          </div>

          {errors.general && (
            <p className="text-red-500 text-sm mb-4">{errors.general}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
