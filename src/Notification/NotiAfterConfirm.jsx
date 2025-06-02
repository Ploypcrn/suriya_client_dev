import { notification } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';


function NotiAfterConfirm(type, title, subTitle) {
  const iconMap = {
    success: <CheckCircleOutlined className="text-green-600" />,
    info: <InfoCircleOutlined className="text-blue-600" />,
    warning: <ExclamationCircleOutlined className="text-yellow-600" />,
    error: <CloseCircleOutlined className="text-red-600" />,
  };

  notification[type]({
    icon: iconMap[type],
    message: <span className="bold-title">{title}</span>,
    description: <span className="noti-text-description">{subTitle}</span>,
  });
}

export default NotiAfterConfirm;