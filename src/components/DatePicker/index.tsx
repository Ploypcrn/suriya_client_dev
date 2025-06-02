import React, { useState, useEffect } from "react";
import DatePicker from "./DatePicker";

import thTH from "antd/lib/locale/th_TH";

import locale from "antd/es/date-picker/locale/th_TH";

import ConfigProvider from "antd/es/config-provider/index";

import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";

function CustomDatePicker(props: any) {
  const [date, setDate] = useState<any>(null);
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

const customFormat = (value: any) => {
  if (!value) return value;

  let date = dayjs(value, "YYYY-MM-DD", true); 

  if (!date.isValid()) {
    date = dayjs(value, "DD/MM/YYYY", true);
  }

  if (date.isValid()) {
    return date
      .locale("th")
      .subtract(543, "year")
      .format("DD/MM/YYYY");
  }

  return value; // ถ้าแปลงไม่ได้ก็คืนค่าเดิม
};


  useEffect(() => {
    // Run only on the first render
    if (props.value) {
      console.log("customFormat", customFormat(props.value));
      
      setDate(customFormat(props.value));
    }
  }, [date, props.value]);

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
      <DatePicker
        allowClear
        className="w-full font-IBM font-base"
        placeholder="วัน/เดือน/ปี"
        id="constructionCompletedWhen"
        format="DD/MM/BBBB"
        locale={datePickerTh}
        disabledDate={disabledDate}
        disabled={disabled}
        style={props.style}
        onChange={(e) => {

          if (e) {
            setDate(e);
            props.onChange(dayjs(e).format("DD/MM/BBBB"));
          } else {
            setDate("");
            props.onChange("");
          }
        }}
        value={date ? dayjs(date, "DD/MM/YYYY") : null}
      />
    </ConfigProvider>
  );
}

export default CustomDatePicker;
