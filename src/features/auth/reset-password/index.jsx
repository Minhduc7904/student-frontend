/**
 * Reset Password Page
 */

import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }

        console.log('Reset password:', { token, password: formData.password });
        setIsSuccess(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (isSuccess) {
        return (
            <div className="space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold">Đặt lại mật khẩu thành công</h2>
                    <p className="mt-4 text-gray-600">
                        Mật khẩu của bạn đã được cập nhật
                    </p>
                    <Link 
                        to="/login" 
                        className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-8 bg-white rounded-lg shadow-lg">
            <div>
                <h2 className="text-3xl font-bold text-center">Đặt lại mật khẩu</h2>
                <p className="mt-2 text-center text-gray-600">
                    Nhập mật khẩu mới của bạn
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Mật khẩu mới
                    </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        minLength={6}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Xác nhận mật khẩu
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                    Đặt lại mật khẩu
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

export default ResetPasswordPage;
