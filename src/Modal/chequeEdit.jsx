import {
    Button,
    Form,
    Modal,
    Select,
    Space,
} from "antd";
import {
    PlusOutlined, CloseOutlined
} from "@ant-design/icons";
import { PrinterOutlined } from "@ant-design/icons";
import PropTypes from 'prop-types';
import { useEffect } from "react";

const ChequeEdit = (props) => {
    const { title, open, dataSelect, chequeStatus, onCancel, formModal, onConfirmModal } = props;

    useEffect(() => {
        formModal.setFieldsValue({
            data: dataSelect
        })
    }, [open, formModal, dataSelect]);

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <PrinterOutlined className="mr-2" />
                    <h6>{title}</h6>
                </div>
            }
            footer={
                <Space>
                    <Button
                        className="btn-reset"
                        type="default"
                        icon={<CloseOutlined />}
                        onClick={onCancel}
                    >
                        ยกเลิก
                    </Button>

                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            formModal.submit();
                        }}
                    >
                        บันทึก
                    </Button>
                </Space>
            }
            open={open}
            onCancel={onCancel}
        >
            <Form
                name="basic"
                wrapperCol={{ span: 24 }}
                form={formModal}
                onFinish={(values) => {
                    onConfirmModal(values);
                }}
            >
                <hr className="text-lg mb-4" />
                <Form.Item
                    label="สถานะ"
                    name="data"
                >
                    <Select style={{ width: "100%" }}
                        placeholder="เลือก"
                    >
                        {
                            chequeStatus.map((item) => {
                                return (
                                    <Select.Option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        {item.name}
                                    </Select.Option>
                                );
                            })
                        }
                    </Select>
                </Form.Item>
                <hr className="text-lg mb-4" />
            </Form>
        </Modal>

    );
};

ChequeEdit.propTypes = {
    title: PropTypes.string,
    open: PropTypes.bool,
    data: PropTypes.number,
    onCancel: PropTypes.func,
    chequeStatus: PropTypes.array,
};

export default ChequeEdit;