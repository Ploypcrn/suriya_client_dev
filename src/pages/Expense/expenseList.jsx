import { useEffect, useState, useRef } from "react";
import { Button, Col, Form, Row, Badge, Space } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import SearchBarComponent from "../../components/SearchBar/index";
import TableComponent from "../../components/Table/index";
import { useNavigate } from "react-router-dom";
import expenseService from '../../services/expenseService';
import masterService from "../../services/masterService";
import ShowConfirm from "../../Notification/ModalBeforeConfirm";
import NotiAfterConfirm from "../../Notification/NotiAfterConfirm";
import { formatterPrice } from "../../utils/formatterPrice";
import Topbar from "../../components/Topbar";

const ExpenseList = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [columns, setColumns] = useState([]);

    const [expenseType, setExpenseType] = useState([])

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
                title: "วันที่",
                dataIndex: "update_date",
                key: "update_date",
                align: "center",
                render: (text, record) => (
                    new Date(record.update_date).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })

                )
            },
            {
                title: "รวมรายจ่าย",
                dataIndex: "total_amount",
                key: "total_amount",
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
                title: "น้ำมัน",
                dataIndex: "total_expense_type_1",
                key: "total_expense_type_1",
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
                title: "เบิกเงินล่วงหน้า",
                dataIndex: "total_expense_type_2",
                key: "total_expense_type_2",
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
                title: "ทางด่วน",
                dataIndex: "total_expense_type_3",
                key: "total_expense_type_3",
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
                title: "อื่นๆ",
                dataIndex: "total_expense_type_4",
                key: "total_expense_type_4",
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
                                navigate(`/expenses/edit/${record.update_date}`);
                            }}
                            icon={<EditOutlined />}
                        />
                        <Button
                            className="btn-delete"
                            type="link"
                            onClick={() => {
                                onConfirm(record.ids)
                            }}
                            icon={<DeleteOutlined />}
                        />
                    </span>
                ),
            }
        ]);
    };
    

    const getMasterExpenseType = async () => {
        const response = await masterService.getMasterExpenseType();

        if (response?.data.length > 0) {
            setExpenseType(response?.data);
        } else {
            console.log("error");
        }
    };

    const getDateOnly = (isoString) => {
        return new Date(isoString).toISOString().split("T")[0];
    };

    const fetchDataExpense = async () => {
        try {
            setLoading(true);
            const response = await expenseService.getExpense();

            const grouped = {};



            response?.data.forEach(item => {
                const dateKey = getDateOnly(item.update_date);
                if (!grouped[dateKey]) {
                    grouped[dateKey] = {
                        update_date: dateKey,
                        total_amount: 0,
                        total_expense_type_1: 0,
                        total_expense_type_2: 0,
                        total_expense_type_3: 0,
                        total_expense_type_4: 0,
                        ids : []
                    };
                }

                const amount = parseFloat(item.amount || "0");

                grouped[dateKey].total_amount += amount;
                grouped[dateKey].ids.push(item.id);

                switch (item.expense_type_id) {
                    case 1:
                        grouped[dateKey].total_expense_type_1 += amount;
                        break;
                    case 2:
                        grouped[dateKey].total_expense_type_2 += amount;
                        break;
                    case 3:
                        grouped[dateKey].total_expense_type_3 += amount;
                        break;
                    case 4:
                        grouped[dateKey].total_expense_type_4 += amount;
                        break;
                }
            });

            // Convert to array and add ID (for table)
            const mappedData = Object.entries(grouped).map(([date, data], index) => ({
                id: index + 1,
                update_date: data.update_date,
                total_amount: data.total_amount,
                total_expense_type_1: data.total_expense_type_1,
                total_expense_type_2: data.total_expense_type_2,
                total_expense_type_3: data.total_expense_type_3,
                total_expense_type_4: data.total_expense_type_4,
                ids: data.ids.join(",")
            }));

            console.log(mappedData)

            setData(mappedData);
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
        const ids = typeof values === 'string' ? values.split(',').map(id => id.trim()) : [];

        let success = true;

        for (const id of ids) {
            const requestData = {
                id: id
            };
            const response = await expenseService.deleteExpense(requestData);

            if (!response?.data) {
                success = false;
            }
        }

        if (success) {
            NotiAfterConfirm("success", "บันทึกข้อมูลสำเร็จ", "บันทึกข้อมูลสำเร็จ");
            fetchDataExpense();
        } else {
            NotiAfterConfirm("error", "บันทึกข้อมูลไม่สำเร็จ", "บันทึกข้อมูลไม่สำเร็จ");
        }
    };


    const searchExpense = async (values) => {
        try {
            setLoading(true);
            const response = await expenseService.searchExpense(values);
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
        setUpColumns();
        fetchDataExpense();
        getMasterExpenseType();
    }, []);

    return (
      <>
           <Topbar
                  leftSlot={
                    <div className="title-page">
                      <h3 className="text-[#444444]">จัดการรายจ่าย</h3>
                    </div>
                  }
                />
          
          <div className="padding-content">
            <SearchBarComponent
              form={form}
              isType={true}
              type={expenseType}
              onSearch={(values) => {
                console.log("values", values);
                searchExpense(values);
              }}
            />
  <div className="container mx-auto">
 <div className="content-list">
              <div style={{ marginBottom: "20px" }}>
                <Row
                  gutter={[16, 16]}
                  align={"center"}
                  justify={"space-between"}
                >
                  <Col>
                    <h6 className="text-[#444444]">ผลการค้นหา</h6>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                     onClick={() => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    navigate("/expenses/edit/" + today);
  }}
                      icon={<PlusOutlined />}
                    >
                      เพิ่มข้อมูล
                    </Button>
                  </Col>
                </Row>
              </div>
              <TableComponent
                rowKey={(index) => index}
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
  </div>
           
          </div>
      </>
    );
}

export default ExpenseList;