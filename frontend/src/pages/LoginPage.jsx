import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import FormInput from '../components/FormInput';
import Toast from '../components/Toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await login(formData);
      setToast({ message: 'Login successful!', type: 'success' });
      setTimeout(() => {
        const role = response.user.role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'owner') navigate('/owner');
        else navigate('/stores');
      }, 1000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed';
      setErrors({ general: errorMsg });
      setToast({ message: errorMsg, type: 'error' });
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
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
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
          />

          {errors.general && (
            <p className="text-red-500 text-sm mb-4">{errors.general}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
