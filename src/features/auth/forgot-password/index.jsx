/**
 * Forgot Password Page
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Forgot password:', email);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <div className="text-6xl mb-4">✉️</div>
                    <h2 className="text-2xl font-bold">Kiểm tra email của bạn</h2>
                    <p className="mt-4 text-gray-600">
                        Chúng tôi đã gửi link khôi phục mật khẩu đến email <strong>{email}</strong>
                    </p>
                    <Link 
                        to="/login" 
                        className="mt-6 inline-block text-blue-600 hover:text-blue-700"
                    >
                        Quay lại đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-8 bg-white rounded-lg shadow-lg">
            <div>
                <h2 className="text-3xl font-bold text-center">Quên mật khẩu?</h2>
                <p className="mt-2 text-center text-gray-600">
                    Nhập email để nhận link khôi phục
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Gửi link khôi phục
                </button>
            </form>

            <div className="text-center">
                <Link to="/login" className="text-blue-600 hover:text-blue-700">
                    Quay lại đăng nhập
                </Link>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
