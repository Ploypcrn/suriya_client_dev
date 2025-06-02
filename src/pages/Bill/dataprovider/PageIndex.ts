import { useState } from "react";
import { useNavigate } from "react-router-dom";
import companyService from "../../../services/companyService";
import billService from "../../../services/billService";
import NotiAfterConfirm from "../../../Notification/NotiAfterConfirm";

export function usePageIndex() {
  const [loading, setLoading] = useState(false);

  const TableManager = (() => {
    const [tableData, setTableData] = useState([]);
    const [tableParams, setTableParams] = useState({
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0,
      },
    });
    const loadTableData = async (values) => {
      try {
        setLoading(true);
        const searchValues = {
          ...values,
          status: values.status === "0" ? "" : values.status,
          type: values.type === "0" ? "" : values.type,
        };
        const response = await billService.searchBill(searchValues);
        setTableData(response?.data);
        setLoading(false);
        return response;
      } catch (error) {
        setLoading(false);
      }
    };
    const setToTalTableParams = (total) => {
      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: total,
        },
      }));
    };
    const resetTableData = () => {
      setTableData([]);
    };
    const resetTableParamsPageToFirstPage = () => {
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: 1,
        },
      });
    };
    return {
      tableData,
      setTableData,
      setToTalTableParams,
      loadTableData,
      tableParams,
      setTableParams,
      resetTableData,
      resetTableParamsPageToFirstPage,
    };
  })();

  const ModalPrintListPDFManager = (() => {
    const [isOpen, setIsOpen] = useState(false);
    const [billId, setBillId] = useState([]);
    const [companyData, setCompanyData] = useState([]);
    const loadCompanyAsync = async () => {
      const response = await companyService.getCompany();
      setCompanyData(response.data);
    };

    return {
      isOpen,
      setIsOpen,
      billId,
      setBillId,
      companyData,
      loadCompanyAsync,
    };
  })();

  const deleteBillAsync = async (billid) => {
    try {
      const response = await billService.deleteBill(billid);
      if (response.data) {
        NotiAfterConfirm("success", "ลบข้อมูลสำเร็จ", "ลบข้อมูลสำเร็จ");
      } else {
        NotiAfterConfirm("error", "ลบข้อมูลไม่สำเร็จ", "ลบข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      NotiAfterConfirm("error", "ลบข้อมูลไม่สำเร็จ", "ลบข้อมูลไม่สำเร็จ");
    }
  };

  return {
    ModalPrintListPDFManager,
    TableManager,
    deleteBillAsync,
    status: [
      {
        id: "0",
        name: "ทั้งหมด",
      },
      {
        id: "1",
        name: "ชำระครบแล้ว",
      },
      {
        id: "2",
        name: "ค้างชำระ",
      },
      {
        id: "3",
        name: "ยกเลิก",
      },
    ],

    type: [
      {
        id: "0",
        name: "ทั้งหมด",
      },
      {
        id: "1",
        name: "เงินสด",
      },
      {
        id: "2",
        name: "เช็ค",
      },
      {
        id: "3",
        name: "เงินโอนผ่านธนาคาร",
      },
    ],
  };
}
