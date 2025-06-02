import React, { useState, useEffect } from "react";
import DatePicker from "./DatePicker";

import thTH from "antd/lib/locale/th_TH";

import locale from "antd/es/date-picker/locale/th_TH";

import ConfigProvider from "antd/es/config-provider/index";

import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";

function CustomDateRangePicker(props: any) {
  const [dateFrom, setDateFrom] = useState<any>(null);
  const [dateTo, setDateTo] = useState<any>(null);
  const [selectDate, setSelectDate] = useState<any>(dayjs().endOf("day"));
  const { type, disabled } = props;

  dayjs.extend(buddhistEra);
  dayjs.locale("th");
  // dayjs().format('BBBB')

  const datePickerTh = {
    ...locale,
    lang: {
      ...locale.lang,
      yearFormat: "BBBB",
      dateFormat: "M/D/BBBB",
      dateTimeFormat: "M/D/BBBB HH:mm:ss",
    },
    dateFormat: "DD/MM/BBBB",
    dateTimeFormat: "BBBB-MM-DD HH:mm:ss",
    weekFormat: "BBBB-wo",
    monthFormat: "BBBB-MM",
  };

  // convert DD/MM/BBBB to DD/MM/YYYY
  const customFormat = (value: any) => {
    if (value) {
      return dayjs(value, "DD/MM/YYYY")
        .locale("th")
        // .subtract(543, "year")
        .format("DD/MM/YYYY");
    }
    return value;
  };

  useEffect(() => {
    // Run only on the first render
    if (!dateFrom && !dateTo && props.value) {
      setDateFrom(customFormat(props.value[0]));
      setDateTo(customFormat(props.value[1]));
    }
  }, [dateFrom, dateTo, props.value]);

  useEffect(() => {
    if (props.selectDate) {
      setSelectDate(
        dayjs(props.selectDate, "DD/MM/YYYY").subtract(543, "year").endOf("day")
      );
    }
  }, [props.selectDate]);

  const disabledDate = (current: any) => {
    switch (type) {
      case 1: // วันที่เริ่มต้น ไม่สามารถเลือกวันที่มากกว่าวันที่สิ้นสุดได้
        return current && current < selectDate;
      case 2: // วันที่สิ้นสุด ไม่สามารถเลือกวันที่น้อยกว่าวันที่เริ่มต้นได้
        return current && current > selectDate;
      default:
        return false;
    }
  };

  return (
    <ConfigProvider locale={thTH}>
      <DatePicker.RangePicker
        allowClear
        className="w-full font-IBM font-base"
        placeholder={["วันที่เริ่มต้น", "วันที่สิ้นสุด"]}
        id="constructionCompletedWhen"
        format="DD/MM/BBBB"
        locale={datePickerTh}
        disabledDate={disabledDate}
        disabled={disabled}
        onChange={(e) => {
          setDateFrom(e && e.length > 0 ? e[0].format("DD/MM/YYYY") : null);
          setDateTo(e && e.length > 1 ? e[1].format("DD/MM/YYYY") : null);
          props.onChange(e);
        }}
        value={dateFrom && dateTo ? [dayjs(dateFrom, "DD/MM/YYYY"), dayjs(dateTo, "DD/MM/YYYY")] : [null, null]}
      />
    </ConfigProvider>
  );
}

export default CustomDateRangePicker;
