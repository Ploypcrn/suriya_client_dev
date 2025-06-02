import React from 'react';
import { Button, notification, Space } from 'antd';

export const openNotificationSuccess = (message, description) => {
  notification.success({
    message: message,
    description: description,
  });
};

// สร้าง ฟังก์ชัน สำหรับ การ แจ้งเตือน ผลการทำงาน ที่ ไม่สำเร็จ
export const openNotificationError = (message, description) => {
  notification.error({
    message: message,
    description: description,
  });
};

// สร้าง ฟังก์ชัน สำหรับ การ แจ้งเตือน ผลการทำงาน ที่ ไม่สำเร็จ
export const openNotificationWarning = (message, description) => {
  notification.warning({
    message: message,
    description: description,
  });
};

// สร้าง ฟังก์ชัน สำหรับ การ แจ้งเตือน ข้อความ ที่ ต้องการ
export const openNotification = (type, message, description) => {
  notification[type]({
    message: message,
    description: description,
  });
};

export const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message: message,
    description: description,
  });
};

export const NotificationUtils = {
  openNotificationSuccess,
  openNotificationError,
  openNotificationWarning,
  openNotification,
  openNotificationWithIcon,
};
