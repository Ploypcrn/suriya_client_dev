import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ShowConfirm from "../../Notification/ModalBeforeConfirm";
import NotiAfterConfirm from "../../Notification/NotiAfterConfirm";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Form, Button, Row, Col, Input, InputNumber, Select } from "antd";
import masterService from "../../services/masterService";
import expenseService from "../../services/expenseService";
import DatePicker from "../../components/DatePicker";
import TableComponent from "../../components/Table/index2";

const ExpenseEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [id, setId] = useState("");
  const [data, setData] = useState([]);
  const [deletedItems, setDeletedItems] = useState([]);
  const [expenseType, setExpenseType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);

  const getMasterExpenseType = async () => {
    const response = await masterService.getMasterExpenseType();
    if (response?.data?.length > 0) {
      setExpenseType(response.data);
    } else {
      console.log("Error fetching expense types");
    }
  };

  const getDateOnly = (isoString) => {
    return new Date(isoString).toISOString().split("T")[0];
  };

  const setUpColumns = () => {
    const cols = [
      {
        title: "ประเภทรายจ่าย",
        dataIndex: "expenseType",
        key: "expenseType",
        align: "center",
        render: (text, record, index) => (
          <Form.Item
            name={["data", index, "expenseType"]}
            rules={[{ required: true, message: "กรุณาเลือกประเภทรายจ่าย" }]}
            style={{ width: "100%" }}
          >
            <Select placeholder="เลือกประเภทรายจ่าย" style={{ width: "100%" }}>
              {expenseType.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        ),
      },
      {
        title: "รายละเอียดการจ่าย",
        dataIndex: "expenseName",
        key: "expenseName",
        align: "center",
        render: (text, record, index) => (
          <Form.Item
            name={["data", index, "expenseName"]}
            rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
            style={{ width: "100%" }}
          >
            <Input placeholder="กรอกรายละเอียดการจ่าย" />
          </Form.Item>
        ),
      },
      {
        title: "จำนวนเงิน",
        dataIndex: "amount",
        key: "amount",
        align: "center",
        render: (text, record, index) => (
          <Form.Item
            name={["data", index, "amount"]}
            rules={[{ required: true, message: "กรุณากรอกจำนวนเงิน" }]}
            style={{ width: "100%" }}
          >
            <InputNumber
              min={1}
              placeholder="กรุณากรอกจำนวนเงิน"
              style={{ width: "100%" }}
            />
          </Form.Item>
        ),
      },
      {
        title: "หมายเหตุ",
        dataIndex: "expenseRemark",
        key: "expenseRemark",
        align: "center",
        render: (text, record, index) => (
          <Form.Item
            name={["data", index, "expenseRemark"]}
            style={{ width: "100%" }}
          >
            <Input.TextArea
              maxLength={100}
              showCount
              placeholder="กรอกรายละเอียด"
            />
          </Form.Item>
        ),
      },
      {
        title: "ดำเนินการ",
        key: "action",
        align: "center",
        render: (text, record, index) => (
          <Button
            type="link"
            className="primary"
            icon={<DeleteOutlined />}
            onClick={() => {
              ShowConfirm("ยืนยันลบ", "คุณต้องการลบรายการนี้ใช่หรือไม่?").then(
                (res) => {
                  if (res) removeRow(index);
                }
              );
            }}
          />
        ),
      },
    ];
    setColumns(cols);
  };

  const mapExpenseData = (rawData) => {
    return rawData.map((item) => ({
      id: item.id,
      expenseType: item.expense_type_id,
      expenseName: item.expense_name,
      amount: Number(item.amount),
      expenseRemark: item.remark || "",
    }));
  };

  const getExpenseById = async (id) => {
    const response = await expenseService.getExpense();

    const groupData = [];

    if (Array.isArray(response?.data)) {
      response.data.forEach((item) => {
        const dateKey = getDateOnly(item.update_date);
        if (dateKey === id) {
          groupData.push(item);
        }
      });
    }

    const mappedData = mapExpenseData(groupData);

    setData(mappedData);
    form.setFieldsValue({ data: mappedData });
  };

const removeRow = (index) => {
  setData((prevData) => {
    if (index < 0 || index >= prevData.length) {
      console.warn("Invalid index for removal:", index);
      return prevData;
    }

    const newData = [...prevData];
    const removedItem = newData[index];
    newData.splice(index, 1);

    // Update form data
    form.setFieldsValue({ data: newData });

    // Push to deletedItems if applicable
    if (removedItem?.id && removedItem.id !== 0) {
      setDeletedItems((prev) => [...prev, removedItem]);
    }

    return newData;
  });
};


  const addNewRow = () => {
    const newRow = {
      id: 0,
      expenseType: null,
      expenseName: "",
      amount: null,
      expenseRemark: "",
    };
    const newData = [...data, newRow];
    setData(newData);
    form.setFieldsValue({ data: newData });
  };

  const onConfirm = async (values) => {
    ShowConfirm(
      "ยืนยันการบันทึกข้อมูล",
      "คุณต้องการบันทึกข้อมูลหรือไม่ ?"
    ).then(async (res) => {
      if (res) {
        onSubmit(values);
      }
    });
  };

  const onSubmit = async (values) => {

    let success = true;

    for (const item of values.data) {
      let requestData = {
        expenseType: parseInt(item.expenseType),
        expenseName: item.expenseName,
        amount: item.amount,
        expenseRemark: item.expenseRemark || "",
      };

      let response;

      if (item.id > 0) {
        requestData = { ...requestData, id: item.id };
        response = await expenseService.updateExpense(requestData);
      } else {
        response = await expenseService.createExpense(requestData);
      }

      if (!response?.data) {
        success = false;
      }
    }

    for (const deleted of deletedItems) {
        if(deleted.id > 0){
            const requestData = {
                id: deleted.id
            };
            const response = await expenseService.deleteExpense(requestData);
            if (!response?.data) {
            success = false;
            }
        }
    }

    if (success) {
      NotiAfterConfirm("success", "บันทึกข้อมูลสำเร็จ", "บันทึกข้อมูลสำเร็จ");
      navigate("/expenses");
    } else {
      NotiAfterConfirm(
        "error",
        "บันทึกข้อมูลไม่สำเร็จ",
        "บันทึกข้อมูลไม่สำเร็จ"
      );
    }
  };

  useEffect(() => {
     const extractedId = location.pathname.split("/")[3];
        setId(extractedId);
        if (extractedId) {
            getExpenseById(extractedId);
        }
        getMasterExpenseType();
  }, []);

  useEffect(() => {
    if (expenseType.length > 0 && columns.length === 0) {
      setUpColumns();
    }
  }, [expenseType]);

  return (
    <Form
      form={form}
      onFinish={(values) => {
        onConfirm(values);
      }}
      onFinishFailed={(errorInfo) => {
        console.log("❌ onFinishFailed triggered", errorInfo);
      }}
      name="expense-edit"
      layout="vertical"
    >
      <div className="container mx-auto pt-5">
        <div className="title-page">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/expenses")}
              />
              <h3 className="ml-3">แก้ไขรายจ่าย</h3>
            </div>
            <Button type="primary" icon={<PlusOutlined />} htmlType="submit">
              บันทึกเอกสาร
            </Button>
          </div>
        </div>

        <div className="padding-content">
          <div className="content-list">
            <div style={{ width: "20%", padding: "15px 20px" }}>
              <DatePicker
                disabled
                value={id}
                format="YYYY/MM/DD"
                style={{ fontSize: "20px" }}
              />
            </div>

            <Row justify="center">
              {Array.isArray(columns) && columns.length > 0 && (
                <TableComponent
                  rowKey={(record, index) => record.id || index}
                  form={form}
                  dataSource={loading ? [] : data}
                  columns={columns}
                  loading={false}
                  pagination={false}
                />
              )}

              <div
                style={{ width: "100%", textAlign: "right", padding: "15px" }}
              >
                <Button onClick={addNewRow} icon={<PlusOutlined />}>
                  เพิ่มรายจ่าย
                </Button>
              </div>
            </Row>
          </div>
        </div>
      </div>

      {/* Required for Form.List to be initialized */}
      <Form.List name="data">
        {(fields) =>
          fields.map((field) => (
            <div key={field.key} style={{ display: "none" }}>
              <Form.Item name={[field.name, "expenseType"]}>
                <Input />
              </Form.Item>
              <Form.Item name={[field.name, "expenseName"]}>
                <Input />
              </Form.Item>
              <Form.Item name={[field.name, "amount"]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={[field.name, "expenseRemark"]}>
                <Input />
              </Form.Item>
            </div>
          ))
        }
      </Form.List>
    </Form>
  );
};

export default ExpenseEdit;
