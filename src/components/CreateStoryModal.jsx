import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import api from '../services/api';
import { FiX, FiUpload, FiType, FiImage, FiCheck } from 'react-icons/fi';
import { uploadImage } from '../services/api';

const FONT_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: 'italic', label: 'Italic' },
  { value: 'serif', label: 'Classic' },
];

const BG_COLORS = [
  '#FF7700', '#E91E63', '#9C27B0', '#673AB7',
  '#3F51B5', '#2196F3', '#009688', '#4CAF50',
  '#8BC34A', '#CDDC39', '#FFEB3B', '#FF9800',
  '#795548', '#607D8B', '#000000', '#FFFFFF'
];

const CreateStoryModal = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const fileInputRef = useRef(null);

  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('#FF7700');
  const [fontStyle, setFontStyle] = useState('normal');
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select an image file', 'error');
      return;
    }

    setUploading(true);
    try {
      // Show local preview immediately
      const reader = new FileReader();
      reader.onload = (event) => setPreviewImage(event.target.result);
      reader.readAsDataURL(file);

      const result = await uploadImage(file);
      setImageUrl(result.url);
      addToast('Image uploaded!', 'success');
    } catch (error) {
      addToast('Failed to upload image', 'error');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!imageUrl && !caption.trim()) {
      addToast('Please add an image or some text', 'info');
      return;
    }

    try {
      await api.post('/stories/create/', {
        user_id: user.id,
        image_url: imageUrl || '',
        caption: caption,
        background_color: backgroundColor,
        font_style: fontStyle,
      });

      addToast('Story published!', 'success');
      onSuccess?.();
      onClose();
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Failed to publish story';
      addToast(errMsg, 'error');
    }
  };

  const getFontClass = () => {
    switch (fontStyle) {
      case 'bold': return 'font-bold';
      case 'italic': return 'italic';
      case 'serif': return 'font-serif';
      default: return 'font-normal';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create Story</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Preview */}
          <div className="relative w-full aspect-[9/16] max-h-[280px] sm:max-h-[400px] rounded-xl overflow-hidden border border-gray-200">
            {previewImage || imageUrl ? (
              <img
                src={previewImage || imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ backgroundColor }}
              >
                <span className="text-white/50 text-6xl">📖</span>
              </div>
            )}

            {/* Caption overlay on preview */}
            {caption && (
              <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                <p
                  className={`text-white text-center text-xl font-bold drop-shadow-lg leading-relaxed break-words ${getFontClass()}`}
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                >
                  {caption}
                </p>
              </div>
            )}

            {/* Change image button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 right-3 px-3 py-2.5 bg-black/50 hover:bg-black/70 backdrop-blur text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors active:scale-95"
            >
              <FiImage size={16} />
              {imageUrl ? 'Change' : 'Add Image'}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiType size={16} />
              Text / Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write something..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Background Color (when no image) */}
          {!imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <div className="flex flex-wrap gap-2">
                {BG_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      backgroundColor === color ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Font Style */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
            <div className="flex gap-2">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.value}
                  onClick={() => setFontStyle(font.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    fontStyle === font.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className={
                    font.value === 'bold' ? 'font-bold' :
                    font.value === 'italic' ? 'italic' :
                    font.value === 'serif' ? 'font-serif' : ''
                  }>
                    {font.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 pb-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors active:scale-95 text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploading || (!imageUrl && !caption.trim())}
              className="flex-1 px-4 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95 text-sm sm:text-base"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <FiCheck size={18} />
                  Publish
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStoryModal;
