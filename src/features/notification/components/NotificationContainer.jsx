import { useSelector } from 'react-redux';
import { NotificationItem } from './NotificationItem';

export const NotificationContainer = () => {
  const notifications = useSelector((state) => state.notification.notifications);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-4 right-4 left-4 sm:left-auto z-[1000] space-y-2 pointer-events-none"
      style={{ maxHeight: 'calc(100vh - 2rem)' }}
    >
      <div className="flex flex-col-reverse max-h-full overflow-hidden">
        {notifications.map((notification, index) => (
          <NotificationItem key={notification.id} notification={notification} index={index} />
        ))}
      </div>
    </div>
  );
};
