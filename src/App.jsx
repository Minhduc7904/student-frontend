import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './style.css';
import { NotificationContainer } from './features/notification/components/NotificationContainer';
import { useSocket } from '@/shared/hooks';

function App() {
    // Auto connect socket when user is authenticated
    useSocket({ autoConnect: true });

    return (
        <>
            <RouterProvider router={router} />
            <NotificationContainer />
        </>
    );
}

export default App;
