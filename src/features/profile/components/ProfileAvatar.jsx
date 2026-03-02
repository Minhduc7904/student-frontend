import { memo, useRef, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { User, Camera, Loader2 } from "lucide-react";
import { uploadAvatarAsync } from "../store/profileSlice";

/**
 * ProfileAvatar Component
 * Hiển thị avatar với khả năng upload ảnh mới
 */
const ProfileAvatar = memo(({ avatarUrl, fullName }) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleAvatarClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleFileChange = useCallback(
        async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Validate file
            const validTypes = ["image/jpeg", "image/png", "image/webp"];
            if (!validTypes.includes(file.type)) {
                alert("Chỉ chấp nhận file ảnh (JPG, PNG, WEBP)");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("Kích thước ảnh tối đa 5MB");
                return;
            }

            try {
                setUploading(true);
                setUploadProgress(0);
                await dispatch(
                    uploadAvatarAsync({
                        file,
                        onUploadProgress: (percent) => setUploadProgress(percent),
                    })
                ).unwrap();
            } catch {
                // Error handled by slice
            } finally {
                setUploading(false);
                setUploadProgress(0);
            }

            // Reset input
            e.target.value = "";
        },
        [dispatch]
    );

    return (
        <div className="relative group shrink-0">
            {/* Avatar */}
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt={fullName}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                        <User className="w-16 h-16 text-blue-800" />
                    </div>
                )}

                {/* Upload overlay */}
                {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                        <span className="text-xs text-white mt-1">{uploadProgress}%</span>
                    </div>
                )}
            </div>

            {/* Camera button */}
            <button
                onClick={handleAvatarClick}
                disabled={uploading}
                className="absolute bottom-1 right-1 w-9 h-9 bg-blue-800 hover:bg-blue-900 text-white rounded-full flex items-center justify-center shadow-md transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                aria-label="Thay đổi ảnh đại diện"
            >
                <Camera size={16} />
            </button>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
});

ProfileAvatar.displayName = "ProfileAvatar";

export default ProfileAvatar;
