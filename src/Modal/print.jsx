import { Button, Form, Modal, Select, Space } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PrinterOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import billService from "../services/billService";

const PrintPDF = (props) => {
  const navigate = useNavigate();
  const { title, open, data, onCancel, company, isStatus } = props;
  const [form] = Form.useForm();
  const params = new URLSearchParams(window.location.search);
  const lastPath = window.location.pathname.split("/").pop();
  console.log(data);

  const onSubmit = async () => {
    if (isStatus === "add") {
      // const response = await billService.createBill(data);
      const response = await billService.createBillFreeText(data);
      if (response.status === 200) {
        const responseGetData = await billService.getBillByBillNo(
          response?.data?.[0].bill_number
        );
        if (responseGetData?.query_result) {
          localStorage.setItem(
            "data",
            JSON.stringify(responseGetData?.data[0])
          );
          const data = form.getFieldsValue();
          window.open(`/print-pdf/${data.documentType}`);
        }
      }
    } else if (isStatus === "view") {
      const responseGetData = await billService.getBillByBillNo(data?.billNo);
      if (responseGetData?.query_result) {
        localStorage.setItem("data", JSON.stringify(responseGetData?.data[0]));
        const data = form.getFieldsValue();
        window.open(`/print-pdf/${data.documentType}`);
      }
    } else {
      const responseUpdate = await billService.updateBillFreeText(
        data?.billId,
        data
      );
      if (responseUpdate?.data.rowCount > 0) {
        const responseGetData = await billService.getBillByBillNo(data?.billNo);
        if (responseGetData?.query_result) {
          localStorage.setItem(
            "data",
            JSON.stringify(responseGetData?.data[0])
          );
          const data = form.getFieldsValue();
          window.open(`/print-pdf/${data.documentType}`);
        }
      }
    }
  };

  useEffect(() => {
    localStorage.removeItem("data");
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

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
            icon={<ClearOutlined />}
            onClick={onCancel}>
            ยกเลิก
          </Button>

          <Button
            type="primary"
            icon={<PrinterOutlined />}
            onClick={() => {
              // const data = form.getFieldsValue();
              // window.open(`/print-pdf/${data.documentType}`);
              onSubmit();
            }}>
            พิมพ์
          </Button>
        </Space>
      }
      onCancel={onCancel}
      open={open}>
      <Form
        name="basic"
        wrapperCol={{ span: 24 }}
        form={form}>
        <hr className="text-lg mb-4" />
        <Form.Item
          label="ออกบิลในนาม"
          name="billTo">
          <Select
            placeholder="เลือก"
            onChange={(value) => {
              const companyData = company.find((x) => x.label === value).value;
              localStorage.setItem("company_id", companyData);
            }}>
            {company.map((item) => {
              return (
                <Select.Option
                  key={item.id}
                  value={item.label}>
                  {item.label}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="ประเภทเอกสาร"
          name="documentType">
          <Select placeholder="เลือก">
            <Select.Option value="1">ใบเสนอราคา</Select.Option>
            <Select.Option value="2">ใบแจ้งหนี้</Select.Option>
            <Select.Option value="3">ใบเสร็จรับเงิน</Select.Option>
            <Select.Option value="4">
              ใบเสร็จรับเงิน / ใบกำกับภาษี
            </Select.Option>
            <Select.Option value="5">ใบเสร็จร้านดอกไม้</Select.Option>
          </Select>
        </Form.Item>
        <hr className="text-lg mb-4" />
      </Form>
    </Modal>
  );
};

PrintPDF.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  data: PropTypes.array,
  onCancel: PropTypes.func,
  company: PropTypes.array,
  isStatus: PropTypes.string,
};

export default PrintPDF;
