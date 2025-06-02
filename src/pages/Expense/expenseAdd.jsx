import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShowConfirm from "../../Notification/ModalBeforeConfirm";
import NotiAfterConfirm from "../../Notification/NotiAfterConfirm";
import CustomDatePicker from "../../components/DatePicker/index";
import {
    ArrowLeftOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Form,
    Button,
    Row,
    Col,
    Input,
    TimePicker,
    Checkbox,
    Select,
    InputNumber,
} from "antd";
import PropTypes from "prop-types";
import masterService from "../../services/masterService";
import expenseService from '../../services/expenseService';

const ExpenseAdd = () => {

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [expenseType, setExpenseType] = useState([])

    const getMasterExpenseType = async () => {
        const response = await masterService.getMasterExpenseType();
        if (response?.data.length > 0) {
            setExpenseType(response?.data);
        } else {
            console.log("error");
        }
    };

    const onConfirm = async (values) => {
        ShowConfirm("ยืนยันการบันทึกข้อมูล", "คุณต้องการบันทึกข้อมูลหรือไม่ ?").then(async (res) => {
            if (res) {
                onSubmit(values);
            }
        });
    };

    const onSubmit = async (values) => {

        const requestData = {
            expenseType: parseInt(values.expenseType),
            expenseName: values.expenseName,
            amount: values.amount,
            expenseRemark: values.expenseRemark ? values.expenseRemark : '',
        };
        const response = await expenseService.createExpense(requestData);
        if (response?.data) {
            // สร้าง notification บันทึกข้อมูลสำเร็จ
            NotiAfterConfirm("success", "บันทึกข้อมูลสำเร็จ", "บันทึกข้อมูลสำเร็จ");
            navigate("/expenses");
        } else {
            // สร้าง notification บันทึกข้อมูลไม่สำเร็จ
            NotiAfterConfirm("error", "บันทึกข้อมูลไม่สำเร็จ", "บันทึกข้อมูลไม่สำเร็จ");
        }
    };

    useEffect(() => {
        getMasterExpenseType();
    }, []);

    return (
        <>
            <Form
                name="basic"
                form={form}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={(values) => {
                    onConfirm(values);
                }}
                onFinishFailed={(errorInfo) => {
                    console.log("Failed:", errorInfo);
                }}
            >
                <div className="title-page">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ marginRight: "10px" }}>
                                <Button
                                    className="btn-back"
                                    type="link"
                                    style={{ fontSize: "20px" }}
                                    icon={<ArrowLeftOutlined style={{ fontSize: "20px" }} />}
                                    onClick={() => {
                                        navigate("/expenses");
                                    }}
                                />
                            </div>
                            <div>
                                <h3>สร้างรายจ่าย</h3>
                            </div>
                        </div>
                        <div>
                            <Button
                                style={{ marginRight: "10px" }}
                                type="primary"
                                onClick={() => {
                                    form.submit();
                                }}
                                icon={<PlusOutlined />}
                            >
                                บันทึกเอกสาร
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="padding-content">
                    <div className="content-list"
                    >
                        <Row
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Col
                                xs={{ span: 24 }}
                                sm={{ span: 24 }}
                                md={{ span: 24 }}
                                lg={{ span: 8 }}
                                xl={{ span: 8 }}
                                xxl={{ span: 8 }}
                            >
                                <div
                                    style={{
                                        height: "100%",
                                        marginBottom: "20px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                    }}
                                >

                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="ประเภทรายจ่าย"
                                        name="expenseType"
                                        rules={[{ required: true, message: "กรุณาเลือกประเภทรายจ่าย" }]}
                                    >
                                        <Select
                                            style={{ width: "100%" }}
                                            placeholder="เลือกประเภทรายจ่าย"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {expenseType.map((item) => {
                                                return (
                                                    <Select.Option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="รายละเอียดการจ่าย"
                                        name="expenseName"
                                        rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
                                    >
                                        <Input placeholder="กรอกรายละเอียดการจ่าย" style={{ width: "100%" }} />
                                    </Form.Item>

                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="จำนวนเงิน"
                                        name="amount"
                                        rules={[{ required: true, message: "กรุณากรอกจำนวนเงิน" }]}
                                    >
                                        <InputNumber placeholder="กรุณากรอกจำนวนเงิน" style={{ width: "100%" }} min={1} />
                                    </Form.Item>

                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="หมายเหตุ"
                                        name="expenseRemark"
                                    >
                                        <Input.TextArea
                                            placeholder="กรอกรายละเอียด"
                                            showCount maxLength={100}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>

                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Form>
        </>
    );

};
export default ExpenseAdd;