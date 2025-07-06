import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
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
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      toast.success(res.data.msg);

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-pink-900 via-red-900 to-yellow-800 px-6">
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white/90 shadow-lg rounded-xl p-8 w-full max-w-md backdrop-blur-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          className="text-3xl font-extrabold mb-8 text-center text-pink-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Create an Account
        </motion.h2>

        <label htmlFor="username" className="block text-pink-900 font-semibold mb-2">
          Username
        </label>
        <motion.input
          id="username"
          name="username"
          type="text"
          onChange={handleChange}
          required
          placeholder="Your name"
          className="w-full px-5 py-3 mb-4 rounded-lg border border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
        />

        <label htmlFor="email" className="block text-pink-900 font-semibold mb-2">
          Email
        </label>
        <motion.input
          id="email"
          name="email"
          type="email"
          onChange={handleChange}
          required
          placeholder="you@example.com"
          className="w-full px-5 py-3 mb-4 rounded-lg border border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
        />

        <label htmlFor="password" className="block text-pink-900 font-semibold mb-2">
          Password
        </label>
        <motion.input
          id="password"
          name="password"
          type="password"
          onChange={handleChange}
          required
          placeholder="********"
          className="w-full px-5 py-3 mb-6 rounded-lg border border-pink-300 focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
        />

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-700 text-white font-bold py-3 rounded-lg hover:bg-pink-800 transition disabled:opacity-50"
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
        >
          {loading ? 'Registering...' : 'Register'}
        </motion.button>

        <p className="mt-6 text-center text-pink-900 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="underline hover:text-pink-600">
            Login here
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
