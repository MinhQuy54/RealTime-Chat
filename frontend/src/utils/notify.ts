import { notification } from "antd";

// Cấu hình mặc định toàn dự án
notification.config({
  placement: "topRight",
  duration: 3,
});

export const notify = {
  success: (message: string, description?: string) => {
    notification.success({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  },
  error: (message: string, description?: string) => {
    notification.error({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  },
  warning: (message: string, description?: string) => {
    notification.warning({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  },
  info: (message: string, description?: string) => {
    notification.info({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  },
};

export { notification };

