import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { removeNotification } from '../../../features/notification/store/notificationSlice';

export const NotificationItem = ({ notification, index }) => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [appearDelay, setAppearDelay] = useState(50 + index * 100);
  const duration = notification.duration || 4000;

  // Set appear delay only once on mount
  useEffect(() => {
    setAppearDelay(50 + index * 100);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), appearDelay);

    if (notification.autoHide) {
      const removeTimer = setTimeout(() => {
        setIsRemoving(true);
        setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, 300);
      }, duration + appearDelay);

      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [notification.autoHide, duration, appearDelay, dispatch, notification.id]);

  const handleRemove = () => {
    setIsRemoving(true);
    // Remove immediately after animation completes (300ms)
    setTimeout(() => {
      dispatch(removeNotification(notification.id));
    }, 300);
  };

  const getIcon = () => {
    const iconSize = 20; // Larger for better visibility
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={iconSize} className="text-green-500" />;
      case 'error':
        return <XCircle size={iconSize} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={iconSize} className="text-yellow-500" />;
      case 'info':
      default:
        return <Info size={iconSize} className="text-blue-800" />;
    }
  };

  const getColorClasses = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-100 border-green-500';
      case 'error':
        return 'bg-red-200 border-red-500';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500';
      case 'info':
      default:
        return 'bg-blue-100 border-blue-800';
    }
  };

  const getTextColorClass = () => {
    switch (notification.type) {
      case 'success':
        return 'text-gray-800';
      case 'error':
        return 'text-gray-800';
      case 'warning':
        return 'text-gray-800';
      case 'info':
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-in-out mb-2 ${
        isVisible && !isRemoving 
          ? 'translate-x-0 translate-y-0 opacity-100' 
          : 'sm:translate-x-full translate-y-[-100%] sm:translate-y-0 opacity-0'
      }`}
      style={{
        // Only apply delay when appearing, not when removing
        transitionDelay: isRemoving ? '0ms' : (!isVisible ? `${appearDelay}ms` : '0ms'),
      }}
    >
      <div
        className={`w-full sm:w-80 shadow-lg rounded-lg pointer-events-auto ${getColorClasses()}`}
      >
        <div className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              {notification.title && (
                <p className={`text-text-5 sm:text-sm font-semibold ${getTextColorClass()}`}>
                  {notification.title}
                </p>
              )}
              <p className={`text-text-5 sm:text-sm ${notification.title ? 'mt-1' : ''} ${getTextColorClass()}`}>
                {notification.message.length > 100
                  ? notification.message.slice(0, 100) + '...'
                  : notification.message}
              </p>
            </div>

            {/* Close button with progress circle */}
            <div className="flex-shrink-0 relative">
              <button
                className={`relative cursor-pointer inline-flex ${getColorClasses()} items-center justify-center h-7 w-7 sm:h-6 sm:w-6 text-gray-700 hover:text-gray-900 transition-colors rounded`}
                onClick={handleRemove}
                aria-label="Đóng thông báo"
              >
                <X size={16} className="relative z-10" />

                {/* Progress circle */}
                {notification.autoHide && (
                  <svg className="absolute inset-0 h-7 w-7 sm:h-6 sm:w-6 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      className="text-gray-300"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      r="16"
                      cx="18"
                      cy="18"
                    />
                    <circle
                      className="text-gray-700"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="transparent"
                      r="16"
                      cx="18"
                      cy="18"
                      strokeDasharray={100}
                      strokeDashoffset={0}
                      style={{
                        animation: `countdown ${duration}ms linear forwards`,
                      }}
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes countdown {
          from {
            stroke-dasharray: 100;
            stroke-dashoffset: 0;
          }
          to {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
          }
        }
      `}</style>
    </div>
  );
};
