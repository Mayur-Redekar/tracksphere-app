import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate(`/dashboard/${user.username}`);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const user = res.data.user;

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success(`Welcome ${user.username}`);

      setTimeout(() => {
        if (user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate(`/dashboard/${user.username}`);
        }
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-700 px-6">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/90 shadow-lg rounded-xl p-8 w-full max-w-md backdrop-blur-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-extrabold mb-8 text-center text-indigo-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Welcome Back
        </motion.h2>

        <label htmlFor="email" className="block text-indigo-800 font-semibold mb-2">
          Email
        </label>
        <motion.input
          id="email"
          name="email"
          type="email"
          onChange={handleChange}
          required
          placeholder="you@example.com"
          className="w-full px-5 py-3 mb-6 rounded-lg border border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
        />

        <label htmlFor="password" className="block text-indigo-800 font-semibold mb-2">
          Password
        </label>
        <motion.input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          required
          placeholder="********"
          className="w-full px-5 py-3 mb-8 rounded-lg border border-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
        />

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-800 transition disabled:opacity-50"
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </motion.button>

        <div className="mt-6 flex justify-center items-center text-6px text-indigo-900 font-medium">
  <p>
    Don't have an account?{' '}
    <Link to="/register" className="underline hover:text-indigo-600">
      Register here
    </Link>
  </p>

</div>


      </motion.form>
    </div>
  );
}
