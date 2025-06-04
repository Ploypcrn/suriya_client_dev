/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useMemo } from "react";
import { Router, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  Form,
  Button,
  Row,
  Col,
  Input,
  Table,
  InputNumber,
  Checkbox,
  Select,
  AutoComplete,
} from "antd";
import { formatterPrice } from "../../utils/formatterPrice";
import ShowConfirm from "../../Notification/ModalBeforeConfirm";
import NotiAfterConfirm from "../../Notification/NotiAfterConfirm";
import PhoneInput from "../../components/PhoneInput/index";
import stockService from "../../services/stockService";
import billService from "../../services/billService";
import dayjs from "dayjs";
import { PickerWithType } from "./PickerWithType";
import Topbar from "../../components/Topbar";
import Card from "../../components/Card";
import CardWrapper from "../../components/CardWrapper";
import { usePageManage } from "./dataprovider/PageManage";
import PrintPDF from "./../../Modal/print";
const { TextArea } = Input;

const PageManage = () => {
  const navigate = useNavigate();
  const router = Router;
  const { id } = useParams();
  const isEditMode = !!id;
  //เช็คว่ามี params :id หรือไม่

  const pageManageDataProvider = usePageManage();

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
      title: "ชื่อสินค้า",
      dataIndex: "productName",
      key: "productName",
      width: 400,
      // align: "center",
      render: (text, record, index) => {
        return (
          <Form.Item
            name={[index, "productName"]}
            rules={[{ required: true }]}
            noStyle
          >
            <AutoComplete
              style={{ width: "100%" }}
              options={pageManageDataProvider.ProductManager.filteredOptions}
              onSearch={pageManageDataProvider.ProductManager.handleSearch}
              placeholder="กรอกชื่อสินค้า"
            />
          </Form.Item>
        );
      },
    },
    {
      title: "ราคา",
      dataIndex: "price",
      align: "right",
      width: 100,
      render: (text, record, index) => (
        <Form.Item
          name={[index, "price"]}
          rules={[
            { required: false },
            // {
            //   validator: (_, value) =>
            //     value > -1
            //       ? Promise.resolve()
            //       : Promise.reject(new Error("Price must be greater than 0")),
            // },
          ]}
          noStyle
        >
          <InputNumber
            type="number"
            className="w-full"
            min={0}
            precision={2}
            controls={false}
            onChange={() => {
              pageManageDataProvider.FormManager.form.setFieldsValue({
                discount: 0,
                deposit: 0,
                payExtra: 0,
              });
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "จำนวน",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      width: 100,
      render: (text, record, index) => {
        return (
          <Form.Item
            rules={[
              { required: false },
              // {
              //   validator: (_, value) =>
              //     value > 0
              //       ? Promise.resolve()
              //       : Promise.reject(new Error("Price must be greater than 0")),
              // },
            ]}
            name={[index, "amount"]}
            noStyle
          >
            <InputNumber
              className="w-full"
              type="number"
              min={0}
              precision={0}
              controls={false}
              onChange={() => {
                pageManageDataProvider.FormManager.form.setFieldsValue({
                  discount: 0,
                  deposit: 0,
                  payExtra: 0,
                });
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "รวม",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 50,
      align: "right",
      render: (text, record, index) => {
        const productList =
          pageManageDataProvider.FormManager.productListWatcher || [];
        const amount = productList[index]?.amount || 0;
        const price = productList[index]?.price || 0;
        const totalPrice = amount * price;
        return <div>{formatterPrice(totalPrice)}</div>;
      },
    },
    {
      title: "",
      dataIndex: "delete",
      key: "delete",
      width: 50,
      align: "center",
      render: (text, record, index) => {
        return (
          <Button
            className="btn-delete"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onClickDeleteRow(index)}
          />
        );
      },
    },
  ];

  const onClickDeleteRow = (index) => {
    const currentData =
      pageManageDataProvider.FormManager.form.getFieldValue("productList");
    const newData = currentData.filter((item, idx) => idx !== index);
    pageManageDataProvider.FormManager.form.setFieldsValue({
      productList: newData,
    });
  };

  const onClickAddRow = () => {
    const currentData =
      pageManageDataProvider.FormManager.form.getFieldValue("productList") ||
      [];
    const newData = [
      ...currentData,
      {
        billId: currentData.length + 1,
        productName: "",
        warehouse: 0,
        amount: 0,
        price: 0,
        totalPrice: 0,
      },
    ];
    pageManageDataProvider.FormManager.form.setFieldsValue({
      productList: newData,
    });
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
    let response;
    if (isEditMode) {
      response = await billService.updateBillFreeText(
        id,
        pageManageDataProvider.FormManager.buildFormData()
      );
    } else {
      response = await billService.createBillFreeText(
        pageManageDataProvider.FormManager.buildFormData()
      );
    }
    if (response.error) {
      NotiAfterConfirm(
        "error",
        "บันทึกข้อมูลไม่สำเร็จ",
        "บันทึกข้อมูลไม่สำเร็จ"
      );
      return;
    }
    NotiAfterConfirm("success", "บันทึกข้อมูลสำเร็จ", "บันทึกข้อมูลสำเร็จ");
    navigate("/bill");
  };

  const onClickCancelModalPrintPDF = () => {
    pageManageDataProvider.ModalPrintPDFManager.setIsOpen(false);
  };

  const onClickOpenModalPrintPDF = async () => {
    const isValid = pageManageDataProvider.FormManager.form.validateFields();
    if (!isValid) return;

    const submitData = pageManageDataProvider.FormManager.form.getFieldsValue();
    pageManageDataProvider.ModalPrintPDFManager.setDataModal(
      pageManageDataProvider.FormManager.buildFormData()
    );
    pageManageDataProvider.ModalPrintPDFManager.setIsOpen(true);
  };

  useEffect(() => {
    (async () => {
      await Promise.all([
        pageManageDataProvider.UserBillManager.loadUsersBillAsync(),
        pageManageDataProvider.PaymentTypeManager.loadPaymentTypeAsync(),
        pageManageDataProvider.CompanyManager.loadCompanyAsync(),
        pageManageDataProvider.ProductManager.loadProductAsync(),
      ]);
      pageManageDataProvider.FormManager.setDefaultBookNo();
      pageManageDataProvider.FormManager.setDefaultSelectedUserBillId();
      if (isEditMode) {
        const _detail =
          await pageManageDataProvider.BillManager.getBillByIdAsync(id);
        pageManageDataProvider.FormManager.setFormValues(_detail);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-4">
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
            <h3>
              {isEditMode ? "แก้ไขใบเรียกเก็บเงิน" : "สร้างใบเรียกเก็บเงิน"}
            </h3>
          </>
        }
        rightSlot={
          <>
            <Button
              type="primary"
              onClick={() => {
                pageManageDataProvider.FormManager.form.submit();
              }}
              icon={<PlusOutlined />}
            >
              บันทึกเอกสาร
            </Button>
            <Button
              className="btn-reset"
              type="print"
              onClick={() => {
                onClickOpenModalPrintPDF();
              }}
              icon={<PrinterOutlined />}
            >
              พิมพ์เอกสาร
            </Button>
          </>
        }
      />
      <Form
        name="basic"
        form={pageManageDataProvider.FormManager.form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          issueDate: dayjs().format("DD/MM/BBBB"),
          issueTime: dayjs().format("HH:mm"),
          receiveDate: dayjs().format("DD/MM/BBBB"),
          receiveTime: dayjs().format("HH:mm"),
          discount: 0,
          deposit: 0,
          productList: [
            {
              billId: 1,
              productName: "",
              warehouse: 0,
              amount: 0,
              price: 0,
              totalPrice: 0,
            },
          ],
        }}
        onFinish={(values) => {
          onConfirm(values);
        }}
        onFinishFailed={(errorInfo) => {
          console.log("Failed:", errorInfo);
        }}
        layout="vertical"
      >
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Row
          gutter={24}
          style={{ padding: "0px 25px", justifyContent: "center" }}
        >
          <Col span={16}>
            <CardWrapper>
              <Card headingIcon={<FileTextOutlined />} headingText="ข้อมูลบิล">
                <Row gutter={12}>
                  <Col span={6}>
                    <Form.Item
                      label="เล่มที่"
                      name="bookNo"
                      wrapperCol={{ span: 24 }}
                    >
                      <Input
                        placeholder="กรอกเล่มที่"
                        style={{ width: "100%" }}
                        disabled={true}
                      />
                    </Form.Item>
                  </Col>
                  {isEditMode && (
                    <Col span={6}>
                      <Form.Item
                        style={{ width: "100%" }}
                        label="เลขที่บิล"
                        name="billNo"
                        wrapperCol={{ span: 24 }}
                      >
                        <Input
                          placeholder="กรอกเลขที่บิล"
                          style={{ width: "100%" }}
                          disabled={true}
                        />
                      </Form.Item>
                    </Col>
                  )}

                  <Col span={6}>
                    <Form.Item
                      label="วันที่ออกบิล"
                      name="issueDate"
                      wrapperCol={{ span: 24 }}
                      labelCol={{ span: 24 }}
                      className="flex-grow"
                      required
                      rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
                    >
                      <PickerWithType
                        type="date"
                        onChange={(value, dateString) => {
                          pageManageDataProvider.FormManager.form.setFieldsValue(
                            {
                              issueDate: value,
                            }
                          );
                        }}
                        value={
                          Form.useWatch(
                            "issueDate",
                            pageManageDataProvider.FormManager.form
                          ) || undefined
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="เวลา"
                      name="issueTime"
                      wrapperCol={{ span: 24 }}
                      className="flex-grow"
                    >
                      <Input
                        placeholder="กรอกเวลา"
                        onChange={(e) => {
                          pageManageDataProvider.FormManager.form.setFieldsValue(
                            {
                              issueTime: e.target.value,
                            }
                          );
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12} />
                </Row>
              </Card>

              <Row gutter={24}>
                <Col span={14}>
                  <Card
                    headingText="ข้อมูลทั่วไป"
                    headingIcon={<UserOutlined />}
                  >
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          label="ชื่อผู้เสียชีวิต"
                          name="deceased"
                          wrapperCol={{ span: 24 }}
                          rules={[
                            { required: true, message: "กรุณากรอกข้อมูล" },
                          ]}
                        >
                          <Input placeholder="กรอกผู้เสียชีวิต" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label="ชื่อผู้ติดต่อได้"
                          name="contact"
                          wrapperCol={{ span: 24 }}
                          rules={[
                            { required: true, message: "กรุณากรอกข้อมูล" },
                          ]}
                        >
                          <Input
                            placeholder="กรอกชื่อผู้ติดต่อได้"
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label="เบอร์โทรศัพท์"
                          name="phone"
                          rules={[
                            { required: true, message: "กรุณากรอกข้อมูล" },
                          ]}
                          wrapperCol={{ span: 24 }}
                        >
                          <PhoneInput
                            style={{ width: "100%" }}
                            placeholder="กรอกเบอร์โทรศัพท์"
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label="ที่อยู่"
                          name="address"
                          rules={[
                            { required: true, message: "กรุณากรอกข้อมูล" },
                            {
                              max: 100,
                              message: "ขนาดความยาวไม่เกิน 100 ตัวอักษร",
                            },
                          ]}
                          wrapperCol={{ span: 24 }}
                        >
                          <Input.TextArea
                            placeholder="กรอกที่อยู่"
                            style={{ width: "100%" }}
                            rows={4}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                <Col span={10}>
                  <Card
                    headingIcon={<EnvironmentOutlined />}
                    headingText="ข้อมูลที่อยู่"
                  >
                    <Row gutter={24}>
                      <Col span={12}>
                        <Form.Item
                          label="วันที่รับ"
                          name="receiveDate"
                          className="flex-grow"
                          wrapperCol={{ span: 24 }}
                        >
                          <PickerWithType
                            type="date"
                            value={
                              Form.useWatch(
                                "receiveDate",
                                pageManageDataProvider.FormManager.form
                              ) || undefined
                            }
                            onChange={(value, dateString) => {
                              pageManageDataProvider.FormManager.form.setFieldsValue(
                                {
                                  receiveDate: value,
                                }
                              );
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="เวลา"
                          name="receiveTime"
                          className="flex-grow"
                          wrapperCol={{ span: 24 }}
                        >
                          <Input
                            placeholder="กรอกเวลา"
                            onChange={(e) => {
                              pageManageDataProvider.FormManager.form.setFieldsValue(
                                {
                                  receiveTime: e.target.value,
                                }
                              );
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="รับจาก"
                          name="receiveFrom"
                          rules={[
                            { required: true, message: "กรุณากรอกข้อมูล" },
                            {
                              //ขนาดความยาวไม่เกิน 100 ตัวอักษร
                              max: 100,
                              message: "ขนาดความยาวไม่เกิน 100 ตัวอักษร",
                            },
                          ]}
                          wrapperCol={{ span: 24 }}
                        >
                          <Input.TextArea
                            placeholder="กรอกรับจาก"
                            style={{ width: "100%" }}
                            rows={4}
                          />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          label="ส่ง"
                          name="send"
                          rules={[
                            { required: true, message: "กรุณากรอกข้อมูล" },
                            {
                              max: 100,
                              message: "ขนาดความยาวไม่เกิน 100 ตัวอักษร",
                            },
                          ]}
                          wrapperCol={{ span: 24 }}
                        >
                          <Input.TextArea
                            placeholder="กรอกส่ง"
                            style={{ width: "100%" }}
                            rows={4}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>

              <Card
                headingIcon={<ShoppingCartOutlined />}
                headingText="รายการสินค้า"
              >
                <Form.List name="productList">
                  {(fields) => (
                    <>
                      <Table
                        bordered
                        columns={columns}
                        dataSource={fields.map((field, index) => ({
                          key: index,
                          ...field,
                        }))}
                        pagination={false}
                      />
                      <Button
                        style={{ marginTop: "25px" }}
                        type="primary"
                        onClick={() => {
                          onClickAddRow();
                        }}
                        icon={<PlusOutlined />}
                      >
                        เพิ่มแถวรายการ
                      </Button>
                    </>
                  )}
                </Form.List>

                <div className="mt-3">
                  <hr />
                  <Row gutter={24} className="mt-3">
                    <Col span={14}>
                      <div className="grid grid-cols-3 gap-4 mb-2">
                        <div className=" col-span-1 ">
                          <span className="">หมายเหตุ : </span>
                          <Form.Item
                            label=""
                            name="remark"
                            wrapperCol={{ span: 24 }}
                            className="flex-grow"
                          >
                            <TextArea
                              className="w-full"
                              placeholder="กรอกหมายเหตุ"
                              style={{ width: "100%" }}
                              showCount
                              maxLength={1000}
                              rows={4}
                            />
                          </Form.Item>
                        </div>
                        <div className=" col-span-1 ">
                          <span className="">โน๊ตภายใน : </span>
                          <Form.Item
                            label=""
                            name="note"
                            wrapperCol={{ span: 24 }}
                            className="flex-grow"
                          >
                            <TextArea
                              className="w-full"
                              placeholder="กรอกโน๊ตภายใน"
                              style={{ width: "100%" }}
                              showCount
                              maxLength={1000}
                              rows={4}
                            />
                          </Form.Item>
                        </div>
                        <div className=" col-span-1 "></div>
                      </div>
                    </Col>
                    <Col span={10}>
                      <div
                        className="text-right"
                        style={{ fontWeight: "bold", paddingRight: "10px" }}
                      >
                        <Row gutter={24}>
                          <Col span={12}>รวมเป็นเงิน :</Col>
                          <Col span={12}>
                            {formatterPrice(
                              pageManageDataProvider.FormManager.sum
                            )}
                          </Col>
                        </Row>

                        <Row gutter={24} style={{ paddingTop: "10px" }}>
                          <Col span={12}>ส่วนลด :</Col>
                          <Col span={12}>
                            <Form.Item noStyle name="discount">
                              <InputNumber
                                disabled={
                                  Form.useWatch(
                                    "donate",
                                    pageManageDataProvider.FormManager.form
                                  ) === true
                                }
                                className="w-full"
                                max={pageManageDataProvider.FormManager.sum}
                                min={0}
                                onChange={() => {
                                  pageManageDataProvider.FormManager.form.setFieldsValue(
                                    {
                                      deposit: 0,
                                      payExtra: 0,
                                    }
                                  );
                                }}
                                controls={false}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Row gutter={24} style={{ paddingTop: "10px" }}>
                          <Col span={12}>ราคาหลังหักส่วนลด :</Col>
                          <Col span={12}>
                            {formatterPrice(
                              pageManageDataProvider.FormManager
                                .priceAfterDiscount
                            )}
                          </Col>
                        </Row>

                        <Row gutter={24} style={{ paddingTop: "10px" }}>
                          <Col span={12}>มัดจำ :</Col>
                          <Col span={12}>
                            <Form.Item noStyle name="deposit">
                              <InputNumber
                                disabled={
                                  Form.useWatch(
                                    "donate",
                                    pageManageDataProvider.FormManager.form
                                  ) === true
                                }
                                controls={false}
                                min={0}
                                max={
                                  pageManageDataProvider.FormManager
                                    .priceAfterDiscount
                                }
                                className="w-full"
                                onChange={() => {
                                  if (!isEditMode) return;
                                  pageManageDataProvider.FormManager.form.setFieldsValue(
                                    {
                                      payExtra: 0,
                                    }
                                  );
                                }}
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        {isEditMode && (
                          <Row gutter={24} style={{ paddingTop: "10px" }}>
                            <Col span={12}>ชำระแล้ว :</Col>
                            <Col span={12}>
                              <Form.Item noStyle name="payExtra">
                                <InputNumber
                                  disabled={
                                    Form.useWatch(
                                      "donate",
                                      pageManageDataProvider.FormManager.form
                                    ) === true
                                  }
                                  controls={false}
                                  min={0}
                                  className="w-full"
                                />
                              </Form.Item>
                            </Col>
                          </Row>
                        )}

                        <Row gutter={24} style={{ paddingTop: "10px" }}>
                          <Col span={12}>คงเหลือ :</Col>
                          <Col span={12}>
                            {formatterPrice(
                              pageManageDataProvider.FormManager.remaining
                            )}
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </CardWrapper>
          </Col>

          <Col span={6}>
            <CardWrapper>
              {isEditMode && (
                <Card>
                  <Row gutter={24}>
                    <Col span={24}>
                      <Form.Item
                        style={{ width: "100%" }}
                        label="สถานะการชำระ"
                        name="status"
                        initialValue={status}
                        rules={[
                          { required: true, message: "กรุณาเลือกข้อมูล" },
                        ]}
                        wrapperCol={{ span: 24 }}
                      >
                        <Select
                          style={{ width: "100%" }}
                          placeholder="เลือกสถานะการชำระ"
                          onChange={(value, key) => {}}
                        >
                          <Select.Option key={1} value={"1"}>
                            ชำระครบแล้ว
                          </Select.Option>
                          <Select.Option key={2} value={"2"}>
                            ค้างชำระ
                          </Select.Option>
                          <Select.Option key={2} value={"3"}>
                            ยกเลิก
                          </Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label="ผู้ออกบิล"
                        name="billBy"
                        rules={[{ required: true, message: "กรุณากรอกข้อมูล" }]}
                        wrapperCol={{ span: 24 }}
                      >
                        <Select
                          style={{ width: "100%" }}
                          placeholder="เลือกผู้ออกบิล"
                          onChange={(value, key) => {
                            pageManageDataProvider.FormManager.form.setFieldsValue(
                              {
                                billBy: value,
                              }
                            );
                          }}
                        >
                          {pageManageDataProvider.UserBillManager.userBillOptions.map(
                            (item, idx) => {
                              return (
                                <Select.Option
                                  key={item.idx}
                                  value={item.value}
                                >
                                  {item.label}
                                </Select.Option>
                              );
                            }
                          )}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label="ประเภท"
                        name="type"
                        rules={[
                          { required: true, message: "กรุณาเลือกข้อมูล" },
                        ]}
                        wrapperCol={{ span: 24 }}
                      >
                        <Select
                          style={{ width: "100%" }}
                          placeholder="เลือกประเภท"
                          onChange={(value) => {
                            pageManageDataProvider.FormManager.form.setFieldsValue(
                              {
                                type: value,
                              }
                            );
                          }}
                        >
                          {pageManageDataProvider.CompanyManager.companyOptions.map(
                            (item) => {
                              return (
                                <Select.Option key={item.id} value={item.label}>
                                  {item.label}
                                </Select.Option>
                              );
                            }
                          )}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        label="การจ่ายเงิน"
                        name="paymentTypeId"
                        wrapperCol={{ span: 24 }}
                      >
                        <Select
                          style={{ width: "100%" }}
                          placeholder="เลือกการจ่ายเงิน"
                          onChange={(value, key) => {
                            pageManageDataProvider.FormManager.form.setFieldsValue(
                              {
                                paymentTypeId: value,
                              }
                            );
                          }}
                        >
                          {pageManageDataProvider.PaymentTypeManager.paymentTypeOptions.map(
                            (item) => {
                              return (
                                <Select.Option
                                  key={item.value}
                                  value={item.value}
                                >
                                  {item.label}
                                </Select.Option>
                              );
                            }
                          )}
                        </Select>
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item label="บริจาค" name="donate">
                        <Checkbox
                          onChange={(checked) => {
                            pageManageDataProvider.FormManager.form.setFieldsValue(
                              {
                                donate: checked.target.checked,
                              }
                            );
                            if (checked.target.checked)
                              pageManageDataProvider.FormManager.form.setFieldsValue(
                                {
                                  discount: 0,
                                  deposit: 0,
                                }
                              );
                          }}
                          checked={
                            Form.useWatch(
                              "donate",
                              pageManageDataProvider.FormManager.form
                            ) === true
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              )}
            </CardWrapper>
          </Col>
        </Row>
      </Form>
      {pageManageDataProvider.ModalPrintPDFManager.isOpen && (
        <PrintPDF
          componentRef={
            pageManageDataProvider.ModalPrintPDFManager.componentRef
          }
          title="พิมพ์รายงาน"
          open={pageManageDataProvider.ModalPrintPDFManager.isOpen}
          company={pageManageDataProvider.CompanyManager.companyOptions}
          data={pageManageDataProvider.ModalPrintPDFManager.dataModal}
          isStatus={isEditMode ? "edit" : "add"}
          onCancel={() => {
            onClickCancelModalPrintPDF();
          }}
        />
      )}
    </div>
  );
};

export default PageManage;
