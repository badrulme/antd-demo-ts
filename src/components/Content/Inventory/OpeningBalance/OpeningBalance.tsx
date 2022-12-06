import {
  Avatar,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  List,
  Row,
  Select,
  Skeleton,
  Switch,
  Table,
} from "antd";
import { Option } from "antd/es/mentions";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getCustomers } from "../../../../actions/CustomerAction";
import ICustomer from "../../../../interfaces/Customer";
import ITransaction from "../../../../interfaces/Transaction";
import { APPLICATION_DATE_FORMAT } from "../../../../settings";

type Props = {};

export default function OpeningBalance({}: Props) {
  const [transaction, settransaction] = useState<ITransaction>();
  const [customers, setCustomers] = useState<ICustomer[]>();

  const getIUoms = async () => {
    try {
      const { data } = await getCustomers();
      data.map((x: { [x: string]: any; id: any }) => {
        x["key"] = x.id;
        x["value"] = x.id;
        x["label"] = x.name;
      });
      setCustomers(data);
    } catch (error) {
      console.log("server error");
    }
  };

  interface DataType {
    gender: string;
    name: {
      title: string;
      first: string;
      last: string;
    };
    email: string;
    picture: {
      large: string;
      medium: string;
      thumbnail: string;
    };
    nat: string;
  }

  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
  ];

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch(
      "https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo"
    )
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);

  const onFinish = (values: any) => {
    console.log(values);
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={2}>Opening Balance</Title>
        </Col>
      </Row>
      <Row>
        <Col span={6}>
          <div
            id="scrollableDiv"
            style={{
              height: 400,
              overflow: "auto",
              padding: "0 16px",
              border: "1px solid rgba(140, 140, 140, 0.35)",
            }}
          >
            <InfiniteScroll
              dataLength={data.length}
              next={loadMoreData}
              hasMore={data.length < 50}
              loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
              endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
              scrollableTarget="scrollableDiv"
            >
              <List
                dataSource={data}
                renderItem={(item) => (
                  <List.Item key={item.email}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.picture.large} />}
                      title={<a href="https://ant.design">{item.name.last}</a>}
                      description={item.email}
                    />
                    <div>Content</div>
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          </div>
        </Col>
        <Col span={18}>
          <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Form.Item
              name={["code"]}
              label="code"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={["date"]}
              label="Date"
              rules={[{ required: true }]}
            >
              <DatePicker allowClear={false} format={APPLICATION_DATE_FORMAT} />
            </Form.Item>
            <Form.Item
              name="customerId"
              label="Customer"
              rules={[{ required: true }]}
            >
              <Select
                showSearch={true}
                placeholder="Select a Customer"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={customers}
              />
            </Form.Item>
            <Form.Item
              label="Posting Status"
              name="postingStatus"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item label="Payment Method" name="paymentMethod">
              <Select placeholder="Select a option" allowClear={false}>
                <Option value="DUE">Due</Option>
                <Option value="CASH">Cash</Option>
              </Select>
            </Form.Item>
            <Form.Item name={["description"]} label="Description">
              <Input.TextArea />
            </Form.Item>

            {/* <Form.Item
              name={["user", "age"]}
              label="Age"
              rules={[{ type: "number", min: 0, max: 99 }]}
            >
              <InputNumber />
            </Form.Item> */}
            {/* <Form.Item name={["user", "website"]} label="Website">
              <Input />
            </Form.Item>
            <Form.Item name={["user", "introduction"]} label="Introduction">
              <Input.TextArea />
            </Form.Item> */}
            {/* <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item> */}

            <Table pagination={false} dataSource={dataSource} columns={columns} />
          </Form>
        </Col>
      </Row>
    </>
  );
}
