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
        <div className=" flex w-full justify-center items-center">
            <div className="relative shrink-0 flex flex-col items-center">
                <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={uploading}
                    className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-all hover:border-[rgba(45,181,93,0.45)] hover:shadow-[0_6px_18px_rgba(15,23,42,0.12)] disabled:cursor-not-allowed"
                    aria-label="Thay đổi ảnh đại diện"
                >
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={fullName} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full bg-blue-100 flex items-center justify-center">
                            <User className="h-8 w-8 text-blue-800" />
                        </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Camera size={16} className="text-white" />
                    </div>

                    {uploading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55">
                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                            <span className="mt-1 text-xs font-semibold text-white">{uploadProgress}%</span>
                        </div>
                    ) : null}
                </button>

                <p className="mt-2 text-xs text-gray-500">Nhấn vào ảnh để thay đổi</p>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>
        </div>
    );
});

ProfileAvatar.displayName = "ProfileAvatar";

export default ProfileAvatar;
