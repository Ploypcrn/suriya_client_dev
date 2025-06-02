import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";

const ShowConfirm = (title, content) => {
  return new Promise((resolve) => {
    Modal.confirm({
      title: title,
      icon: <ExclamationCircleFilled />,
      content: content,
      okText: "ตกลง",
      cancelText: "ยกเลิก",
      onOk() {
        resolve(true); 
      },
      onCancel() {
        resolve(false); 
      },
      cancelButtonProps: {
        className: "btn-reset",
        style: { background: "#E0E0E0 !important"},
      },
    });
  });
};

export default ShowConfirm;
