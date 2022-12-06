import { LockOutlined, PlusCircleTwoTone, PlusOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  List,
  Row, Select, Skeleton,
  Switch,
  Table
} from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getProducts } from "../../../../actions/ProductAction";
import IProduct from "../../../../interfaces/Product";

import ITransaction from "../../../../interfaces/Transaction";
import ITransactionItem from "../../../../interfaces/TransactionItem";
import { APPLICATION_DATE_FORMAT } from "../../../../settings";

type Props = {};

export default function OpeningBalance({ }: Props) {
  const [transaction, settransaction] = useState<ITransaction>();
  const [transactionItem, setTransactionItem] = useState<ITransactionItem>();
  const [transactionItems, setTransactionItems] = useState<ITransactionItem[]>();
  const [populatedTransactionItems, setPopulatedTransactionItems] = useState<ITransactionItem[]>([]);
  const [products, setProducts] = useState<IProduct[]>();
  const [product, setProduct] = useState<IProduct>();
  const [productId, setProductId] = useState<number>(0);

  const [itemAddform] = Form.useForm();
  const [, forceUpdate] = useState({});

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


  const getProductList = async () => {
    try {
      const { data } = await getProducts();
      data.map((x: { [x: string]: any; id: any }) => {
        x["key"] = x.id;
        x["value"] = x.id;
        x["label"] = '[' + x.code + '] ' + x.name;
      });
      setProducts(data);
    } catch (error) {
      console.log("server error");
    }
  };

  const columns = [
    {
      title: "Product Code",
      dataIndex: "code",
      key: "code",
      render: (_: any, record: ITransactionItem) => record.product?.code,
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: ITransactionItem) => record.product?.name,
    },
    {
      title: "Receive Quantity",
      dataIndex: "receiveQuantity",
      key: "receiveQuantity",
    }
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
    getProductList();
    loadMoreData();
  }, []);


  useEffect(() => {
    setProduct(products?.find(x => x.id === productId))
    return () => {
    }
  }, [productId])


  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataType[]>([]);

  const onAddProduct = (values: any) => {

    const currentProductId = values.productId;

    const obj: ITransactionItem = {
      productId: currentProductId,
      receiveQuantity: values.quantity,
      salePrice: 0,
      issueQuantity: 0,
      transaction: null,
      product: products?.find(x => x.id === currentProductId),
      createdDate: null,
      lastModifiedDate: null
    }
    // console.log(obj);

    setPopulatedTransactionItems(items => [...items, { ...obj, 'key': obj.productId }]);
    // transaction: ITransaction;
    // productId: number;
    // product: IProduct;
    // salePrice: number;
    // receiveQuantity: number;
    // issueQuantity: number;
    // setTransactionItem({
    //   productId: form.getFieldValue("productId"),
    //   receiveQuantity: form.getFieldValue("quantity")
    // })
    // setPopulatedTransactionItems(names => [...names, {
    //   name: form.getFieldValue("name"),
    //         alias: form.getFieldValue("alias"),
    //         description: form.getFieldValue("description")
    // }])
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
    wrapperCol: { span: 10 },
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
            onFinish={onAddProduct}
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
              label="Posting Status"
              name="postingStatus"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item name={["description"]} label="Description">
              <Input.TextArea />
            </Form.Item>
          </Form>



          <Form form={itemAddform} onFinish={onAddProduct}>
            <Form.Item
              name="productId"
              rules={[{ required: true }]}
            >
              <Select
                showSearch={true}
                placeholder="Select a Product"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.name ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase()) ||
                  (option?.code ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={products}
              />
            </Form.Item>
            <Form.Item
              name="quantity"
              rules={[{ required: true, message: 'Please input your Quantity!' }]}
            >
              <InputNumber
                placeholder="Quantity"
              />
            </Form.Item>
            <Form.Item shouldUpdate>
              {() => (
                <Button
                  type="primary"
                  htmlType="submit"
                // disabled={
                //   !form.isFieldsTouched(true) ||
                //   !!form.getFieldsError().filter(({ errors }) => errors.length).length
                // }
                >
                  <PlusOutlined /> Add
                </Button>
              )}
            </Form.Item>
          </Form>
          <br />
          <Table size="small"
            pagination={false}
            dataSource={populatedTransactionItems}
            columns={columns}
          />

        </Col>
      </Row>
    </>
  );
}
