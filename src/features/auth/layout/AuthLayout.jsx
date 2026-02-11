import { Outlet } from 'react-router-dom'
import { getBannerImageUrl } from '../../../shared/constants'

function AuthLayout() {
    const bannerUrl = getBannerImageUrl('auth-banner-background.png')
    return (
        <div className="relative overflow-hidden min-h-screen">

            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bannerUrl})` }}
            />

            {/* Main Content */}
            <main className="relative flex flex-1 min-h-screen justify-center sm:justify-end items-center p-4 sm:p-6 md:p-8 lg:p-10">
                <Outlet />
            </main>

        </div>
    )
}

export default AuthLayout
