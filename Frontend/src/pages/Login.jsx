import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!role) {
      setErrorMessage('⚠️ Please select a role before logging in.');
      setIsLoading(false);
      return;
    }

    const formattedRole = role.toLowerCase();
    console.log('🔹 Sending Login Request:', { email, password, role: formattedRole });

    try {
      const response = await axios.post(
          `${import.meta.env.VITE_AUTH_URL}/api/auth/login`,
        { email, password, role: formattedRole },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
          timeout: 5000,
        }
      );

      console.log('✅ API Response:', response?.data);

      if (response?.data?.message?.toLowerCase() === 'login successful!') {
        localStorage.setItem('token', response?.data?.token);
        localStorage.setItem('email', email.toLowerCase());

        const roleFromResponse = response?.data?.role?.toLowerCase() || formattedRole;
        localStorage.setItem('role', roleFromResponse);

        if (roleFromResponse === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setErrorMessage(response?.data?.message || '🚫 Invalid credentials or role.');
      }
    } catch (error) {
      console.error('❌ Error:', error);

      if (error.code === 'ECONNABORTED') {
        setErrorMessage('⚠️ Request timed out. Try again.');
      } else if (!error.response) {
        setErrorMessage('❌ Cannot connect to server. Ensure the backend is running.');
      } else {
        setErrorMessage(error?.response?.data?.message || '⚠️ Login failed. Check credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <div className="bg-gray-950 p-10 rounded-2xl shadow-2xl w-full max-w-md transition duration-300 ease-in-out transform hover:scale-[1.01]">
        <h2 className="text-4xl font-extrabold text-center mb-8 text-green-400 drop-shadow-md">Login to MelodyStream</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              title="Enter your email"
              placeholder="Enter your email"
              value={email}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              id="password"
              title="Enter your password"
              placeholder="Enter your password"
              value={password}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">Select Role</label>
            <select
              id="role"
              title="Select your role"
              value={role}
              required
              className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="" disabled>Select your role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className={`w-full bg-green-500 hover:bg-green-600 active:bg-green-700 py-3 rounded-lg font-semibold text-white transition duration-200 ease-in-out ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {errorMessage && (
          <div className="mt-5 p-3 bg-red-600/80 text-white text-center rounded-lg shadow-inner animate-pulse">
            {errorMessage}
          </div>
        )}

        <p className="text-center mt-6 text-gray-400 text-sm">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-green-400 cursor-pointer hover:underline hover:text-green-300"
          >
            Signup here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
