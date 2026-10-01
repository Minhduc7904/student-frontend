import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./style.css";
import { NotificationContainer } from "./features/notification/components/NotificationContainer";
import { resetNotificationState } from "./features/notification/store/notificationSlice";
import { selectCurrentUserId } from "./features/auth/store/authSlice";
import { useSocket } from "@/shared/hooks";
import ProfileUpdateReminderModal from "./shared/components/profile/ProfileUpdateReminderModal";
import NotificationReminderModal from "./shared/components/notification/NotificationReminderModal";

function App() {
  const dispatch = useDispatch();
  const currentUserId = useSelector(selectCurrentUserId);
  const previousUserId = useRef(currentUserId);

  useEffect(() => {
    if (previousUserId.current !== currentUserId) {
      dispatch(resetNotificationState());
    }
    previousUserId.current = currentUserId;
  }, [currentUserId, dispatch]);

  // Auto connect socket when user is authenticated
  useSocket({ autoConnect: true });

  return (
    <>
      <RouterProvider router={router} />
      <NotificationContainer />
      <ProfileUpdateReminderModal />
      <NotificationReminderModal />
    </>
  );
}

export default App;
