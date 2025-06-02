import { useEffect, useRef } from "react";
import { Button, Col, Form, Row, Card } from "antd";
import {
  PlusOutlined,
  FilePdfOutlined,
  EditOutlined,
  DeleteOutlined,
  BorderLeftOutlined,
} from "@ant-design/icons";
import { formatterPrice } from "../../utils/formatterPrice";
import SearchBarComponent from "../../components/SearchBar";
import TableComponent from "../../components/Table";
import StatusComponent from "../../components/Status";
import { useNavigate } from "react-router-dom";
import PrintListPDF from "../../Modal/printList";
import ShowConfirm from "../../Notification/ModalBeforeConfirm";
import dayjs from "dayjs";
import { usePageIndex } from "./dataprovider/PageIndex";
import Topbar from "../../components/Topbar";

const PageIndex = () => {
  const navigate = useNavigate();

  const pageIndexDataProvider = usePageIndex();

  const componentRef = useRef(null);
  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "billid",
      key: "billid",
      align: "center",
      render: (text, record, index) => (
        <span className="py-[4rem]">{index + 1}</span>
      ),
    },
    {
      title: "วันที่ทำรายการ",
      dataIndex: "billdate",
      key: "billdate",
      render: (text, record) =>
        new Date(record.billdate).toLocaleDateString("th-TH", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
    },
    {
      title: "เล่มที่บิล",
      dataIndex: "bookno",
      key: "bookno",
    },
    {
      title: "เลขที่บิล",
      dataIndex: "billno",
      key: "billno",
      // align: "center",
      render: (text, record) => (
        <span className="text-[#D81D18] hover:text-[#FFE000]">
          <a
            className=" text-[#D81D18] border-b-2 border-[#D81D18] hover:border-[#FFE000] hover:text-[#FFE000]"
            onClick={() => {
              navigate(`/bill/view/${record.billno}`);
            }}
          >
            {record.billno}
          </a>
        </span>
      ),
    },
    {
      title: "รับจาก",
      dataIndex: "receivefrom",
      key: "receivefrom",
      render: (text) => <>{text || "-"}</>,
    },
    {
      title: "ส่ง",
      dataIndex: "send",
      key: "send",
      className: "max-w-[300px]",
    },
    {
      title: "รับ",
      dataIndex: "deposit",
      key: "deposit",
      align: "right",
      render: (text, record) =>
        record.deposit === 0
          ? "0"
          : formatterPrice(parseInt(record.deposit) + record.payextra),
    },
    {
      title: "ค้าง",
      dataIndex: "remaining",
      key: "remaining",
      align: "right",
      render: (text, record) =>
        record.remaining === 0 ? "0" : formatterPrice(record.remaining),
    },
    {
      title: "ส่วนลด",
      dataIndex: "remaining",
      key: "remaining",
      align: "right",
      render: (text, record) =>
        record.discount === 0 ? "0" : formatterPrice(record.discount),
    },
    {
      title: "รวม",
      dataIndex: "total",
      key: "total",
      align: "right",
      render: (text, record) => formatterPrice(record.total),
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      render: (text, record) => <StatusComponent status={record.status} />,
    },
    {
      title: "การจ่ายเงิน",
      dataIndex: "paymentname",
      key: "paymentname",
    },
    {
      title: "ดำเนินการ",
      key: "action",
      align: "center",
      render: (text, record) => (
        <span>
          <Button
            style={{ marginRight: "10px" }}
            className="btn-print"
            type="link"
            onClick={() => {
              pageIndexDataProvider.ModalPrintListPDFManager.setIsOpen(true);
              pageIndexDataProvider.ModalPrintListPDFManager.setBillId(
                record.billno
              );
            }}
            icon={<FilePdfOutlined />}
          />
          <Button
            style={{ marginRight: "10px" }}
            className="btn-edit"
            type="link"
            onClick={() => {
              navigate(`/bill/manage/${record.billno}`);
            }}
            icon={<EditOutlined />}
          />
          <Button
            className="btn-delete"
            type="link"
            onClick={() => {
              onClickDelete(record.billid);
            }}
            icon={<DeleteOutlined />}
          />
        </span>
      ),
    },
  ];

  const [form] = Form.useForm();

  const onClickCancelModalPrintListPDF = () => {
    pageIndexDataProvider.ModalPrintListPDFManager.setIsOpen(false);
  };

  const onClickChangeTab = async (pagination) => {
    const _res = await pageIndexDataProvider.TableManager.loadTableData(
      form.getFieldsValue()
    );
    pageIndexDataProvider.TableManager.setTableParams((prev) => ({
      ...prev,
      pagination: {
        ...pagination,
        total: _res?.data?.length,
      },
    }));
  };

  const onClickDelete = async (values) => {
    const cf = await ShowConfirm(
      "ยืนยันการลบข้อมูล",
      "คุณต้องการลบข้อมูลหรือไม่ ?"
    );
    if (!cf) return;

    await pageIndexDataProvider.deleteBillAsync(values);
    await pageIndexDataProvider.TableManager.loadTableData(
      form.getFieldsValue()
    );
  };

  const initialValues = {
    status: "0",
    type: "0",
    dateRange: [dayjs().subtract(3, "years"), dayjs()],
  };

  useEffect(() => {
    (async () => {
      form.setFieldsValue(initialValues);
      await Promise.all([
        pageIndexDataProvider.ModalPrintListPDFManager.loadCompanyAsync(),
        pageIndexDataProvider.TableManager.loadTableData(initialValues),
      ]);
    })();
  }, []);

  const summary = (() => {
    const data = pageIndexDataProvider.TableManager.tableData;

    const totalRecords = data.length;

    const sumDeposit = data.reduce(
      (sum, row) =>
        sum + parseFloat(row.deposit || 0) + parseFloat(row.payextra || 0),
      0
    );
    const sumDiscount = data.reduce(
      (sum, row) => sum + parseFloat(row.discount || 0),
      0
    );
    const sumTotal = data.reduce(
      (sum, row) => sum + parseFloat(row.total || 0),
      0
    );

    const status1 = data.filter((row) => row.status === "1");
    const status1Count = status1.length;
    const status1Total = status1.reduce(
      (sum, row) => sum + parseFloat(row.total || 0),
      0
    );

    const status2 = data.filter((row) => row.status === "2");
    const status2Count = status2.length;
    const status2Total = status2.reduce(
      (sum, row) => sum + parseFloat(row.total || 0),
      0
    );

    return {
      totalRecords: totalRecords,
      sumDeposit: formatterPrice(sumDeposit),
      sumDiscount: formatterPrice(sumDiscount),
      sumTotal: formatterPrice(sumTotal),
      status1Count: status1Count,
      status1Total: formatterPrice(status1Total),
      status2Count: status2Count,
      status2Total: formatterPrice(status2Total),
    };
  })();

  return (
    <>
      <Topbar
        leftSlot={
          <div className="title-page">
            <h3 className="text-[#444444]">จัดการใบเรียกเก็บเงิน</h3>
          </div>
        }
      />

      <div className="padding-content">
        <SearchBarComponent
          form={form}
          isStatus={true}
          status={pageIndexDataProvider.status}
          isType={true}
          type={pageIndexDataProvider.type}
          filter={true}
          onSearch={async (values) => {
            const _res = await pageIndexDataProvider.TableManager.loadTableData(
              values
            );
            pageIndexDataProvider.TableManager.setToTalTableParams(
              _res?.data?.length
            );
          }}
        />

        <div className="bg-white">
          <div className="container mx-auto">
            <div className="mb-5">
              <Row gutter={24} align="middle">
                {/* Card 1 */}
                <Col span={7} style={{ padding: 5, textAlign: "left" }}>
                  <Card
                    onClick={() => {
                      pageIndexDataProvider.status = 0;
                      pageIndexDataProvider.TableManager.loadTableData({
                        ...form.getFieldsValue(),
                        status: "0",
                      });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Row>
                      <Col
                        span={10}
                        style={{
                          borderRight: "1px solid #000",
                          paddingRight: 10
                        }}
                      >
                        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                          บิลทั้งหมด
                        </div>
                        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                          {summary.totalRecords}
                        </div>
                      </Col>
                      <Col span={14} style={{ paddingLeft: 10 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
							fontSize : "1rem"
                          }}
                        >
                          <span>ยอดรับ</span>
                          <span style={{ fontWeight: "bold" }}>
                            {summary.sumDeposit}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
							fontSize : "1rem"
                          }}
                        >
                          <span>ยอดส่วนลด</span>
                          <span style={{ fontWeight: "bold" }}>
                            {summary.sumDiscount}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
							fontSize : "1rem"
                          }}
                        >
                          <span>ยอดรับจริง</span>
                          <span style={{ fontWeight: "bold" }}>
                            {summary.sumTotal}
                          </span>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>

                {/* Card 2 */}
                <Col span={4} style={{ padding: 5, textAlign: "left" }}>
                  <Card
                    onClick={() => {
                      pageIndexDataProvider.status = 1;
                      pageIndexDataProvider.TableManager.loadTableData({
                        ...form.getFieldsValue(),
                        status: "1",
                      });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                      ชำระครบแล้ว
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
						fontSize : "1rem"
                      }}
                    >
                      <span>จำนวนบิล</span>
                      <span style={{ fontWeight: "bold" }}>
                        {summary.status1Count}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
						fontSize : "1rem"
                      }}
                    >
                      <span>จำนวนเงิน</span>
                      <span style={{ fontWeight: "bold" }}>
                        {summary.status1Total}
                      </span>
                    </div>
                  </Card>
                </Col>

                {/* Card 3 */}
                <Col span={4} style={{ padding: 5, textAlign: "left" }}>
                  <Card
                    onClick={() => {
                      pageIndexDataProvider.status = 2;
                      pageIndexDataProvider.TableManager.loadTableData({
                        ...form.getFieldsValue(),
                        status: "2",
                      });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                      ค้างชำระ
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
						fontSize : "1rem"
                      }}
                    >
                      <span>จำนวนบิล</span>
                      <span style={{ fontWeight: "bold" }}>
                        {summary.status2Count}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
						fontSize : "1rem"
                      }}
                    >
                      <span>จำนวนเงิน</span>
                      <span style={{ fontWeight: "bold" }}>
                        {summary.status2Total}
                      </span>
                    </div>
                  </Card>
                </Col>

                {/* Right Align Button */}
                <Col span={9}>
                  <Row justify="end">
                    <Col>
                      <Button
                        type="primary"
                        onClick={() => {
                          navigate("/bill/manage");
                        }}
                        icon={<PlusOutlined />}
                      >
                        เพิ่มข้อมูล
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <TableComponent
              form={form}
              dataSource={[pageIndexDataProvider.TableManager.tableData]}
              columns={[columns]}
              loading={false}
              pagination={
                pageIndexDataProvider.TableManager.tableParams.pagination
              }
              onChange={onClickChangeTab}
            />
          </div>
        </div>
      </div>
      <PrintListPDF
        componentRef={componentRef}
        title="พิมพ์รายงาน"
        open={pageIndexDataProvider.ModalPrintListPDFManager.isOpen}
        company={pageIndexDataProvider.ModalPrintListPDFManager.companyData}
        billId={pageIndexDataProvider.ModalPrintListPDFManager.billId}
        onChange={onClickChangeTab}
        onCancel={onClickCancelModalPrintListPDF}
      />
    </>
  );
};

export default PageIndex;
