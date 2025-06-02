import { TimePicker } from "antd";
import CustomDatePicker from "../../components/DatePicker/index";
import PropTypes from "prop-types";

export const PickerWithType = ({ type, onChange, value }) => {
  if (type === "time")
    return (
      <TimePicker
        onChange={(val) => {
          onChange(val);
        }}
        style={{ width: "100%" }}
        placeholder="เวลา"
        format="HH:mm"
        value={value}
      />
    );
  if (type === "date")
    return (
      <>
        <CustomDatePicker
          onChange={(val) => {
            onChange(val);
          }}
          style={{ width: "100%" }}
          value={value}
        />
      </>
    );
  return (
    <CustomDatePicker
      picker={type}
      onChange={onChange}
      style={{ width: "100%" }}
    />
  );
};

PickerWithType.propTypes = {
  type: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.any,
};
