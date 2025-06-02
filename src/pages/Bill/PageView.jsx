/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";
import { Form, Button, Row, Col, Input, Table, Checkbox } from "antd";
import { formatterPrice } from "../../utils/formatterPrice";
import DateFormat from "../../utils/dateUtils";
import ShowConfirm from "../../Notification/ModalBeforeConfirm";
import NotiAfterConfirm from "../../Notification/NotiAfterConfirm";
import PrintPDF from "../../Modal/print";
import stockService from "../../services/stockService";
import billService from "../../services/billService";
import masterService from "../../services/masterService";
import userService from "../../services/userService";
import companyService from "../../services/companyService";
import moment from "moment";
import Topbar from "../../components/Topbar";
import dayjs from "dayjs";

// issuetime: "2024-03-24T11:14:49.400Z"
// receivetime: "2024-03-25T02:00:00.000Z"

const { TextArea } = Input;

const BillDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const componentRef = useRef(null);
  const deceased = Form.useWatch("deceased", form);
  const contact = Form.useWatch("contact", form);
  const address = Form.useWatch("address", form);
  const phone = Form.useWatch("phone", form);
  const receiveFrom = Form.useWatch("receiveFrom", form);
  const receiveDate = Form.useWatch("receiveDate", form);
  const issueDate = Form.useWatch("issueDate", form);
  const send = Form.useWatch("send", form);
  const donate = Form.useWatch("donate", form);
  const type = Form.useWatch("type", form);
  const bookNo = Form.useWatch("bookNo", form);
  const billNo = Form.useWatch("billNo", form);
  const billBy = Form.useWatch("billBy", form);
  const paymentMethod = Form.useWatch("paymentMethod", form);

  const [receiveTime, setReceiveTime] = useState("");
  const [issueTime, setIssueTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [dataModal, setDataModal] = useState([]);

  const [data, setData] = useState([]);
  const [product, setProduct] = useState([]);
  const [paymentType, setPaymentType] = useState([]);
  const [userBill, setUserBill] = useState([]);
  const [typeId, setTypeId] = useState(0);
  const [billUserId, setBillUserId] = useState(0);
  const [paymentTypeId, setPaymentTypeId] = useState(0);
  const [company, setCompany] = useState([]);
  const [sum, setSum] = useState(0.0);
  const [discount, setDiscount] = useState(0);
  const [priceAfterDiscount, setPriceAfterDiscount] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [payExtra, setPayExtra] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [remark, setRemark] = useState("");
  const [note, setNote] = useState("");
  const [billOn, setBillOn] = useState("");
  const [listProductData, setListProductData] = useState([]);

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "billId",
      key: "billId",
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "รายการ",
      dataIndex: "stock_name",
      key: "stock_name",
      width: 200,
      align: "start",
      render: (text, record, index) => {
        return (
          <>
            {record.stock_name === "อื่นๆ" ? (
              <>
                <div className="flex flex-col">
                  <span>
                    {record.stock_other} ({record.stock_name})
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col">
                  <span>{record.stock_name}</span>
                </div>
              </>
            )}
          </>
        );
      },
    },
    {
      title: "จำนวน",
      dataIndex: "amount_used",
      key: "amount_used",
      width: 100,
      align: "right",
      render: (text, record, index) => {
        return <span>{text}</span>;
      },
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
      width: 100,
      align: "right",
      render: (text, record, index) => {
        return (
          <div className="flex justify-end">
            <span>{formatterPrice(text)}</span>
          </div>
        );
      },
    },
    {
      title: "รวม",
      dataIndex: "total_price",
      key: "total_price",
      width: 50,
      align: "right",
      render: (text, record, index) => {
        return (
          <div className="flex justify-end">
            <span>{formatterPrice(text)}</span>
          </div>
        );
      },
    },
  ];

  const getProduct = async () => {
    const response = await stockService.getStock();
    if (response?.data.length > 0) {
      setProduct(response?.data);
    } else {
      console.log("error");
    }
  };

  const generateBookNo = () => {
    const date = new Date();
    const year = date.getFullYear() + 543;

    const bookNo = year.toString().substr(-2);

    form.setFieldsValue({
      bookNo: bookNo,
    });
  };

  const generateBillNo = async (type) => {
    const response = await billService.generateBillNo();
    if (response?.data) {
      form.setFieldsValue({
        billNo: type === 1 ? `BN${response?.data}` : `WS${response?.data}`,
      });
    } else {
      console.log("error");
    }
  };

  const getMasterPaymentType = async () => {
    const response = await masterService.getMasterPaymentType();
    if (response?.data.length > 0) {
      setPaymentType(response?.data);
    } else {
      console.log("error");
    }
  };

  const getUsersAll = async () => {
    const response = await userService.getUsersAll();
    if (response?.data.length > 0) {
      let users = [];
      response?.data.map((item) => {
        users.push({
          userId: item.id,
          name: `${item.nickname} : ${item.firstname} ${item.lastname}`,
        });
      });
      setUserBill(users);
    } else {
      console.log("error");
    }
  };

  const getCompany = async () => {
    const response = await companyService.getCompany();
    if (response?.data) {
      setCompany(
        response?.data.map((item) => ({
          label: item.company_name,
          value: item.id,
        }))
      );
    } else {
      console.log("error");
    }
  };

  const getBillByBillNo = async (billOn) => {
    const response = await billService.getBillByBillNo(billOn);
    if (response?.data.length > 0) {
      let listProduct = [];
      let dataBill = response?.data[0];
      setListProductData(dataBill.listProduct);
      form.setFieldsValue({
        billId: dataBill.billid,
        billNo: dataBill.billno,
        bookNo: dataBill.bookno,
        type: dataBill.company_name,
        deceased: dataBill.deceased,
        contact: dataBill.contact,
        address: dataBill.address,
        phone: dataBill.phone,
        receiveFrom: dataBill.receive,
        receiveDate: dataBill.receivedate,
        issueDate: dataBill.issuedate,
        send: dataBill.send,
        donate: dataBill.donate,
        billBy: dataBill.billuser,
        paymentMethod: dataBill.paymentname,
        remark: dataBill.remark,
        note: dataBill.note,
      });
      setReceiveTime(dataBill.receivetime);
      setIssueTime(dataBill.issuetime);
      setTotalAmount(dataBill.total);
      setSum(dataBill.total);
      setDeposit(dataBill.deposit);
      setPayExtra(dataBill.payextra || 0);
      setDiscount(parseInt(dataBill?.discount));
      setPriceAfterDiscount(parseInt(dataBill?.priceafterdiscount));
      setRemaining(parseInt(dataBill?.remaining));
      setNote(dataBill.note);
      setRemark(dataBill.remark);
    } else {
      console.log("error");
    }
  };

  const handleOpen = () => {
    form
      .validateFields()
      .then(() => {
        let values = form.getFieldsValue();
        let listProduct = [];
        listProductData?.map((item) => {
          listProduct.push({
            stockId: item.stock_id,
            stockName: item.stock_name,
            warehouse: parseInt(item.in_stock),
            amount: item.amount_used,
            price: item.price,
            totalPrice: item.total_price,
          });
        });
        const requestData = {
          billId: values.billId,
          billNo: values.billNo,
          bookNo: values.bookNo,
          type: values.type,
          typeId: typeId,
          deceased: values.deceased,
          contact: values.contact,
          address: values.address,
          phone: values.phone,
          receiveFrom: values.receiveFrom,
          receiveDate: values.receiveDate,
          receiveTime: receiveTime,
          issueDate: values.issueDate,
          issueTime: issueTime,
          send: values.send,
          donate: values.donate,
          listProduct: listProduct,
          sum: sum,
          discount: discount,
          priceAfterDiscount: priceAfterDiscount,
          deposit: deposit,
          remaining: remaining,
          totalAmount: totalAmount,
          remark: remark,
          note: note,
          billBy: values.billBy,
          billUserId: billUserId,
          paymentMethod: values.paymentMethod,
          paymentTypeId: paymentTypeId,
          payExtra: payExtra,
        };

        setDataModal(requestData);
        setIsOpen(true);
      })
      .catch((error) => {
        NotiAfterConfirm(
          "error",
          "กรุณากรอกข้อมูลให้ครบ",
          "กรุณากรอกข้อมูลให้ครบ"
        );
      });
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    getProduct();
    generateBillNo();
    generateBookNo();
    getMasterPaymentType(1);
    getUsersAll();
    getCompany();
  }, []);

  useEffect(() => {
    setBillOn(location.pathname.split("/")[3]);
  }, [data, sum]);

  useEffect(() => {
    getBillByBillNo(billOn);
  }, [billOn]);

  return (
    <>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinishFailed={(errorInfo) => {
          console.log("Failed:", errorInfo);
        }}>
        <Topbar
          leftSlot={
            <>
              <Button
                className="btn-back"
                type="link"
                style={{ fontSize: "20px" }}
                icon={<ArrowLeftOutlined style={{ fontSize: "20px" }} />}
                onClick={() => {
                  navigate("/bill");
                }}
              />
              <h3>ใบเรียกเก็บเงิน</h3>
            </>
          }
          rightSlot={
            <>
              <Button
                className="btn-reset"
                type="print"
                onClick={() => {
                  handleOpen();
                }}
                icon={<PrinterOutlined />}>
                พิมพ์เอกสาร
              </Button>
            </>
          }
        />

        <div className="flex justify-center mt-4">
          <div
            className=" bg-white
                            shadow-md
                            rounded-lg
                            p-4
                            flex
                            flex-col
                            gap-4
                            container
                            justify-center
        ">
            <div className=" ">
              <Row>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                  xxl={{ span: 8 }}>
                  <div
                    style={{
                      marginBottom: "20px",
                    }}>
                    <Form.Item
                      name="billId"
                      hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      style={{ width: "100%" }}
                      label="ผู้เสียชีวิต"
                      name="deceased">
                      <span> {deceased} </span>
                    </Form.Item>

                    <Form.Item
                      style={{ width: "100%" }}
                      label="ผู้ติดต่อ"
                      name="contact">
                      <span> {contact} </span>
                    </Form.Item>

                    <Form.Item
                      style={{ width: "100%" }}
                      label="ที่อยู่"
                      name="address">
                      <span> {address} </span>
                    </Form.Item>

                    <Form.Item
                      style={{ width: "100%" }}
                      label="เบอร์โทรศัพท์"
                      name="phone">
                      <span> {phone} </span>
                    </Form.Item>

                    <Form.Item
                      style={{ width: "100%" }}
                      label="รับจาก"
                      name="receiveFrom">
                      <span> {receiveFrom} </span>
                    </Form.Item>

                    <Form.Item
                      style={{ width: "100%" }}
                      label="วันเวลาที่รับ"
                      name="receiveDate">
                      <div className="">
                        <span> {receiveDate} </span>
                      </div>
                      <div>
                        <span>
                          {receiveTime
                            ? dayjs(receiveTime, "HH:mm").format("HH:mm")
                            : "-"}{" "}
                        </span>
                      </div>
                    </Form.Item>

                    <Form.Item
                      style={{ width: "100%" }}
                      label="ส่ง"
                      name="send">
                      <span> {send} </span>
                    </Form.Item>
                  </div>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                  xxl={{ span: 8 }}>
                  <div
                    style={{
                      height: "100%",
                      marginBottom: "20px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}>
                    <Form.Item
                      style={{ width: "100%" }}
                      label="บริจาค"
                      name="donate">
                      {Form.useWatch("donate", form) === true ? (
                        <span> บริจาค </span>
                      ) : (
                        <span> ไม่บริจาค </span>
                      )}
                    </Form.Item>

                    <Form.Item
                      style={{ width: "100%" }}
                      label="ประเภท"
                      name="type">
                      <span> {type} </span>
                    </Form.Item>

                    <Form.Item
                      style={{ width: "100%" }}
                      label="วันเวลาที่ออกบิล"
                      name="issueDate">
                      <div className="">
                        <span> {issueDate} </span>
                      </div>
                      <div>
                        <span>
                          {" "}
                          {issueTime
                            ? dayjs(issueTime, "HH:mm").format("HH:mm")
                            : "-"}{" "}
                        </span>
                      </div>
                    </Form.Item>
                  </div>
                </Col>
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 24 }}
                  md={{ span: 24 }}
                  lg={{ span: 8 }}
                  xl={{ span: 8 }}
                  xxl={{ span: 8 }}>
                  <div
                    style={{
                      height: "100%",
                      marginBottom: "20px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                      }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}>
                        <h6 className="text-[#444444]">จำนวนเงินรวมทั้งสิ้น</h6>
                      </div>
                      <div>
                        <h3 className="text-[#01A6E6]">
                          {formatterPrice(remaining)}
                        </h3>
                      </div>
                    </div>
                    <div>
                      <Form.Item
                        style={{ width: "100%" }}
                        label="เล่มที่"
                        name="bookNo">
                        <span> {bookNo} </span>
                      </Form.Item>
                      <Form.Item
                        style={{ width: "100%" }}
                        label="เลขที่บิล"
                        name="billNo">
                        <span> {billNo} </span>
                      </Form.Item>
                      <Form.Item
                        style={{ width: "100%" }}
                        label="ผู้ออกบิล"
                        name="billBy">
                        <span> {billBy} </span>
                      </Form.Item>
                      <Form.Item
                        style={{ width: "100%" }}
                        label="การจ่ายเงิน"
                        name="paymentMethod">
                        <span> {paymentMethod} </span>
                      </Form.Item>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="content-list">
              <Table
                bordered
                columns={columns}
                dataSource={listProductData}
                pagination={false}
                scroll={{ x: 1500 }}
              />
              <div>
                <div className="flex flex-col justify-end items-end mt-4">
                  <div className="grid grid-cols-2 mb-4 w-1/5">
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className=" text-[#01A6E6] mr-1 ">
                        รวมเป็นเงิน :{" "}
                      </span>
                    </div>
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className="ml-1">
                        {" "}
                        {formatterPrice(sum.toString())}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 mb-4 w-1/5">
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className=" text-[#01A6E6] mr-1 ">ส่วนลด : </span>
                    </div>
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className="ml-1">
                        {" "}
                        {formatterPrice(discount.toString())}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 mb-4 w-1/5">
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className=" text-[#01A6E6] mr-1 ">
                        ราคาหลังหักส่วนลด :{" "}
                      </span>
                    </div>
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className="ml-1">
                        {" "}
                        {formatterPrice(priceAfterDiscount.toString())}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 mb-4 w-1/5">
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className=" text-[#01A6E6] mr-1 ">มัดจำ : </span>
                    </div>
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className="ml-1">
                        {" "}
                        {formatterPrice(deposit.toString())}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 mb-4 w-1/5">
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className=" text-[#01A6E6] mr-1 ">ชำระแล้ว : </span>
                    </div>
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className="ml-1">
                        {" "}
                        {formatterPrice(payExtra.toString())}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 mb-4 w-1/5">
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className=" text-[#01A6E6] mr-1 ">คงเหลือ : </span>
                    </div>
                    <div className=" col-span-1 flex justify-end items-center">
                      <span className="ml-1">
                        {" "}
                        {formatterPrice(remaining.toString())}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-3 gap-4 ">
                  <div className=" col-span-1  break-words text-wrap">
                    <span className="">หมายเหตุ : </span>
                    {remark || "-"}
                  </div>
                  <div className=" col-span-1 break-words text-wrap">
                    <span className="">โน๊ตภายใน : </span>
                    {note || "-"}
                  </div>
                  <div className=" col-span-1 "></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
      {isOpen && (
        <PrintPDF
          componentRef={componentRef}
          title="พิมพ์รายงาน"
          open={isOpen}
          company={company}
          data={dataModal}
          isStatus="view"
          onCancel={() => {
            handleCancel();
          }}
        />
      )}
    </>
  );
};

export default BillDetail;
