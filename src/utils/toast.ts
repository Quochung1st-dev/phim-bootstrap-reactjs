// Ví dụ về cách sử dụng toast trong ứng dụng

import { toast } from 'react-toastify';

// Thông báo thành công
export const showSuccess = (message: string) => {
  toast.success(message);
};

// Thông báo lỗi
export const showError = (message: string) => {
  toast.error(message);
};

// Thông báo thông tin
export const showInfo = (message: string) => {
  toast.info(message);
};

// Thông báo cảnh báo
export const showWarning = (message: string) => {
  toast.warning(message);
};

// Toast với nhiều tùy chọn
export const showCustomToast = (message: string, options: any) => {
  toast(message, options);
};

// Các ví dụ khác
/*
  // Toast với nút đóng
  toast("Thông báo với nút đóng!", {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  // Toast với promise
  const promiseToast = () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => resolve("Hoàn thành!"), 3000);
    });

    toast.promise(
      promise,
      {
        pending: "Đang xử lý...",
        success: "Xử lý thành công!",
        error: "Xử lý thất bại!"
      }
    );
  };
*/
