import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register({ name, email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-xl rounded-2xl border border-gray-100">
        <div className="text-center">
          <Link to="/" className="text-3xl font-extrabold text-orange-400 mb-2 block">SwiftCart</Link>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3 text-red-700 text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name-reg" className="block text-sm font-bold text-gray-700 mb-1">Your name</label>
              <div className="relative">
                <input
                  id="name-reg"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="First and last name"
                />
                <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
            <div>
              <label htmlFor="email-reg" className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <div className="relative">
                <input
                  id="email-reg"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
            </div>
            <div>
              <label htmlFor="password-reg" className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password-reg"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                  placeholder="At least 6 characters"
                />
                <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
              </div>
              <p className="mt-1 text-[10px] text-gray-500">Passwords must be at least 6 characters.</p>
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-[#131921] bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-sm transition-all"
          >
            Create your SwiftCart account
          </button>
        </form>

        <div className="text-center space-y-4 mt-6">
          <p className="text-xs text-gray-500">By creating an account, you agree to SwiftCart's Conditions of Use and Privacy Notice.</p>
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
          <p className="text-sm font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline inline-flex items-center gap-1">
              Sign-In <ArrowRight size={14} />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
