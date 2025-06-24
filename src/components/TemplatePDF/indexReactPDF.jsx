import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import logo from "../../assets/logo_login.jpg"; // โลโก้บริษัท
import { formatterPrice } from "../../utils/formatterPrice";
import { bahttext } from "bahttext";
import CompanyServer from "../../services/companyService";
import { textMap } from "../../constant/status";
import dayjs from "dayjs";

Font.register({
  family: "THSarabunNew",
  fonts: [
    {
      src: "/fonts/THSarabunNew.ttf", // ฟอนต์ปกติ
      fontWeight: "normal",
    },
    {
      src: "/fonts/THSarabunNew-Bold.ttf", // ฟอนต์ตัวหนา
      fontWeight: "bold",
    },
  ],
});

const QuotationPDF = () => {
  //#region load data
  const url = new URL(window.location.href);
  const id = url.pathname.split("/").pop();
  const [headingText, setHeadingText] = useState("");
  const componentRef = React.useRef();
  const [listProduct, setListProduct] = useState([]);
  const [company, setCompany] = useState({});
  const [loadData, setData] = useState({});
  const [sum, setSum] = useState("");
  const [discount, setDiscount] = useState("");
  const [sumIncludeVat, setSumIncludeVat] = useState("");
  const [remaining, setRemaining] = useState("");
  const [deposit, setDeposit] = useState("");
  const [vat, setVat] = useState(0);
  const [payExtra, setPayExtra] = useState("");
  const [priceAfterDiscount, setPriceAfterDiscount] = useState(0);
  const getDataCompanyByID = () => {
    if (!localStorage.getItem("company_id")) {
      window.reload();
      return;
    }
    let id = JSON.parse(localStorage.getItem("company_id"));
    if (id) {
      CompanyServer.getCompanyById(id)
        .then((response) => {
          let data = response?.data[0];
          setCompany(data);
        })
        .catch((error) => {
          console.log("error : ", error);
        });
    }
  };
  useEffect(() => {
    if (id === "1") {
      setHeadingText("ใบเสนอราคา");
    }
    if (id === "2") {
      setHeadingText("ใบแจ้งหนี้");
    }
    if (id === "3") {
      setHeadingText("ใบเสร็จรับเงิน");
    }
    if (id === "4") {
      setHeadingText("ใบเสร็จรับเงิน/ใบกำกับภาษี");
    }
    if (id === "5") {
      setHeadingText("ใบเสร็จร้านดอกไม้");
    }
  }, [id]);
  useEffect(() => {
    if (localStorage.getItem("data")) {
      getDataCompanyByID();
      let StorageData = JSON.parse(localStorage.getItem("data"));
      const vat = StorageData?.total * 0.07;
      setVat(vat);
      const sumIncludeVat =
        id === "4" ? StorageData?.total * 1.07 : StorageData?.total;
      const remaining =
        id === "4"
          ? sumIncludeVat - StorageData?.deposit - StorageData?.discount
          : StorageData?.remaining;
      setData(StorageData);
      setSum(StorageData?.total.toString());
      setSumIncludeVat(sumIncludeVat);
      setDiscount(StorageData?.discount);
      setRemaining(
        id === "4"
          ? sumIncludeVat -
              StorageData?.deposit -
              StorageData?.discount -
              StorageData?.payextra <
            0
            ? 0
            : sumIncludeVat -
              StorageData?.deposit -
              StorageData?.discount -
              StorageData?.payextra
          : StorageData?.remaining
      );
      setDeposit(StorageData?.deposit);
      setPayExtra(StorageData?.payextra || "");
      setPriceAfterDiscount(
        sumIncludeVat - StorageData?.discount - StorageData?.deposit
      );
      const list = StorageData?.listProduct?.map((item, index) => {
        return {
          key: index,
          billId: item.invoice_id,
          stock_name: item.stock_name,
          amount_used: item.amount_used,
          price: item.price,
          total_price: item.total_price,
        };
      });
      setListProduct(list);
    }
  }, [localStorage.getItem("data")]);
  //#endregion

  // ข้อมูลตัวอย่าง
  const data = {
    billno: loadData?.billno,
    headingText: headingText,
    customer: {
      name: loadData?.deceased,
      contact: loadData?.contact,
      address: loadData?.address,
      phone: loadData?.phone,
      receive: loadData?.receive,
      send: loadData?.send,
      receiveFrom: loadData?.receive,
      billType: loadData?.billtype,
      taxId: loadData?.taxid,
      receivedate: (
        <>
          {loadData?.receivedate}{" "}
          {dayjs(loadData?.receivetime, "HH:mm").isValid()
            ? `${dayjs(loadData?.receivetime, "HH:mm").format("HH:mm")}`
            : ""}
        </>
      ),
    },
    bill: {
      bookno: loadData?.bookno,
      billno: loadData?.billno,
      billuser: loadData?.billuser,
      issuedate: loadData?.issuedate,
      status: textMap?.[loadData?.status],
      company_name: loadData?.company_name,
      paymentname: loadData?.paymentname,
    },
    products: listProduct.map((product, i) => ({
      id: i,
      name: product.stock_name,
      qty: product.amount_used,
      unitPrice: product.price,
      totalPrice: product.total_price,
    })),
    summary: {
      total: 4000,
      deposit: 2000,
      net: 2000,
    },
  };

  // สไตล์ PDF
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      paddingTop: 10,
      fontSize: 14,
      fontFamily: "THSarabunNew",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      //   borderBottom: "1px solid #000",
      paddingBottom: 5,
    },
    companyInfoContainer: {
      position: "relative",
      left: -15,
      lineHeight: 0.7,
    },
    customerInfoContainer: {},
    customerInfoTableHeaderRow: {
      flexDirection: "row",
      borderBottom: "1px solid #000",
    },
    customerInfoTableRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingTop: 5,
    },
    customerInfoTableCell: {
      width: "50%",
      flexWrap: "wrap",
      overflow: "hidden",
      textAlign: "left",
      paddingVertical: 2,
      lineHeight: 0.9,
    },
    customerInfoTableCell1: {
      width: "37%",
      flexWrap: "wrap",
      // overflow: "hidden",
      textAlign: "left",
      paddingVertical: 2,
      paddingRight: 2,
      lineHeight: 1,
    },
    customerInfoTableCell2: {
      width: "26%",
      flexWrap: "wrap",
      // overflow: "hidden",
      textAlign: "left",
      paddingVertical: 2,
      lineHeight: 1,
      paddingRight: 0,
    },
    logo: {
      width: 80,
      height: 80,
      //ขยับไปทางซ้ายด้วย relative
      position: "relative",
      left: -15,
    },
    section: {
      marginBottom: 10,
    },
    table: {
      display: "table",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableHeader: {
      backgroundColor: "#EEE",
    },
    tableCell: {
      flex: 1,
      padding: 5,
      borderTop: 1,
      borderColor: "#fafafa", // เพิ่มเส้นขอบให้กับแต่ละเซลล์
      borderStyle: "solid", // เพิ่มเส้นขอบให้กับแต่ละเซลล์
    },
    footer: {
      fontSize: 10,
    },
    summaryContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 5,
    },
  });

  const approvalData = [
    {
      title: "ผู้อนุมัติซื้อ / Buyer Approves",
      placeholder: ".............................................",
    },
    {
      title: "พนักงานบริการ / Service staff",
      placeholder: ".............................................",
    },
    {
      title: "ผู้รับเงิน / Recipient",
      placeholder: ".............................................",
    },
    {
      title: "อนุมัติโดย / Approved by",
      placeholder: ".............................................",
    },
  ];

  const Header = () => {
    return (
      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.companyInfoContainer}>
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              บริษัท สุริยา คอฟฟิน เซอร์วิส จำกัด (สำนักงานใหญ่)
            </Text>
            <Text style={{ paddingTop: 5 }}>
              {company.company_number} ถ.{company.road ?? "-"} ต.
              {company.sub_district_name} อ.
              {company.district_name} จ.{company.province_name}{" "}
              {company.zip_code}
            </Text>
            <Text style={{ fontWeight: "normal" }}>
              เลขประจำตัวผู้เสียภาษี: 0-1255-64016-65-2
              {company.mobile_no ? ` โทร ${company.mobile_no}` : ""}
            </Text>
            <Text style={{ fontWeight: "normal" }}>
              {company.email ? `${company.email} ` : ""}
              www.suriya6.com
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            textAlign: "right",
          }}
        >
          <Text style={{ fontWeight: "normal", lineHeight: 0.7 }}>
            เล่มที่: {data.bill.bookno}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", lineHeight: 1 }}>
            {data.billno}
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            {data.headingText}
          </Text>
        </View>
      </View>
    );
  };

  const CustomerInfo = () => (
    <View style={styles.customerInfoContainer}>
      <View style={[styles.customerInfoTableRow, { fontWeight: "bold" }]}>
        <View style={[styles.customerInfoTableCell1]}>
          <Text>
            ชื่อผู้เสียชีวิต:{" "}
            <Text style={{ fontWeight: "normal" }}>{data.customer.name}</Text>
          </Text>
          <Text>
            ชื่อผู้ติดต่อ:{" "}
            <Text style={{ fontWeight: "normal" }}>
              {data.customer.contact}
            </Text>
          </Text>
          <Text>
            ที่อยู่:{" "}
            <Text style={{ fontWeight: "normal" }}>
              {data.customer.address}
            </Text>
          </Text>
          <Text>
            เบอร์โทรศัพท์:{" "}
            <Text style={{ fontWeight: "normal" }}>{data.customer.phone}</Text>
          </Text>
          {data.customer.billType && (
            <Text>
              {data.customer.billType == 1
                ? "เลขบัตรประชาชน"
                : "เลขทะเบียนนิติบุคคล"}
              :{" "}
              <Text style={{ fontWeight: "normal" }}>
                {data.customer.taxId}
              </Text>
            </Text>
          )}
        </View>
        <View style={[styles.customerInfoTableCell1]}>
          <Text>
            ที่อยู่ไปรับ:{" "}
            <Text style={{ fontWeight: "normal" }}>{data.customer.name}</Text>
          </Text>
          <Text>
            วัน/เวลาที่รับ:{" "}
            <Text style={{ fontWeight: "normal" }}>
              {data.customer.receivedate}
            </Text>
          </Text>
          <Text>
            รับจาก:{" "}
            <Text style={{ fontWeight: "normal" }}>
              {data.customer.receiveFrom}
            </Text>
          </Text>
          <Text>
            สถานที่จัดส่ง:{" "}
            <Text style={{ fontWeight: "normal" }}>{data.customer.send}</Text>
          </Text>
        </View>
        <View style={[styles.customerInfoTableCell2]}>
          <Text>
            ออกบิลโดย:{" "}
            <Text style={{ fontWeight: "normal" }}>{data.bill.billuser}</Text>
          </Text>
          <Text>
            ประเภทบิล:{" "}
            <Text style={{ fontWeight: "normal" }}>
              {data.bill.company_name}
            </Text>
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              สถานะการจ่าย:{" "}
              <Text style={{ fontWeight: "normal" }}>{data.bill.status}</Text>
            </Text>
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>
              วิธีการชำระเงิน:{" "}
              <Text style={{ fontWeight: "normal" }}>
                {data.bill.paymentname}
              </Text>
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );

  const ProductTable = ({ products, startProductIndex }) => (
    <View style={[styles.table, { marginTop: 10 }]}>
      <View style={[styles.tableRow, styles.tableHeader]}>
        <Text
          style={[
            styles.tableCell,
            { flex: 0.2 },
            { fontWeight: "bold" },
            { textAlign: "center" },
            {
              borderTopLeftRadius: 3,
            },
          ]}
        >
          ลำดับ
        </Text>
        <Text
          style={[
            styles.tableCell,
            { flex: 5 },
            { marginLeft: 5 },
            { fontWeight: "bold" },
          ]}
        >
          รายการสินค้า
        </Text>
        <Text
          style={[
            styles.tableCell,
            { textAlign: "right" },
            { fontWeight: "bold" },
          ]}
        >
          จำนวน
        </Text>
        <Text
          style={[
            styles.tableCell,
            { textAlign: "right" },
            { fontWeight: "bold" },
          ]}
        >
          ราคา/หน่วย
        </Text>
        <Text
          style={[
            styles.tableCell,
            { textAlign: "right" },
            { fontWeight: "bold" },
            {
              borderTopRightRadius: 3,
            },
          ]}
        >
          ราคารวม
        </Text>
      </View>
      {products.map((product, index) => (
        <View key={product.id} style={[styles.tableRow]} wrap={true}>
          <Text
            style={[
              styles.tableCell,
              { flex: 0.2 },
              { fontWeight: "bold" },
              {
                borderBottomWidth: index === products.length - 1 ? 1 : 0,
              },
              { textAlign: "right" },
              {
                borderBottomLeftRadius: index === products.length - 1 ? 3 : 0,
              },
            ]}
          >
            {startProductIndex ? startProductIndex + 1 + index : index + 1}
          </Text>
          <Text
            style={[
              styles.tableCell,
              { flex: 5 },
              { marginLeft: 5 },
              { lineHeight: 0.8 },
              { paddingRight: 0 },
              {
                borderBottomWidth: index === products.length - 1 ? 1 : 0,
              },
            ]}
          >
            {product.name}
          </Text>
          <Text
            style={[
              styles.tableCell,
              { paddingLeft: 0 },
              { textAlign: "right" },
              {
                borderBottomWidth: index === products.length - 1 ? 1 : 0,
              },
            ]}
          >
            {product.qty}
          </Text>
          <Text
            style={[
              styles.tableCell,
              { textAlign: "right" },
              {
                borderBottomWidth: index === products.length - 1 ? 1 : 0,
              },
            ]}
          >
            {formatterPrice(product.unitPrice)}
          </Text>
          <Text
            style={[
              styles.tableCell,
              { textAlign: "right" },
              {
                borderBottomWidth: index === products.length - 1 ? 1 : 0,
              },
              {
                borderBottomRightRadius: index === products.length - 1 ? 3 : 0,
              },
            ]}
          >
            {formatterPrice(product.totalPrice)}
          </Text>
        </View>
      ))}
    </View>
  );

  const Footer = () => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: "auto",
        }}
      >
        <View style={styles.summaryContainer}>
          <View style={{ flexDirection: "column", width: "50%" }}>
            <Text style={{ fontWeight: "bold" }}>
              หมายเหตุ:{" "}
              <Text style={{ fontWeight: "normal" }}>
                {loadData?.remark || "-"}
              </Text>
            </Text>
          </View>
          <View style={{ flexDirection: "column", width: "50%" }}>
            {sum !== remaining && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 70,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>ราคารวม:</Text>
                <Text style={{ fontWeight: "bold" }}>
                  {formatterPrice(sum)}
                </Text>
              </View>
            )}

            {id === "4" && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 70,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    ภาษีมูลค่าเพิ่ม (7%):
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {formatterPrice(vat)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 70,
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    ราคารวมภาษีมูลค่าเพิ่ม:
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {formatterPrice(+vat + +sum)}
                  </Text>
                </View>
              </>
            )}

            {discount &&
              discount > 0 &&
              id !== "3" &&
              id !== "4" &&
              id !== "5" && (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 70,
                    }}
                  >
                    <Text style={{ fontWeight: "bold" }}>ส่วนลด:</Text>
                    <Text style={{ fontWeight: "bold" }}>
                      {formatterPrice(discount)}
                    </Text>
                  </View>
                </>
              )}

            {deposit &&
              deposit > 0 &&
              id !== "3" &&
              id !== "4" &&
              id !== "5" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>มัดจำ:</Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {formatterPrice(deposit)}
                  </Text>
                </View>
              )}

            {priceAfterDiscount !== sum &&
              priceAfterDiscount.toString() !== remaining &&
              priceAfterDiscount.toString() !== sum &&
              id !== "1" &&
              id !== "3" &&
              id !== "4" &&
              id !== "5" && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    ราคาหลังหักส่วนลดและมัดจำ:
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {formatterPrice(priceAfterDiscount)}
                  </Text>
                </View>
              )}

            {id === "2" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>ชำระแล้ว:</Text>
                <Text style={{ fontWeight: "bold" }}>
                  {formatterPrice(payExtra)}
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {id === "2" || id === "3" || id === "4" || id === "5"
                  ? "ยอดที่ต้องชำระ"
                  : "ราคารวมสุทธิ"}
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                {formatterPrice(
                  id === "3" || id === "4" || id === "5"
                    ? 0
                    : id === "1"
                    ? priceAfterDiscount
                    : remaining
                )}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#eee",
            padding: 5,
          }}
        >
          <View style={{ width: "50%" }}></View>
          <View
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                width: "20%",
                fontWeight: "bold",
                flexDirection: "column",
                textAlign: "left",
                flex: 1,
                justifyContent: "center",
              }}
            >
              {/* {id === "1" && "รวมเป็นเงินทั้งสิ้น"}
              {id === "2" && "ยอดที่ต้องชำระ"}
              {id === "3" && "รวมเป็นเงินทั้งสิ้น"}
              {id === "4" && "รวมเป็นเงินทั้งสิ้น"}
              {id === "5" && "รวมเป็นเงินทั้งสิ้น"} */}
              รวมเป็นเงินทั้งสิ้น
            </Text>
            <View
              style={{
                width: "80%",
                flexDirection: "column",
                textAlign: "right",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {id === "1" && formatterPrice(priceAfterDiscount)}
                {id === "2" && formatterPrice(remaining)}
                {id === "3" && formatterPrice(sum)}
                {id === "4" && formatterPrice(+vat + +sum)}
                {id === "5" && formatterPrice(sum)}
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                {id === "1" && bahttext(priceAfterDiscount)}
                {id === "2" && bahttext(remaining)}
                {id === "3" && bahttext(sum)}
                {id === "4" && bahttext(+vat + +sum)}
                {id === "5" && bahttext(sum)}
              </Text>
            </View>
          </View>
        </View>
        {/* <View style={{ borderBottomWidth: 1, borderColor: "#000" }} /> */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            // borderWidth: 1,
            // borderColor: "#000",
            // backgroundColor : "#fafafa",
            // borderStyle: "solid",
            // borderRadius: 5,
          }}
        >
          {approvalData.map((item, index) => (
            <View
              wrap={false}
              key={index}
              style={[
                { flex: 1 },
                { fontSize: 13 },
                // { borderBottom : 0},
                {
                  // borderRightWidth: index === approvalData.length - 1 ? 0 : 1,
                  // borderRightColor : "#999",
                  // borderRightStyle : "dotted"
                },
              ]}
            >
              <Text
                style={{
                  paddingTop: 15,
                  textAlign: "center",
                }}
              >
                ...................................................
              </Text>
              <Text
                style={[
                  {
                    // borderBottomWidth: 1,
                    paddingTop: 3,
                    fontWeight: 600,
                    textAlign: "center",
                  },
                ]}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  paddingTop: 3,
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                วันที่...........................................
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const SubFooter = () => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#eee",
          padding: 5,
          marginTop: "auto",
        }}
      >
        {/* ซ้าย: หมายเหตุ */}
        <View style={{ width: "50%" }}>
          <Text style={{ fontWeight: "bold" }}>
            หมายเหตุ:{" "}
            <Text style={{ fontWeight: "normal" }}>
              {loadData?.remark || "-"}
            </Text>
          </Text>
        </View>

        {/* ขวา: รายการราคา */}
        <View
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {/* ราคารวม */}
          {sum !== remaining && (
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "50%", justifyContent: "center" }}>
                <Text style={{ fontWeight: "bold", textAlign: "left" }}>
                  ราคารวม:
                </Text>
              </View>
              <View style={{ width: "50%", justifyContent: "flex-end" }}>
                <Text style={{ fontWeight: "bold", textAlign: "right" }}>
                  {formatterPrice(sum)}
                </Text>
              </View>
            </View>
          )}

          {/* ส่วนลด */}
          {discount && discount > 0 && !["3", "4", "5"].includes(id) && (
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "50%" }}>
                <Text style={{ fontWeight: "bold", textAlign: "left" }}>
                  ส่วนลด:
                </Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text style={{ fontWeight: "bold", textAlign: "right" }}>
                  {formatterPrice(discount)}
                </Text>
              </View>
            </View>
          )}

          {/* มัดจำ */}
          {deposit && deposit > 0 && !["3", "4", "5"].includes(id) && (
            <View style={{ flexDirection: "row" }}>
              <View style={{ width: "50%" }}>
                <Text style={{ fontWeight: "bold", textAlign: "left" }}>
                  มัดจำ:
                </Text>
              </View>
              <View style={{ width: "50%" }}>
                <Text style={{ fontWeight: "bold", textAlign: "right" }}>
                  {formatterPrice(deposit)}
                </Text>
              </View>
            </View>
          )}

          {/* ยอดที่ต้องชำระ / ราคารวมสุทธิ */}
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "50%" }}>
              <Text style={{ fontWeight: "bold", textAlign: "left" }}>
                {["2", "3", "4", "5"].includes(id)
                  ? "ยอดที่ต้องชำระ"
                  : "ราคารวมสุทธิ"}
              </Text>
            </View>
            <View style={{ width: "50%" }}>
              <Text style={{ fontWeight: "bold", textAlign: "right" }}>
                {formatterPrice(
                  ["3", "4", "5"].includes(id)
                    ? 0
                    : id === "1"
                    ? priceAfterDiscount
                    : remaining
                )}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const chunkedProducts = [];
  for (let i = 0; i < data.products.length; i += 10) {
    chunkedProducts.push(data.products.slice(i, i + 10));
  }

  const SuriyaPDF = () => (
    <Document>
      <>
        {chunkedProducts.map((products, pageIndex) => (
          <Page key={pageIndex} size="A4" style={styles.page}>
            <>
              <Header />
              <View style={[styles.customerInfoTableHeaderRow]}>
                <Text
                  style={[
                    styles.customerInfoTableCell,
                    {
                      fontWeight: "bold",
                    },
                  ]}
                >
                  ข้อมูลลูกค้า
                </Text>
                <Text
                  style={[
                    styles.customerInfoTableCell,
                    {
                      textAlign: "right",
                    },
                  ]}
                >
                  {data.bill.issuedate} Page {pageIndex + 1}/
                  {chunkedProducts.length}
                </Text>
              </View>

              <CustomerInfo />

              <ProductTable
                products={products}
                startProductIndex={pageIndex === 0 ? undefined : pageIndex * 10}
              />
              {pageIndex != chunkedProducts.length - 1 && <SubFooter />}
              {pageIndex == chunkedProducts.length - 1 && <Footer />}
            </>
          </Page>
        ))}
      </>
    </Document>
  );

  return (
    <>
      <div style={{ float: "right", marginTop: -20, paddingBottom : 10 }}>
        <PDFDownloadLink
          document={<SuriyaPDF />}
          fileName={`${data.bill.billno}.pdf`}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1890ff",
            color: "white",
            borderRadius: 4,
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          {({ loading }) => (loading ? "กำลังสร้าง PDF..." : "ดาวน์โหลด PDF")}
        </PDFDownloadLink>
      </div>
      <PDFViewer width="100%" height="1200px">
        <SuriyaPDF />
      </PDFViewer>
    </>
  );
};

export default QuotationPDF;
