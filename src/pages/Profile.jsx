import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { uploadImage } from '../services/api';
import { FiUser, FiMail, FiCamera, FiSave } from 'react-icons/fi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profile_photo: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        profile_photo: user.profile_photo || ''
      });
    }
  }, [user]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    try {
      setUploading(true);
      setMessage({ type: '', text: '' });
      
      const result = await uploadImage(file);
      setFormData({ ...formData, profile_photo: result.url });
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put(`/app/profile/${user.id}/`, formData);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {formData.profile_photo ? (
              <img
                src={formData.profile_photo}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center border-4 border-primary shadow-lg">
                <FiUser size={48} className="text-white" />
              </div>
            )}
            
            <label className="absolute bottom-0 right-0 bg-primary hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
              <FiCamera size={20} />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
          
          {uploading && (
            <p className="text-gray-600 text-sm mt-2 font-semibold">Uploading...</p>
          )}
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl font-semibold ${
              message.type === 'success'
                ? 'bg-green-100 border-2 border-green-500 text-green-700'
                : 'bg-red-100 border-2 border-red-500 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-orange-50 border-2 border-orange-200 rounded-xl text-gray-800 focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Admin Badge */}
          {user?.is_admin && (
            <div className="bg-orange-100 border-2 border-primary rounded-xl p-4">
              <p className="text-primary font-bold flex items-center space-x-2">
                <span>⚙️</span>
                <span>Admin Account</span>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full bg-primary hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
          >
            <FiSave />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
