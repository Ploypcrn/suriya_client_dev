// สร้าง Template ในการสร้าง PDF ของ Quotation โดยใช้ react-pdf

import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactToPrint from "react-to-print";
import { Button, Table } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { bahttext } from "bahttext";
import { formatterPrice } from "../../utils/formatterPrice";
import CompanyServer from "../../services/companyService";
// import { Checkbox } from 'antd';
import logo from "../../assets/logo_login.jpg";
import PropTypes from "prop-types";
import { textMap } from "../../constant/status";
import dayjs from "dayjs";

// Create Document Component
const QuotationPDF = React.forwardRef(() => {
	const url = new URL(window.location.href);
	const id = url.pathname.split("/").pop();
	const [headingText, setHeadingText] = useState("");
	useEffect(() => {
		console.log(id);
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
	const componentRef = React.useRef();
	const [listProduct, setListProduct] = useState([]);
	const [company, setCompany] = useState({});
	const [data, setData] = useState({});
	const [sum, setSum] = useState("");
	const [discount, setDiscount] = useState("");
	const [sumIncludeVat, setSumIncludeVat] = useState("");
	const [remaining, setRemaining] = useState("");
	const [deposit, setDeposit] = useState("");
	const [vat, setVat] = useState(0);
	const [payExtra, setPayExtra] = useState("");
	const [priceAfterDiscount, setPriceAfterDiscount] = useState(0);

	const columns = [
		{
			title: <span className="">ลำดับ</span>,
			dataIndex: "billId",
			key: "billId",
			width: 50,
			align: "center",
			render: (text, record, index) => {
				return (
					<span className="">
						{index + 1 + (record.currentPage - 1) * ITEMS_PER_PAGE}
					</span>
				);
			},
		},
		{
			title: <span className="">รายการสินค้า</span>,
			dataIndex: "stock_name",
			key: "stock_name",
			width: 350,
			render: (text) => {
				return (
					<>
						<div className="flex justify-start">
							<span> {text} </span>
						</div>
					</>
				);
			},
		},
		{
			title: <span className="">จำนวน</span>,
			dataIndex: "amount_used",
			key: "amount_used",
			width: 100,
			align: "right",
			render: (text) => {
				return <span className="">{text}</span>;
			},
		},
		{
			title: <span className="">ราคา/หน่วย</span>,
			dataIndex: "price",
			key: "price",
			width: 100,
			align: "right",
			render: (text) => {
				return (
					<div className="flex justify-end">
						<span>{formatterPrice(text)}</span>
					</div>
				);
			},
		},
		{
			title: <span className="">ราคารวม</span>,
			dataIndex: "total_price",
			key: "total_price",
			width: 100,
			align: "right",
			render: (text) => {
				return (
					<div className="flex justify-end">
						<span>{formatterPrice(text)}</span>
					</div>
				);
			},
		},
	];

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

	const ITEMS_PER_PAGE = 8; // จำนวนสินค้าในแต่ละหน้า
	const paginatedProducts = useMemo(() => {
		const pages = [];
		for (let i = 0; i < listProduct.length; i += ITEMS_PER_PAGE) {
			pages.push(listProduct.slice(i, i + ITEMS_PER_PAGE));
		}
		return pages;
	}, [listProduct]);


	return (
		<>
			<div className="flex justify-center text-black ">
				<div className="p-5">
					<div className="flex justify-end p-5 bg-white w-full">
						<ReactToPrint
						
							trigger={() => (
								<Button
									type="primary"
									icon={<PrinterOutlined />}
								>
									พิมพ์
								</Button>
							)}
							content={() => componentRef.current}
						/>
					</div>

					<div
						ref={componentRef}
						className="p-5 bg-white w-full max-w-[22cm] page-container"
					>
						<header>
							<div className="flex flex-col gap-4">
								<div className="flex justify-between items-center">
									<div className="col-span-1 flex items-center">
										<div className="flex items-center">
											<img
												src={logo}
												alt="logo"
												className="relative -left-5"
												style={{
													width: "120px",
													height: "120px",
												}}
											/>
										</div>
										<div className="flex justify-center mt-3 relative -left-5">
											<div>
												<p className="text-base font-bold">
													บริษัท สุริยา คอฟฟิน เซอร์วิส จำกัด (สำนักงานใหญ่)
												</p>
												<p className="text-sm font-normal">
													{company.company_number} ถ.{company.road ?? "-"} ต.
													{company.sub_district_name} อ.
													{company.district_name} จ.{company.province_name}{" "}
													{company.zip_code}
												</p>
												<p className="text-sm font-normal">
													{" "}
													เลขประจำตัวผู้เสียภาษี: 0-1255-64016-65-2
													{company.mobile_no ? `โทร ${company.mobile_no}` : ""}
												</p>
												<p className="text-sm font-normal">
													{" "}
													{company.email ? `${company.email} ` : ""}
													www.suriya6.com
												</p>
											</div>
										</div>
									</div>
									<div className="col-span-1 flex flex-col justify-center">
										<span className="text-2xl text-end font-bold ">
											{data?.billno ?? ".............................."}
										</span>
										<span className="text-2xl text-end font-bold">
											{headingText}
										</span>
									</div>
								</div>
								<div className=" grid grid-cols-2 border-y border-black my-3 py-1">
									<span className="text-base font-bold">ข้อมูลลูกค้า</span>
									<span className="text-base font-bold ms-1">ข้อมูลบิล</span>
								</div>
							</div>
							<div className=" grid grid-cols-2 gap-2 mb-3">
								<div className="flex gap-2">
									<span className="font-bold">ชื่อผู้เสียชีวิต:</span>
									{data?.deceased ?? ".............................."}
								</div>
								<div className="flex gap-2">
									<span className="font-bold">เล่มที่:</span>
									{data?.bookno ?? ".............................."}
								</div>
								<div className="flex gap-2">
									<span className="font-bold">ชื่อผู้ติดต่อ:</span>
									{data?.contact ?? ".............................."}
								</div>
								<div className="flex gap-2">
									<span className="font-bold">เลขที่บิล:</span>
									{data?.billno ?? ".............................."}
								</div>
								<div className="flex gap-2">
									<span className="font-bold">ที่อยู่:</span>
									{data?.address ?? ".............................."}
								</div>
								<div className="flex gap-2">
									<span className="font-bold">พนักงานขาย:</span>
									{data?.billuser ?? ".............................."}
								</div>
								<div className="flex gap-2">
									<span className="font-bold">เบอร์โทรศัพท์:</span>
									{data?.phone ?? ".............................."}
								</div>
								<div className="flex gap-2">
									<span className="font-bold">วันที่:</span>
									{data?.issuedate ?? ".............................."}
								</div>
								<div className="flex gap-2 ">
									<span className="font-bold flex-shrink-0">
										ที่อยู่ที่ไปรับ:
									</span>
									<div
										className="max-w-full break-words whitespace-pre-wrap"
										style={{
											wordWrap: "break-word",
											wordBreak: "break-word",
										}}
									>
										{data?.receive ?? ".............................."}
									</div>
								</div>
								<div className="flex gap-2">
									<span className="font-bold">สถานะการจ่าย:</span>
									{textMap?.[data?.status] ?? ".............................."}
								</div>
								<div className="flex gap-2">
									<span className="font-bold">วัน/เวลาที่รับ:</span>
									{data?.receivedate}{" "}
									{dayjs(data?.receivetime, "HH:mm").isValid()
										? `/ ${dayjs(data?.receivetime, "HH:mm").format("HH:mm")}`
										: ""}
								</div>
								<div className="flex gap-2">
									<span className="font-bold">ประเภทบิล:</span>
									{data?.company_name}
								</div>
								<div className="flex gap-2">
									<span className="font-bold flex-shrink-0">ที่จัดส่ง:</span>
									<div
										className="max-w-full break-words whitespace-pre-wrap"
										style={{
											wordWrap: "break-word",
											wordBreak: "break-word",
										}}
									>
										{data?.send ?? ".............................."}
									</div>
								</div>
							</div>
						</header>
						<main className="flex-grow">
							<div className="min-h">
								{paginatedProducts.map((products, index) => (
									<div key={index}>
										<Table
											className="table-custom-th table-custom-td"
											columns={columns}
											dataSource={products.map((p) => ({
												...p,
												currentPage: index + 1,
											}))}
											pagination={false}
											bordered
										/>
										{index < paginatedProducts.length - 1 && (
											<div className="page-break pt-5"></div>
										)}
									</div>
								))}
							</div>
						</main>

						<footer>
							<div className="grid grid-cols-2 gap-4 my-3">
								<div className="col-span-1 mt-2">
									<div className="w-full overflow-hidden overflow-ellipsis p-2">
										<span className="text-sm">
											หมายเหตุ: {data?.remark || "-"}
										</span>
									</div>
								</div>
								<div className="col-span-1">
									{sum !== remaining && (
										<div className="grid grid-cols-2 gap-4 justify-items-end">
											<div className="col-span-1">
												<span className="text-base font-normal">ราคารวม:</span>
											</div>
											<div className="col-span-1">
												<span className="text-base font-normal">
													{formatterPrice(sum)}
												</span>
											</div>
										</div>
									)}
									{id === "4" && (
										<>
											<div className="grid grid-cols-2 gap-4 justify-items-end">
												<div className="col-span-1">
													<span className="text-base font-normal">
														ภาษีมูลค่าเพิ่ม (7%):
													</span>
												</div>
												<div className="col-span-1 ">
													<span className="text-base font-normal">
														{formatterPrice(vat)}
													</span>
												</div>
											</div>
											<div className="grid grid-cols-2 gap-4 justify-items-end">
												<div className="col-span-1">
													<span className="text-base font-normal">
														ราคารวมภาษีมูลค่าเพิ่ม:
													</span>
												</div>
												<div className="col-span-1 ">
													<span className="text-base font-normal">
														{formatterPrice(+vat + +sum)}
													</span>
												</div>
											</div>
										</>
									)}
									{discount &&
										discount > 0 &&
										id !== "3" &&
										id !== "4" &&
										id !== "5" && (
											<div className="grid grid-cols-2 gap-4 justify-items-end">
												<div className="col-span-1">
													<span className="text-base font-normal">ส่วนลด:</span>
												</div>
												<div className="col-span-1 ">
													<span className="text-base font-normal">
														{formatterPrice(discount)}
													</span>
												</div>
											</div>
										)}
									{deposit &&
										deposit > 0 &&
										id !== "3" &&
										id !== "4" &&
										id !== "5" && (
											<div className="grid grid-cols-2 gap-4 justify-items-end">
												<div className="col-span-1">
													<span className="text-base font-normal">มัดจำ:</span>
												</div>
												<div className="col-span-1 ">
													<span className="text-base font-normal">
														{formatterPrice(deposit)}
													</span>
												</div>
											</div>
										)}
									{priceAfterDiscount !== sum &&
										priceAfterDiscount.toString() !== remaining &&
										priceAfterDiscount.toString() !== sum &&
										id !== "1" &&
										id !== "3" &&
										id !== "4" &&
										id !== "5" && (
											<div className="grid grid-cols-2 gap-4 justify-items-end">
												<div className="col-span-1">
													<span className="text-base font-normal">
														ราคาหลังหักส่วนลดและมัดจำ:
													</span>
												</div>
												<div className="col-span-1 ">
													<span className="text-base font-normal">
														{formatterPrice(priceAfterDiscount)}
													</span>
												</div>
											</div>
										)}
									{/* {id === "4" && (
												  <div className="grid grid-cols-2 gap-4 justify-items-end">
													<div className="col-span-1">
													  <span className="text-base font-normal">
														ราคารวมสุทธิ:
													  </span>
													</div>
													<div className="col-span-1 ">
													  <span className="text-base font-normal">
														{formatterPrice(priceAfterDiscount)}
													  </span>
													</div>
												  </div>
												)} */}
									{id === "2" && (
										<div className="grid grid-cols-2 gap-4 justify-items-end">
											<div className="col-span-1">
												<span className="text-base font-normal">ชำระแล้ว</span>
											</div>
											<div className="col-span-1 ">
												<span className="text-base font-normal">
													{formatterPrice(payExtra)}
												</span>
											</div>
										</div>
									)}
									<div className="grid grid-cols-2 gap-4 justify-items-end">
										<div className="col-span-1">
											<span className="text-base font-normal">
												{id === "2" || id === "3" || id === "4" || id === "5"
													? "ยอดที่ต้องชำระ"
													: "ราคารวมสุทธิ"}
											</span>
										</div>
										<div className="col-span-1 ">
											<span className="text-base font-normal">
												{formatterPrice(
													id === "3" || id === "4" || id === "5"
														? 0
														: id === "1"
														? priceAfterDiscount
														: remaining
												)}
											</span>
										</div>
									</div>
								</div>
							</div>
							<hr />
							{/* 
											  1 = ใบเสนอราคา
											  2 = ใบแจ้งหนี้
											  3 = ใบเสร็จรับเงิน
											  4 = ใบเสร็จรับเงิน/ใบกำกับภาษี
											  5 = ใบเสร็จร้านดอกไม้
											*/}
							<div className="my-2">
								<div className="flex justify-between items-start ">
									<span className="text-base font-bold">
										{id === "1" && "รวมเป็นเงินทั้งสิ้น"}
										{id === "2" && "ยอดที่ต้องชำระ"}
										{id === "3" && "รวมเป็นเงินทั้งสิ้น"}
										{id === "4" && "รวมเป็นเงินทั้งสิ้น"}
										{id === "5" && "รวมเป็นเงินทั้งสิ้น"}
									</span>
									{/* ใบเสนอราคา */}
									{id === "1" && (
										<div className="flex flex-col items-end">
											<span className="text-base font-bold">
												{formatterPrice(priceAfterDiscount)}
											</span>
											<span className="text-base font-bold">
												{bahttext(priceAfterDiscount)}
											</span>
										</div>
									)}
									{/* ใบแจ้งหนี้ */}
									{id === "2" && (
										<div className="flex flex-col items-end">
											<span className="text-base font-bold">
												{formatterPrice(remaining)}
											</span>
											<span className="text-base font-bold">
												{bahttext(remaining)}
											</span>
										</div>
									)}
									{/* ใบเสร็จรับเงิน  / ใบเสร็จร้านดอกไม้ */}
									{id === "4" && (
										<div className="flex flex-col items-end">
											<span className="text-base font-bold">
												{formatterPrice(+vat + +sum)}
											</span>
											<span className="text-base font-bold">
												{bahttext(+vat + +sum)}
											</span>
										</div>
									)}
									{(id === "3" || id === "5") && (
										<div className="flex flex-col items-end">
											<span className="text-base font-bold">
												{formatterPrice(sum)}
											</span>
											<span className="text-base font-bold">
												{bahttext(sum)}
											</span>
										</div>
									)}
								</div>
							</div>
							<hr />
							<div className="grid grid-cols-4 gap-0  ">
								<div className="col-span-1 border border-black rounded-l-md">
									<div className="flex justify-center items-center">
										<span className="text-base font-bold">
											ผู้อนุมัติซื้อ /{" "}
										</span>
										<span className="text-base font-bold">Buyer Approves</span>
									</div>
									<hr className="border border-black" />
									<div className="flex flex-col items-center justify-center p-2">
										<span className="text-base font-bold">
											.............................................
										</span>
										<span className="text-base font-bold">
											วันที่....................................
										</span>
									</div>
								</div>
								<div className="col-span-1 border border-black">
									<div className="flex justify-center items-center">
										<span className="text-base font-bold">
											วันที่อนุมัติ /{" "}
										</span>
										<span className="text-base font-bold">Date approves</span>
									</div>
									<hr className="border border-black" />
									<div className="flex flex-col items-center justify-center p-2">
										<span className="text-base font-bold">
											.............................................
										</span>
										<span className="text-base font-bold">
											วันที่....................................
										</span>
									</div>
								</div>
								<div className="col-span-1 border border-black">
									<div className="flex justify-center items-center">
										<span className="text-base font-bold">พนักงานขาย / </span>
										<span className="text-base font-bold">Salesperson</span>
									</div>
									<hr className="border border-black" />
									<div className="flex flex-col items-center justify-center p-2">
										<span className="text-base font-bold">
											.............................................
										</span>
										<span className="text-base font-bold">
											วันที่....................................
										</span>
									</div>
								</div>
								<div className="col-span-1 border border-black rounded-r-md">
									<div className="flex justify-center items-center">
										<span className="text-base font-bold">อนุมัติโดย / </span>
										<span className="text-base font-bold">Approved by</span>
									</div>
									<hr className="border border-black" />
									<div className="flex flex-col items-center justify-center p-2">
										<span className="text-base font-bold">
											.............................................
										</span>
										<span className="text-base font-bold">
											วันที่....................................
										</span>
									</div>
								</div>
							</div>
						</footer>
					</div>
				</div>
			</div>
		</>
	);
});

QuotationPDF.displayName = "QuotationPDF";
QuotationPDF.propTypes = {
	id: PropTypes.number.isRequired,
};

export default QuotationPDF;
