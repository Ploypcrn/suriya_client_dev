/* eslint-disable react/prop-types */
import { Input } from 'antd';
// const formatNumber = (value) => new Intl.NumberFormat().format(value);

const PhoneInput = (props) => {
    const { value, onChange } = props;
    const handleChange = (e) => {
        const { value: inputValue } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;
        if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
            onChange(inputValue);
        }
    }; 
    const handleBlur = () => {
        let valueTemp = value;
        if (valueTemp.charAt(valueTemp.length - 1) === '.' || valueTemp === '-') {
            valueTemp = valueTemp.slice(0, -1);
        }
        onChange(valueTemp.replace(/(\d+)/, '$1'));
    };

    return (
            <Input
                {...props}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={props?.placeholder || 'Input a number'}
                maxLength={10}
            />
    );
};

export default PhoneInput;