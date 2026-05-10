import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import api, { uploadImage } from '../services/api';
import { FiUser, FiMail, FiCamera, FiSave } from 'react-icons/fi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    profile_photo: ''
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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
      addToast('Please select an image file', 'error');
      return;
    }

    try {
      setUploading(true);
      
      const result = await uploadImage(file);
      setFormData({ ...formData, profile_photo: result.url });
      addToast('Image uploaded successfully!', 'success');
    } catch (error) {
      addToast('Failed to upload image', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await api.put(`/app/profile/${user.id}/`, formData);
      updateUser(response.data);
      addToast('Profile updated successfully!', 'success');
    } catch (error) {
      addToast('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">My Profile</h1>

      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="relative">
            {formData.profile_photo ? (
              <img
                src={formData.profile_photo}
                alt="Profile"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-primary flex items-center justify-center border-4 border-primary shadow-lg">
                <FiUser size={40} className="sm:w-12 sm:h-12 text-white" />
              </div>
            )}
            
            <label className="absolute bottom-0 right-0 bg-primary hover:bg-orange-600 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
              <FiCamera size={16} className="sm:w-5 sm:h-5" />
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
            <p className="text-gray-600 text-xs sm:text-sm mt-2 font-semibold">Uploading...</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Username */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base bg-white/80 border border-gray-200 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base bg-white/80 border border-gray-200 rounded-lg sm:rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                required
              />
            </div>
          </div>

          {/* Admin Badge */}
          {user?.is_admin && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <p className="text-primary font-bold flex items-center space-x-2 text-sm sm:text-base">
                <span>⚙️</span>
                <span>Admin Account</span>
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full bg-primary text-white rounded-xl py-2.5 sm:py-3 text-sm sm:text-base font-bold hover:bg-orange-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <FiSave size={16} className="sm:w-5 sm:h-5" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
