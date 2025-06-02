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
import chequeService from '../../services/chequeService';
import banksLogo from 'banks-logo'

const PickerWithType = ({ type, onChange }) => {
    if (type === "time")
        return <TimePicker onChange={onChange} style={{ width: "100%" }} />;
    if (type === "date")
        return <CustomDatePicker picker={type} onChange={onChange} style={{ width: '100%' }} />;
    return (
        <CustomDatePicker picker={type} onChange={onChange} style={{ width: '100%' }} />
    );
};

PickerWithType.propTypes = {
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};

const ChequeAdd = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [bank, setBank] = useState([])
    const [chequePaymentType, setChequePaymentType] = useState([])

    // const banksLogo = require('banks-logo');

    const getMasterBank = async () => {
        const response = await masterService.getMasterBank();
        if (response?.data.length > 0) {
            setBank(response?.data);
        } else {
            console.log("error");
        }
    };

    const getMasterChequePaymentType = async () => {
        const response = await masterService.getMasterChequePaymentType();
        if (response?.data.length > 0) {
            setChequePaymentType(response?.data);
        } else {
            console.log("error");
        }
    };

    const onConfirm = async (values) => {
        ShowConfirm("ยืนยันการบันทึกข้อมูล", "คุณต้องการบันทึกข้อมูลหรือไม่ ?").then(async (res) => {
            if (res) {
                onSubmit(values);
                localStorage.setItem('dataCheque', JSON.stringify(form.getFieldsValue()))
                window.open(`/cheque/print-pdf`);
            }
        });
    };

    const onSubmit = async (values) => {

        const requestData = {
            bank: parseInt(values.bank),
            branch: values.branch ? values.branch : '',
            checkNo: values.checkNo,
            payeeOnly: values.payeeOnly,
            issueDate: values.issueDate ? values.issueDate : null,
            clearanceDate: values.clearanceDate ? values.clearanceDate : null,
            chequePaymentType: parseInt(values.chequePaymentType),
            paymentRemark: values.paymentRemark ? values.paymentRemark : '',
            amount: values.amount,
        };
        const response = await chequeService.createCheque(requestData);
        if (response?.data) {
            // สร้าง notification บันทึกข้อมูลสำเร็จ
            NotiAfterConfirm("success", "บันทึกข้อมูลสำเร็จ", "บันทึกข้อมูลสำเร็จ");
            navigate("/cheque");
        } else {
            // สร้าง notification บันทึกข้อมูลไม่สำเร็จ
            NotiAfterConfirm("error", "บันทึกข้อมูลไม่สำเร็จ", "บันทึกข้อมูลไม่สำเร็จ");
        }
    };

    useEffect(() => {
        getMasterBank();
        getMasterChequePaymentType();
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
                                        navigate("/cheque");
                                    }}
                                />
                            </div>
                            <div>
                                <h3>สร้างเช็ค</h3>
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
                                        label="ธนาคาร"
                                        name="bank"
                                        // name={["bank", index, "bank"]}
                                        rules={[{ required: true, message: "กรุณาเลือกธนาคาร" }]}
                                    >
                                        <Select
                                            style={{ width: "100%" }}
                                            placeholder="เลือกธนาคาร"
                                        >
                                            {bank.map((item) => {
                                                return (
                                                    <Select.Option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        <span className="align-text-icon">
                                                            <img src={banksLogo.Get(item.short_code).image} alt="bank" style={{ height: 24, width: 24, backgroundColor: banksLogo.Get(item.short_code).color, borderRadius: 3 }} /></span>
                                                        <span className="align-text-icon">&nbsp;&nbsp;{item.bank_name}</span>
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="สาขา"
                                        name="branch"
                                        rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
                                    >
                                        <Input placeholder="กรอกสาขา" style={{ width: "100%" }} />
                                    </Form.Item>

                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="เลขที่เช็ค"
                                        name="checkNo"
                                        rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
                                    >
                                        <Input
                                            placeholder="กรอกเลขที่เช็ค"
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="A/C PAYEE ONLY"
                                        name="payeeOnly"
                                    >
                                        <Checkbox
                                            style={{ width: "100%" }}
                                            onChange={(e) => {
                                                form.setFieldsValue({
                                                    payeeOnly: e.target.checked,
                                                });
                                            }}
                                        ></Checkbox>
                                    </Form.Item>

                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="วันที่ออกเช็ค"
                                        name="issueDate"
                                        rules={[{ required: true, message: "กรุณาเลือกวันที่ออกเช็ค" }]}
                                    >
                                        {/* <PickerWithType type="dateTime" /> */}
                                        <PickerWithType
                                            type="date"
                                            onChange={(value) => {
                                                form.setFieldsValue({
                                                    issueDate: value
                                                });
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="วันที่ตัดเช็ค"
                                        name="clearanceDate"
                                        rules={[{ required: true, message: "กรุณาเลือกวันที่ออกเช็ค" }]}
                                    >
                                        {/* <PickerWithType type="dateTime" /> */}
                                        <PickerWithType
                                            type="date"
                                            onChange={(value) => {
                                                form.setFieldsValue({
                                                    clearanceDate: value
                                                });
                                            }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="ประเภทรายจ่าย"
                                        name="chequePaymentType"
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
                                            {chequePaymentType.map((item) => {
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
                                        name="paymentRemark"
                                    >
                                        <Input.TextArea
                                            placeholder="กรอกรายละเอียด"
                                            showCount maxLength={100}
                                            style={{ width: "100%" }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        style={{ width: "100%" }}
                                        label="จำนวนเงิน"
                                        name="amount"
                                        rules={[{ required: true, message: "กรุณากรอกจำนวนเงิน" }]}
                                    >
                                        <InputNumber placeholder="กรุณากรอกจำนวนเงิน" style={{ width: "100%" }} min={1} />
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

export default ChequeAdd;
