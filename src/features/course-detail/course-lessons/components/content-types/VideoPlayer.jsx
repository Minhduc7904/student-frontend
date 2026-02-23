import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";

/**
 * Custom Video Player Component
 * Component phát video với controls tùy chỉnh
 * 
 * Bạn có thể custom:
 * - Giao diện controls (line 85-150)
 * - Thanh progress (line 95-105)
 * - Nút play/pause (line 110-120)
 * - Thanh volume (line 125-135)
 * - Nút fullscreen (line 140-150)
 * - Hover behavior (line 75-80)
 */
export const VideoPlayer = ({ videoUrl, className = "" }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const volumeContainerRef = useRef(null);
    const progressBarRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [volumeSliderMode, setVolumeSliderMode] = useState(null); // 'hover' or 'click'
    const [isDragging, setIsDragging] = useState(false);
    const [isSeeking, setIsSeeking] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [seekingTime, setSeekingTime] = useState(null);

    // Cập nhật thời gian video
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => setCurrentTime(video.currentTime);
        const handleLoadedMetadata = () => setDuration(video.duration);
        const handleEnded = () => setIsPlaying(false);
        
        // Seeking events
        const handleSeeking = () => {
            setIsSeeking(true);
            setIsBuffering(true);
        };
        const handleSeeked = () => {
            setIsSeeking(false);
            setSeekingTime(null);
        };
        
        // Buffering events
        const handleWaiting = () => setIsBuffering(true);
        const handleCanPlay = () => setIsBuffering(false);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('seeking', handleSeeking);
        video.addEventListener('seeked', handleSeeked);
        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('canplay', handleCanPlay);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('seeking', handleSeeking);
            video.removeEventListener('seeked', handleSeeked);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('canplay', handleCanPlay);
        };
    }, []);

    // Play/Pause toggle
    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Update progress bar visual only (without seeking video)
    const updateProgressVisual = (e) => {
        const progressBar = progressBarRef.current;
        if (!progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const clampedPos = Math.max(0, Math.min(1, pos));
        const newTime = clampedPos * duration;
        setSeekingTime(newTime);
        setCurrentTime(newTime);
    };

    // Handle progress bar drag
    const handleProgressMouseDown = (e) => {
        setIsDragging(true);
        updateProgressVisual(e);
    };

    const handleProgressMouseMove = (e) => {
        if (isDragging) {
            updateProgressVisual(e);
        }
    };

    const handleProgressMouseUp = () => {
        const video = videoRef.current;
        if (video && isDragging) {
            video.currentTime = currentTime;
        }
        setIsDragging(false);
    };

    // Handle progress bar click (not drag)
    const handleProgressClick = (e) => {
        const video = videoRef.current;
        const progressBar = progressBarRef.current;
        if (!video || !progressBar) return;

        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const clampedPos = Math.max(0, Math.min(1, pos));
        const newTime = clampedPos * duration;
        setSeekingTime(newTime);
        video.currentTime = newTime;
    };

    // Add global mouse event listeners for dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleProgressMouseMove);
            document.addEventListener('mouseup', handleProgressMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleProgressMouseMove);
                document.removeEventListener('mouseup', handleProgressMouseUp);
            };
        }
    }, [isDragging, duration]);

    // Change volume
    const handleVolumeChange = (e) => {
        const video = videoRef.current;
        if (!video) return;

        const newVolume = parseFloat(e.target.value);
        video.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    // Toggle mute
    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    // Toggle volume slider (click mode)
    const toggleVolumeSlider = () => {
        if (volumeSliderMode === 'click') {
            setShowVolumeSlider(false);
            setVolumeSliderMode(null);
        } else {
            setShowVolumeSlider(true);
            setVolumeSliderMode('click');
        }
    };

    // Handle volume hover
    const handleVolumeMouseEnter = () => {
        if (volumeSliderMode !== 'click') {
            setShowVolumeSlider(true);
            setVolumeSliderMode('hover');
        }
    };

    const handleVolumeMouseLeave = () => {
        if (volumeSliderMode === 'hover') {
            setShowVolumeSlider(false);
            setVolumeSliderMode(null);
        }
    };

    // Click outside to close volume slider
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (volumeSliderMode === 'click' && 
                volumeContainerRef.current && 
                !volumeContainerRef.current.contains(event.target)) {
                setShowVolumeSlider(false);
                setVolumeSliderMode(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [volumeSliderMode]);

    // Toggle fullscreen
    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (!document.fullscreenElement) {
            container.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // Format time (seconds to mm:ss)
    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Sử dụng seekingTime nếu đang seek để nút tròn di chuyển ngay lập tức
    const displayTime = seekingTime !== null ? seekingTime : currentTime;
    const progressPercentage = duration > 0 ? (displayTime / duration) * 100 : 0;

    return (
        <div
            ref={containerRef}
            className={`relative w-full aspect-video bg-black rounded-2xl overflow-hidden ${className}`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full object-contain"
                onClick={togglePlay}
            />

            {/* Custom Controls - CUSTOM AREA START */}
            <div
                className={`absolute flex flex-row justify-center items-center bottom-0 left-0 right-0 bg-[#2F5F59CC]/80 px-6 py-3 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-6 h-6 p-[2px] rounded-[6.86px] flex justify-center bg-white items-center mr-8 cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-150" onClick={togglePlay}>
                    {isPlaying ? (
                        <Pause size={18} className="text-blue-800" />
                    ) : (
                        <Play size={18} className="text-blue-800" />
                    )}
                </div>
                <div
                    ref={progressBarRef}
                    className="relative w-full h-2 bg-white/30 rounded-full cursor-pointer mr-14 group"
                    onClick={handleProgressClick}
                    onMouseDown={handleProgressMouseDown}
                >
                    {/* phần đã chạy */}
                    <div
                        className="h-full bg-white rounded-full transition-all duration-200 pointer-events-none"
                        style={{ width: `${progressPercentage}%` }}
                    />

                    {/* nút tròn */}
                    <div
                        className={`absolute top-1/2 -translate-y-1/2 
               w-4 h-4 bg-white rounded-full shadow 
               transition-all duration-200 pointer-events-none
               group-hover:scale-125 ${isDragging ? 'scale-125' : ''}`}
                        style={{ left: `calc(${progressPercentage}% - 8px)` }}
                    />
                </div>
                <div className="flex flex-row justify-center items-center gap-6">
                    <div 
                        ref={volumeContainerRef}
                        className="relative flex items-center justify-center"
                        onMouseEnter={handleVolumeMouseEnter}
                        onMouseLeave={handleVolumeMouseLeave}
                    >
                        <Volume2 
                            size={20} 
                            className={`text-white cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-150 ${isMuted ? 'opacity-50' : ''}`} 
                            onClick={toggleVolumeSlider}
                        />
                        {/* Volume Slider */}
                        {showVolumeSlider && (
                            <div className="absolute bottom-full mb-0 left-1/2 -translate-x-1/2 bg-[#2F5F59CC]/95 rounded-lg p-3 flex flex-col items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={isMuted ? 0 : volume}
                                    onChange={handleVolumeChange}
                                    className="h-20 w-1.5 appearance-none bg-white/30 rounded-full cursor-pointer
                                        [writing-mode:vertical-lr] [direction:rtl]
                                        [&::-webkit-slider-thumb]:appearance-none 
                                        [&::-webkit-slider-thumb]:w-3 
                                        [&::-webkit-slider-thumb]:h-3 
                                        [&::-webkit-slider-thumb]:bg-white 
                                        [&::-webkit-slider-thumb]:rounded-full
                                        [&::-webkit-slider-thumb]:cursor-pointer"
                                />
                                <button
                                    onClick={toggleMute}
                                    className="text-white hover:scale-110 active:scale-95 transition-all duration-150 p-1"
                                >
                                    {isMuted ? (
                                        <VolumeX size={16} />
                                    ) : (
                                        <Volume2 size={16} />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                    <Maximize size={20} className={`text-white cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-150 ${isFullscreen ? 'hidden' : ''}`} onClick={toggleFullscreen} />
                    <Minimize size={20} className={`text-white cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-150 ${isFullscreen ? '' : 'hidden'}`} onClick={toggleFullscreen} />
                </div>

            </div>
            {/* CUSTOM AREA END */}

            {/* Loading Spinner (when buffering) */}
            {isBuffering && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            )}

            {/* Play Button Overlay (when paused) */}
            {!isPlaying && !isBuffering && (
                <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer pointer-events-none"
                >
                    <div 
                        className="w-20 h-20 bg-[#2F5F59CC]/50 rounded-full flex items-center justify-center hover:bg-[#2F5F59CC]/70 hover:scale-110 active:scale-95 transition-all duration-150 pointer-events-auto"
                        onClick={togglePlay}
                    >
                        <Play size={32} className="text-white" />
                    </div>
                </div>
            )}
        </div>
    );
};
