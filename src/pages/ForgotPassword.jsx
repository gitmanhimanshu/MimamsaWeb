import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FiMail, FiLock, FiArrowLeft } from 'react-icons/fi';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/app/forgot-password/send-otp/', { email });
      setMessage('OTP sent to your email. Please check your inbox.');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await api.post('/app/forgot-password/verify-otp/', { email, otp });
      setMessage('OTP verified successfully!');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await api.post('/app/forgot-password/reset/', {
        email,
        otp,
        new_password: newPassword
      });
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-primary to-secondary px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="/logo.png" 
            alt="Mimanasa Logo" 
            className="w-24 h-24 mx-auto mb-4 rounded-full object-cover border-4 border-white shadow-lg"
          />
          <h1 className="text-4xl font-bold text-white mb-2">Mimanasa</h1>
          <p className="text-white font-semibold">Reset your password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-orange-200">
          <Link
            to="/login"
            className="flex items-center space-x-2 text-gray-700 hover:text-primary mb-6 transition-colors font-semibold"
          >
            <FiArrowLeft />
            <span>Back to Login</span>
          </Link>

          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Reset Password'}
          </h2>

          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-4 font-semibold">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 border-2 border-green-500 text-green-700 px-4 py-3 rounded-xl mb-4 font-semibold">
              {message}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary transition-colors"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 text-center text-2xl tracking-widest focus:outline-none focus:border-primary transition-colors"
                  placeholder="000000"
                  maxLength="6"
                  required
                />
                <p className="text-gray-600 text-sm mt-2 font-semibold">
                  OTP sent to {email}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-gray-600 hover:text-primary text-sm transition-colors font-semibold"
              >
                Change email address
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
