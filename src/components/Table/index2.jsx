import { Form, Table } from "antd";
import PropTypes from "prop-types";

const TableComponent = ({
  dataSource = [],
  columns = [],
  loading = false,
  pagination = false,
  onChange,
  rowKey,
  form,
}) => {
  const [internalForm] = Form.useForm();
  const usedForm = form || internalForm;

  const rowClassName = (record) => {
    let className = "";
    if (record.status === "2") {
      className = "red-row";
    }
    return className + " custom-row";
  };

  return (
   <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        rowClassName={rowClassName}
        onRow={() => ({
          style: { padding: "16px" },
        })}
        rowKey={rowKey || "id"} // fallback to 'id' if not provided
        loading={loading}
        pagination={pagination}
        onChange={onChange}
        scroll={{ x: 1500 }}
        locale={{
          emptyText: (
            <div style={{ textAlign: "center" }}>
              <span>ไม่มีข้อมูล</span>
            </div>
          ),
        }}
      />
  );
};

TableComponent.propTypes = {
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  onChange: PropTypes.func,
  columns: PropTypes.array,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  form: PropTypes.object,
};

export default TableComponent;
