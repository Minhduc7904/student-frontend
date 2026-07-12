import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ROUTES } from '../../../core/constants';
import { setCredentials } from '../store/authSlice';

function GoogleCallbackPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState('');

    const callbackState = useMemo(() => {
        const error = searchParams.get('error');
        const accessToken = searchParams.get('token');
        const refreshToken = searchParams.get('refresh');

        return {
            error: error ? decodeURIComponent(error) : '',
            accessToken,
            refreshToken,
        };
    }, [searchParams]);

    useEffect(() => {
        if (callbackState.error) {
            setErrorMessage(callbackState.error);
            window.history.replaceState({}, document.title, `${window.location.origin}/student${ROUTES.GOOGLE_CALLBACK}`);
            return;
        }

        if (callbackState.accessToken && callbackState.refreshToken) {
            dispatch(setCredentials({
                accessToken: callbackState.accessToken,
                refreshToken: callbackState.refreshToken,
            }));
            navigate(ROUTES.LOADING_REDIRECT, { replace: true });
            return;
        }

        setErrorMessage('Callback Google không hợp lệ. Vui lòng thử đăng nhập lại.');
        window.history.replaceState({}, document.title, `${window.location.origin}/student${ROUTES.GOOGLE_CALLBACK}`);
    }, [callbackState, dispatch, navigate]);

    return (
        <div className="animate-slide-up w-full max-w-md rounded-3xl bg-white px-6 py-8 text-center shadow-[0_24px_70px_rgba(15,37,82,0.14)]">
            {errorMessage ? (
                <>
                    <p className="text-h3 text-blue-950">Không thể đăng nhập Google</p>
                    <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
                    <Link
                        to={ROUTES.LOGIN}
                        className="mt-6 inline-flex rounded-xl bg-blue-800 px-5 py-3 text-sm font-680 text-white transition hover:bg-blue-900"
                    >
                        Quay lại đăng nhập
                    </Link>
                </>
            ) : (
                <>
                    <p className="text-h3 text-blue-950">Đang hoàn tất đăng nhập</p>
                    <p className="mt-3 text-sm text-gray-subtle">Vui lòng chờ trong giây lát.</p>
                </>
            )}
        </div>
    );
}

export default GoogleCallbackPage;

