import { RouterProvider } from 'react-router-dom';
import router from './routes';
import './style.css';
import { NotificationContainer } from './features/notification/components/NotificationContainer';

function App() {
    return (
        <>
            <RouterProvider router={router} />
            <NotificationContainer />
        </>
    );
}

export default App;
