import { useRef, useState } from "react";
import userService from "../../../services/userService";
import masterService from "../../../services/masterService";
import companyService from "../../../services/companyService";
import stockService from "../../../services/stockService";
import billService from "../../../services/billService";
import { Form } from "antd";
import dayjs from "dayjs";

export function usePageManage() {
  const FormManager = (() => {
    const [form] = Form.useForm();
    const setDefaultSelectedUserBillId = () => {
      const user = localStorage.getItem("user");
      const userObj = JSON.parse(user);
      form.setFieldsValue({
        billBy: userObj.data[0].id,
      });
    };
    const setDefaultBookNo = () => {
      const date = new Date();
      const year = date.getFullYear() + 543;

      const bookNo = year.toString().substr(-2);

      form.setFieldsValue({
        bookNo: bookNo,
      });
    };

    const buildFormData = () => {
      const submitData = form.getFieldsValue();
      return {
        billId: submitData.id || undefined,
        billNo: submitData.billNo,
        bookNo: submitData.bookNo,
        type: submitData.type,
        typeId: CompanyManager.companyOptions.find(
          (item) => item.label === submitData.type
        )?.value,
        status: submitData.status || undefined,
        deceased: submitData.deceased,
        contact: submitData.contact,
        address: submitData.address,
        phone: submitData.phone,
        receiveFrom: submitData.receiveFrom,
        receiveDate: submitData.receiveDate,
        receiveTime: dayjs(submitData.receiveTime, "HH:mm").isValid()
          ? dayjs(submitData.receiveTime, "HH:mm").format("HH:mm:ssZ")
          : undefined,
        issueDate: submitData.issueDate,
        issueTime: dayjs(submitData.issueTime, "HH:mm").isValid()
          ? dayjs(submitData.issueTime, "HH:mm").format("HH:mm:ssZ")
          : undefined,
        send: submitData.send,
        donate: submitData.donate,
        listProduct: submitData.productList.map((item) => ({
          listproductId: item.id,
          stockId: item.productID,
          stockName: item.productName,
          warehouse: parseInt(item.warehouse),
          amount: item.amount,
          price: item.price,
          totalPrice: item.amount * item.price,
        })),
        discount: submitData.discount,
        deposit: submitData.deposit,
        totalAmount: 0,
        remark: submitData.remark || "",
        note: submitData.note || "",
        billBy: UserBillManager.userBillOptions.find(
          (item) => item.value === submitData.billBy
        )?.label,
        billUserId: submitData.billBy,
        paymentMethod: submitData.paymentMethod,
        paymentTypeId: submitData.paymentTypeId,
        sum: sum,
        priceAfterDiscount: priceAfterDiscount,
        remaining: remaining,
        payExtra: submitData.payExtra,
      };
    };

    const setFormValues = (dataBill) => {
      form.setFieldsValue({
        id: dataBill.billid,
        bookNo: dataBill.bookno,
        billNo: dataBill.billno,
        status: dataBill.status,
        deceased: dataBill.deceased,
        contact: dataBill.contact,
        phone: dataBill.phone,
        address: dataBill.address,
        receiveDate: dataBill.receivedate,
        receiveTime: dayjs(dataBill.receivetime, "HH:mm").isValid()
          ? dayjs(dataBill.receivetime, "HH:mm").format("HH:mm")
          : "",
        receiveFrom: dataBill.receive,
        send: dataBill.send,
        billBy: dataBill.user_id,
        type: dataBill.company_name,
        paymentTypeId: dataBill.payment_id,
        donate: dataBill.donate,
        issueDate: dataBill.issuedate,
        issueTime: dayjs(dataBill.issuetime, "HH:mm").isValid()
          ? dayjs(dataBill.issuetime, "HH:mm").format("HH:mm")
          : "",
        productList: dataBill.listProduct.map((item) => ({
          listProductId: item.listproductid || undefined,
          productName: item.stock_name,
          amount: +item.amount_used,
          price: +item.price,
        })),
        discount: +dataBill.discount,
        deposit: +dataBill.deposit,
        payExtra: +dataBill.payextra || 0,
        remark: dataBill.remark,
        note: dataBill.note,
      });
    };
    console.log(form.getFieldsValue());

    const productListWatcher = Form.useWatch("productList", form) || [];
    const sum = productListWatcher.reduce((acc, item) => {
      return acc + item.amount * item.price;
    }, 0);
    const priceAfterDiscount = sum - Form.useWatch("discount", form) || 0;
    const deposit = Form.useWatch("deposit", form) || 0;
    const isDonate = Form.useWatch("donate", form);
    const payExtra = Form.useWatch("payExtra", form) || 0;
    const remaining = isDonate
      ? 0
      : priceAfterDiscount - deposit - payExtra < 0
      ? 0
      : priceAfterDiscount - deposit - payExtra;

    return {
      form,
      setDefaultSelectedUserBillId,
      setDefaultBookNo,
      buildFormData,
      sum,
      priceAfterDiscount,
      deposit,
      remaining,
      productListWatcher,
      setFormValues,
    };
  })();

  const UserBillManager = (() => {
    const [userBillOptions, setUserBillOptions] = useState([]);

    const loadUsersBillAsync = async () => {
      const response = await userService.getUsersAll();
      setUserBillOptions(
        (prev) =>
          response?.data.map((item) => ({
            label: `${item.firstname} ${item.lastname}`,
            value: item.id,
          })) || []
      );
    };
    return {
      userBillOptions,
      loadUsersBillAsync,
    };
  })();

  const PaymentTypeManager = (() => {
    const [paymentTypeOptions, setPaymentTypeOptions] = useState([]);

    const loadPaymentTypeAsync = async () => {
      const response = await masterService.getMasterPaymentType();
      setPaymentTypeOptions(
        response?.data.map((item) => ({
          label: item.payment_name,
          value: item.payment_type,
        })) || []
      );
    };
    return {
      paymentTypeOptions,
      loadPaymentTypeAsync,
    };
  })();

  const CompanyManager = (() => {
    const [companyOptions, setCompanyOptions] = useState([]);

    const loadCompanyAsync = async () => {
      const response = await companyService.getCompany();
      setCompanyOptions(
        response?.data.map((item) => ({
          label: item.company_name,
          value: item.id,
        })) || []
      );
    };
    return {
      companyOptions,
      loadCompanyAsync,
    };
  })();

  const ProductManager = (() => {
    const [productOptions, setProductOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);

    const loadProductAsync = async () => {
      const response = await stockService.getStock();
      console.log(response);
      const mappedResp =
        response?.data.map((item) => ({
          label: item.stock_name,
          value: item.stock_name,
        })) || [];
      setProductOptions(mappedResp);
      setFilteredOptions(mappedResp);
    };

    const handleSearch = (searchText) => {
      // กรองสินค้าโดยเปรียบเทียบคำที่พิมพ์
      const filtered = productOptions.filter((option) =>
        option.label.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredOptions(filtered);
    };

    return {
      productOptions,
      loadProductAsync,
      filteredOptions,
      handleSearch,
    };
  })();

  const ModalPrintPDFManager = (() => {
    const [isOpen, setIsOpen] = useState(false);
    const [dataModal, setDataModal] = useState([]);
    const componentRef = useRef(null);
    return {
      isOpen,
      setIsOpen,
      dataModal,
      setDataModal,
      componentRef,
    };
  })();

  const BillManager = (() => {
    async function getBillByIdAsync(id) {
      return await billService.getBillByBillNo(id).then((x) => x.data[0]!);
    }

    return {
      getBillByIdAsync,
    };
  })();

  return {
    FormManager,
    UserBillManager,
    BillManager,
    PaymentTypeManager,
    CompanyManager,
    ProductManager,
    ModalPrintPDFManager,
  };
}
