/**
 * Error Messages
 */

export const ERROR_MESSAGES = {
    // Network Errors
    NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet của bạn.',
    TIMEOUT: 'Yêu cầu hết thời gian chờ. Vui lòng thử lại.',
    OFFLINE: 'Bạn đang offline. Vui lòng kiểm tra kết nối internet.',
    
    // Server Errors
    SERVER_ERROR: 'Lỗi máy chủ. Vui lòng thử lại sau.',
    SERVICE_UNAVAILABLE: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
    MAINTENANCE: 'Hệ thống đang bảo trì. Vui lòng quay lại sau.',
    
    // Authentication Errors
    UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    FORBIDDEN: 'Bạn không có quyền truy cập tài nguyên này.',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu không đúng.',
    EMAIL_NOT_VERIFIED: 'Email chưa được xác thực. Vui lòng kiểm tra email của bạn.',
    ACCOUNT_LOCKED: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.',
    
    // Validation Errors
    VALIDATION_ERROR: 'Dữ liệu không hợp lệ.',
    REQUIRED_FIELD: 'Trường này là bắt buộc.',
    INVALID_EMAIL: 'Email không hợp lệ.',
    INVALID_PHONE: 'Số điện thoại không hợp lệ.',
    PASSWORD_TOO_SHORT: 'Mật khẩu phải có ít nhất 6 ký tự.',
    PASSWORDS_NOT_MATCH: 'Mật khẩu không khớp.',
    INVALID_DATE: 'Ngày không hợp lệ.',
    INVALID_FORMAT: 'Định dạng không hợp lệ.',
    
    // Resource Errors
    NOT_FOUND: 'Không tìm thấy tài nguyên.',
    ALREADY_EXISTS: 'Tài nguyên đã tồn tại.',
    CONFLICT: 'Xung đột dữ liệu. Vui lòng thử lại.',
    
    // File Upload Errors
    FILE_TOO_LARGE: 'File quá lớn. Kích thước tối đa là {maxSize}MB.',
    INVALID_FILE_TYPE: 'Định dạng file không được hỗ trợ.',
    UPLOAD_FAILED: 'Tải file lên thất bại. Vui lòng thử lại.',
    
    // Course Errors
    COURSE_NOT_FOUND: 'Không tìm thấy khóa học.',
    ALREADY_ENROLLED: 'Bạn đã đăng ký khóa học này.',
    NOT_ENROLLED: 'Bạn chưa đăng ký khóa học này.',
    COURSE_FULL: 'Khóa học đã đầy.',
    
    // Exam Errors
    EXAM_NOT_FOUND: 'Không tìm thấy bài kiểm tra.',
    EXAM_NOT_AVAILABLE: 'Bài kiểm tra chưa có sẵn.',
    EXAM_EXPIRED: 'Bài kiểm tra đã hết hạn.',
    EXAM_ALREADY_TAKEN: 'Bạn đã làm bài kiểm tra này.',
    EXAM_IN_PROGRESS: 'Bạn đang có bài kiểm tra đang làm dở.',
    
    // Payment Errors (nếu có)
    PAYMENT_FAILED: 'Thanh toán thất bại. Vui lòng thử lại.',
    INSUFFICIENT_FUNDS: 'Số dư không đủ.',
    PAYMENT_CANCELLED: 'Thanh toán đã bị hủy.',
    
    // General Errors
    UNKNOWN: 'Đã xảy ra lỗi không xác định.',
    SOMETHING_WENT_WRONG: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
    TRY_AGAIN_LATER: 'Vui lòng thử lại sau.',
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
    // Authentication
    LOGIN_SUCCESS: 'Đăng nhập thành công!',
    LOGOUT_SUCCESS: 'Đăng xuất thành công!',
    REGISTER_SUCCESS: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
    EMAIL_VERIFIED: 'Email đã được xác thực thành công!',
    PASSWORD_RESET_EMAIL_SENT: 'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.',
    PASSWORD_CHANGED: 'Mật khẩu đã được thay đổi thành công!',
    
    // CRUD Operations
    SAVE_SUCCESS: 'Lưu thành công!',
    UPDATE_SUCCESS: 'Cập nhật thành công!',
    DELETE_SUCCESS: 'Xóa thành công!',
    CREATE_SUCCESS: 'Tạo mới thành công!',
    
    // Course Operations
    COURSE_ENROLLED: 'Đã đăng ký khóa học thành công!',
    COURSE_UNENROLLED: 'Đã hủy đăng ký khóa học!',
    LESSON_COMPLETED: 'Đã hoàn thành bài học!',
    PROGRESS_SAVED: 'Tiến độ đã được lưu!',
    
    // Exam Operations
    EXAM_SUBMITTED: 'Đã nộp bài kiểm tra thành công!',
    EXAM_STARTED: 'Đã bắt đầu bài kiểm tra!',
    
    // File Operations
    UPLOAD_SUCCESS: 'Tải lên thành công!',
    DOWNLOAD_SUCCESS: 'Tải xuống thành công!',
    
    // Notification Operations
    NOTIFICATION_MARKED_READ: 'Đã đánh dấu đã đọc!',
    ALL_NOTIFICATIONS_MARKED_READ: 'Đã đánh dấu tất cả thông báo là đã đọc!',
    
    // General
    OPERATION_SUCCESS: 'Thao tác thành công!',
    SETTINGS_SAVED: 'Cài đặt đã được lưu!',
};

/**
 * Info Messages
 */
export const INFO_MESSAGES = {
    LOADING: 'Đang tải...',
    PROCESSING: 'Đang xử lý...',
    SAVING: 'Đang lưu...',
    UPLOADING: 'Đang tải lên...',
    DOWNLOADING: 'Đang tải xuống...',
    PLEASE_WAIT: 'Vui lòng đợi...',
    NO_DATA: 'Không có dữ liệu.',
    NO_RESULTS: 'Không tìm thấy kết quả.',
    EMPTY_LIST: 'Danh sách trống.',
};

/**
 * Warning Messages
 */
export const WARNING_MESSAGES = {
    UNSAVED_CHANGES: 'Bạn có thay đổi chưa lưu. Bạn có chắc muốn rời đi?',
    CONFIRM_DELETE: 'Bạn có chắc chắn muốn xóa?',
    IRREVERSIBLE_ACTION: 'Hành động này không thể hoàn tác.',
    SESSION_EXPIRING: 'Phiên đăng nhập sắp hết hạn.',
    QUOTA_EXCEEDED: 'Bạn đã vượt quá hạn ngạch.',
};
