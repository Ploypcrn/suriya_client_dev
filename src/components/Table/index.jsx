import { useState } from "react";
import { Form, Table } from "antd";
import { useEffect } from "react";
import PropTypes from "prop-types";

const TableComponent = (props) => {

  const [form] = Form.useForm();
  const [data, setData] = useState(props.dataSource);
  const [loading] = useState(props.loading);

  const [columns, setColumns] = useState(props.columns);
  const [editingKey] = useState("");

  const isEditing = (record) => {
    return record.key === editingKey;
  };

  const mergedColumns = columns?.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const rowClassName = (record) => {
    let className = "";
    if (record.status === "2") {
      className = "red-row";
    }
    return className + ' custom-row';
  };

  useEffect(() => {
    setColumns(props?.columns[0]);
    setData(props?.dataSource[0]);
  }, [props]);

  return (
    <Form
      form={form}
      component={false}>
      <Table
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName={rowClassName}
        onRow={() => ({
            style: { padding: '16px' }, // กำหนด padding ในแถว
          })}
        rowKey="key"
        loading={loading}
        pagination={props.pagination}
        onChange={props.onChange}
        scroll={{ x: 1500 }}
        locale={{
          emptyText: (
            <div style={{ textAlign: "center" }}>
              <span>ไม่มีข้อมูล</span>
            </div>
          ),
        }}
      />
    </Form>
  );
};

TableComponent.propTypes = {
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  onChange: PropTypes.func,
  columns: PropTypes.array,
};

export default TableComponent;
