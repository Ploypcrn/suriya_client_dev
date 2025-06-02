import { Button, Form, Modal, Select, Space } from "antd";
import { ClearOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import _ from "lodash";
import { PrinterOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import billService from "../services/billService";

const PrintListPDF = (props) => {
  const { title, open, billId, onCancel, company } = props;
  const [form] = Form.useForm();

  const getBillByBillNo = async (id) => {
    try {
      const response = await billService.getBillByBillNo(id);
      console.log(
        "PrintListPDF -> getBillById -> response: ",
        response.data[0]
      );
      localStorage.setItem("data", JSON.stringify(response.data[0]));
    } catch (error) {
      console.error("PrintListPDF -> getBillById -> error", error);
    }
  };

  useEffect(() => {
    getBillByBillNo(billId);
  }, [billId]);

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
              const data = form.getFieldsValue();
              window.open(`/print-pdf/${data.documentType}`);
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
              console.log("value : ", value);
              const companyData = _.find(company, { company_name: value }).id;
              localStorage.setItem("company_id", companyData);
            }}>
            {company.map((item) => {
              return (
                <Select.Option
                  key={item.id}
                  value={item.company_name}>
                  {item.company_name}
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
            {/* <Select.Option value="6">
                            อื่นๆ
                        </Select.Option> */}
          </Select>
        </Form.Item>
        <hr className="text-lg mb-4" />
      </Form>
    </Modal>
  );
};

PrintListPDF.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  billId: PropTypes.string,
  onCancel: PropTypes.func,
  company: PropTypes.array,
};

export default PrintListPDF;
