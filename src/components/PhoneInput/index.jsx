/* eslint-disable react/prop-types */
import { Input } from 'antd';

const PhoneInput = (props) => {
    const { value = '', onChange } = props;

    const handleChange = (e) => {
        const { value: inputValue } = e.target;
        // ✅ อนุญาตเฉพาะเลข 0-9 และ -
        const reg = /^[0-9\-]*$/;

        if (reg.test(inputValue)) {
            onChange?.(inputValue);
        }
    };

    const handleBlur = () => {
        let cleanedValue = value;

        // ลบ dash ที่ขึ้นต้นหรือท้ายออก
        cleanedValue = cleanedValue.replace(/^-+/, '').replace(/-+$/, '');

        // ลด dash ซ้ำ ๆ ให้เหลือแค่ตัวเดียว
        cleanedValue = cleanedValue.replace(/-+/g, '-');

        onChange?.(cleanedValue);
    };

    return (
        <Input
            {...props}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={props?.placeholder || 'Enter phone number'}
            maxLength={15} // ปรับให้เหมาะกับเบอร์ที่มี dash ด้วย
        />
    );
};

export default PhoneInput;
