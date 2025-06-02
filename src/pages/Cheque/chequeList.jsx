import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Badge, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import SearchBarComponent from "../../components/SearchBar/index";
import TableComponent from "../../components/Table/index";
import { useNavigate } from "react-router-dom";
import chequeService from '../../services/chequeService'
import ShowConfirm from "../../Notification/ModalBeforeConfirm";
import NotiAfterConfirm from "../../Notification/NotiAfterConfirm";
import { formatterPrice } from "../../utils/formatterPrice";
import banksLogo from 'banks-logo'
import masterService from "../../services/masterService";
import ChequeEdit from '../../Modal/chequeEdit';

const ChequeList = () => {
    const [form] = Form.useForm();
    const [formModal] = Form.useForm()

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    // const [pagination, setPagination] = useState({});
    // const [onChange, setOnChange] = useState({});
    const [columns, setColumns] = useState([]);
    const [chequeStatus, setChequeStatus] = useState([]);
    const [chequePaymentType, setChequePaymentType] = useState([])

    const [isOpen, setIsOpen] = useState(false);
    const [dataModal, setDataModal] = useState(0);
    const [dataID, setdataID] = useState(0)
    const componentRef = useRef(null);

    const setUpColumns = () => {
        setColumns([
            {
                title: "#",
                dataIndex: "id",
                key: "id",
                align: "center",
                render: (text, record, index) => (
                    index + 1
                )
            },
            {
                title: "วันที่ตัดเช็ค",
                dataIndex: "cheque_clearance_date",
                key: "cheque_clearance_date",
                align: "center",
                render: (text, record) => (
                    new Date(record.cheque_clearance_date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })

                )
            },
            {
                title: "ธนาคาร",
                dataIndex: "bank_name",
                key: "bank_name",
                align: "center",
                render: (text, record) => (
                    <div className="flex justify-start">
                        <span className="align-text-icon">
                            <img src={banksLogo.Get(record.short_code).image} alt="bank"
                                style={{ height: 24, width: 24, backgroundColor: banksLogo.Get(record.short_code).color, borderRadius: 3 }} /></span>
                        <span className="align-text-icon">&nbsp;&nbsp;{record.bank_name}</span>
                    </div>
                )
            },
            {
                title: "เลขที่เช็ค",
                dataIndex: "cheque_number",
                key: "cheque_number",
                align: "center",
            },
            {
                title: "วันที่ออกเช็ค",
                dataIndex: "cheque_issue_date",
                key: "cheque_issue_date",
                align: "center",
                render: (text, record) => (
                    new Date(record.cheque_issue_date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })
                )
            },
            {
                title: "รายละเอียดการจ่าย",
                dataIndex: "cheque_payment_remark",
                key: "cheque_payment_remark",
                align: "center",
                render: (text) => (
                    <div className="flex justify-start">
                        <label htmlFor="">{
                            text
                        }</label>
                    </div>
                )
            },
            {
                title: "จำนวนเงิน",
                dataIndex: "amount",
                key: "amount",
                align: "center",
                render: (text) => (
                    <div className="flex justify-end">
                        <label htmlFor="">
                            {
                                formatterPrice(text)
                            }</label>
                    </div>
                )
            },
            {
                title: "การจ่ายเงิน",
                dataIndex: "payment_type_name",
                key: "payment_type_name",
                align: "center",
                // render: (text, record) => (
                //     <div className="flex justify-start">
                //         <label htmlFor="">{
                //             text
                //         }</label>
                //     </div>
                // )
            },
            {
                title: "สถานะ",
                dataIndex: "status_id",
                key: "status_id",
                align: "center",
                render: (text, record) => (

                    record.status_id === 1 ?
                        <div className="flex justify-start">
                            <Space>
                                <Badge status="warning" />
                                <span>{record.status_name}</span>
                            </Space >
                        </div>
                        :
                        <div className="flex justify-start">
                            <Space>
                                <Badge status="success" />
                                <span>{record.status_name}</span>
                            </Space>
                        </div>

                )
            },
            {
                title: "ดำเนินการ",
                key: "action",
                align: "center",
                render: (text, record) => (
                    <span>
                        <Button
                            style={{ marginRight: "10px" }}
                            className="btn-edit"
                            type="link"
                            onClick={() => {
                                handleOpen(record.id, record.status_id);
                            }}
                            icon={<EditOutlined />}
                        />
                        <Button
                            className="btn-delete"
                            type="link"
                            onClick={() => {
                                onConfirm(record.id)
                            }}
                            icon={<DeleteOutlined />}
                        />
                    </span>
                ),
            }
        ]);
    };

    const fetchDataCheque = async () => {
        try {
            setLoading(true);
            const response = await chequeService.getCheque();
            setData(response?.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const onConfirm = async (values) => {
        ShowConfirm("ยืนยันการลบข้อมูล", "คุณต้องการลบข้อมูลหรือไม่ ?").then(async (res) => {
            if (res) {
                onSubmit(values);
            }
        });
    };

    const onSubmit = async (values) => {
        const requestData = {
            id: values
        };
        const response = await chequeService.deleteCheque(requestData);
        if (response?.data) {
            // สร้าง notification บันทึกข้อมูลสำเร็จ
            NotiAfterConfirm("success", "บันทึกข้อมูลสำเร็จ", "บันทึกข้อมูลสำเร็จ");
            fetchDataCheque();
        } else {
            // สร้าง notification บันทึกข้อมูลไม่สำเร็จ
            NotiAfterConfirm("error", "บันทึกข้อมูลไม่สำเร็จ", "บันทึกข้อมูลไม่สำเร็จ");

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

    const getMasterChequeStatus = async () => {
        const response = await masterService.getMasterChequeStatus();
        if (response?.data.length > 0) {
            setChequeStatus(response?.data);
        } else {
            console.log("error");
        }
    };

    const handleOpen = (id, idStatus) => {
        // const data = {status_id:id}
        setdataID(id);
        setDataModal(idStatus);
        setIsOpen(true);
    }

    const handleCancel = () => {
        // await setDataModal([]);
        setIsOpen(false);
    };

    const onConfirmModal = async (values) => {
        ShowConfirm("ยืนยันการบันทึกข้อมูล", "คุณต้องการบันทึกข้อมูลหรือไม่ ?").then(async (res) => {
            if (res) {
                onSubmitModal(values);
            }
        });
    };

    const onSubmitModal = async (values) => {
        const requestData = {
            id: dataID,
            status_id: values.data
        }

        const response = await chequeService.updateCheque(requestData);
        if (response?.data) {
            // สร้าง notification บันทึกข้อมูลสำเร็จ
            NotiAfterConfirm("success", "บันทึกข้อมูลสำเร็จ", "บันทึกข้อมูลสำเร็จ");
            fetchDataCheque();
        } else {
            // สร้าง notification บันทึกข้อมูลไม่สำเร็จ
            NotiAfterConfirm("error", "บันทึกข้อมูลไม่สำเร็จ", "บันทึกข้อมูลไม่สำเร็จ");
        }
        setIsOpen(false);
    }

    const searchCheque = async (values) => {
        try {
            setLoading(true);
            const response = await chequeService.searchCheque(values);
            setData(response?.data);
            setTableParams({
                ...tableParams,
                pagination: {
                    ...tableParams.pagination,
                    total: response?.data?.length,
                },
            });
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMasterChequePaymentType();
        getMasterChequeStatus();
        setUpColumns();
        fetchDataCheque();
    }, []);

    return (
        <>
            <div
                className="title-page"
            >
                <h3 className="text-[#444444]" >จัดการรายการเช็ค</h3>
            </div>
            <div
                className="padding-content"
            >
                <SearchBarComponent
                    form={form}
                    isType={true}
                    isStatus={true}
                    status={chequeStatus}
                    type={chequePaymentType}
                    onSearch={(values) => {
                        console.log("values", values);
                        searchCheque(values)
                    }}
                />

                <div
                    className="content-list"
                >
                    <div
                        style={{ marginBottom: "20px" }}
                    >
                        <Row
                            gutter={[16, 16]}
                            align={"center"}
                            justify={"space-between"}
                        >
                            <Col

                            >
                                <h6 className="text-[#444444]">ผลการค้นหา</h6>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        navigate("/cheque/add");
                                    }}
                                    icon={<PlusOutlined />}
                                >
                                    เพิ่มข้อมูล
                                </Button>
                            </Col>
                        </Row>
                    </div>
                    <TableComponent
                        rowKey={index => index}
                        form={form}
                        dataSource={loading ? [] : [data]}
                        columns={[columns]}
                        loading={false}
                        pagination={{}}
                        onChange={() => {
                            // handleTableChange();
                        }}
                    />
                </div>
                <ChequeEdit
                    componentRef={componentRef}
                    title="เปลี่ยนสถานะ"
                    open={isOpen}
                    chequeStatus={chequeStatus}
                    dataSelect={dataModal}
                    setData={setDataModal}
                    onCancel={handleCancel}
                    formModal={formModal}
                    onConfirmModal={onConfirmModal}
                />
            </div >
        </>
    );
};

export default ChequeList;