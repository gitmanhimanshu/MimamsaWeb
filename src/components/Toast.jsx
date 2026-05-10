import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { FiCheckCircle, FiXCircle, FiInfo, FiX } from 'react-icons/fi';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map(toast => (
          <ToastItem key={toast.id} {...toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ id, message, type, duration, onRemove }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enter = setTimeout(() => setVisible(true), 10);
    const exit = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, duration);
    return () => {
      clearTimeout(enter);
      clearTimeout(exit);
    };
  }, [id, duration, onRemove]);

  const icons = {
    success: <FiCheckCircle size={20} className="text-emerald-500" />,
    error: <FiXCircle size={20} className="text-red-500" />,
    info: <FiInfo size={20} className="text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-white border-emerald-200 shadow-emerald-100',
    error: 'bg-white border-red-200 shadow-red-100',
    info: 'bg-white border-blue-200 shadow-blue-100',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-sm min-w-[280px] max-w-[90vw] transition-all duration-300 ${bgColors[type]} ${
        visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'
      }`}
    >
      {icons[type]}
      <span className="text-sm font-medium text-gray-800 flex-1">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(id), 300);
        }}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

export default ToastProvider;
