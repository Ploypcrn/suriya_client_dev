import { Badge, Space } from 'antd';
import { textMap } from '../../constant/status';
import PropTypes from 'prop-types';





const StatusComponent = (props) => {

    const status = parseInt(props.status == null ? 0 : props.status);
    const statusMap = {
        1: 'success',
        2: 'error',
        3: 'error',
    };

  
    return (
        <Space>
            <Badge status={statusMap[status]} />
            <span>{textMap[status]}</span>
        </Space>
    );
};

StatusComponent.propTypes = {
    status: PropTypes.number
};

export default StatusComponent;