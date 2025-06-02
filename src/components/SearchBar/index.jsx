import { Form, Input, Button, Col, Row, Select, Flex } from "antd";

import PropTypes from "prop-types";
import CustomDateRangePicker from "../DateRangePicker/index";
import moment from "moment";
import dayjs from "dayjs";
import { useEffect } from "react";

const SearchBarComponent = (props) => {
  const form = props.form;

  const { onSearch, status, type } = props;

  return (
    <>
      <div className="search-bar ">
        <Form
          className="flex-grow container mx-auto"
          layout="vertical"
          form={form}
          onFinish={(values) => {
            onSearch(values);
          }}>
          <Row
            gutter={12}
            align={"middle"}>
            <Col span={4}>
              <Form.Item
                label="เลขที่บิล : "
                name="receiptNumber"
                width={"100%"}>
                <Input
                  placeholder="เลขที่บิล"
                  width={"100%"}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item
                label="วันที่ทำรายการ : "
                name="dateRange">
                <CustomDateRangePicker width={"100%"} />
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="สถานะ : "
                name="status">
                <Select
                  placeholder="เลือกสถานะ"
                  width={300}>
                  {status?.map((item) => (
                    <Select.Option
                      key={item.id}
                      value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={4}>
              <Form.Item
                label="ประเภท : "
                name="type">
                <Select placeholder="เลือกประเภท">
                  {type?.map((item) => (
                    <Select.Option
                      key={item.id}
                      value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* <Col>
              <Form.Item
                label="รับจาก : "
                name="receivefrom">
                <Input
                  style={{ width: 300 }}
                  placeholder="รับจาก"
                />
              </Form.Item>
            </Col> */}

            {/* <Col>
              <Form.Item
                label="ส่ง : "
                name="send">
                <Input
                  style={{ width: 300 }}
                  placeholder="send"
                />
              </Form.Item>
            </Col> */}

            <Col span={4}>
              <Flex gap={4}>
                <Button
                  className="w-[300px] mt-1"
                  type="submit"
                  onClick={() => {
                    form.submit();
                  }}>
                  ค้นหา
                </Button>
              </Flex>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

SearchBarComponent.propTypes = {
  onSearch: PropTypes.func.isRequired,
  isStatus: PropTypes.bool,
  status: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  isType: PropTypes.bool,
  type: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  filter: PropTypes.bool,
  form: PropTypes.object.isRequired,
};

export default SearchBarComponent;
