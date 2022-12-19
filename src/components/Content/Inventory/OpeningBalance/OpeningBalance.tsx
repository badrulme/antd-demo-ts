import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  List,
  Row,
  Select,
  Skeleton,
  Switch,
  Table
} from "antd";
import Title from "antd/es/typography/Title";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getProducts } from "../../../../actions/ProductAction";
import { getTransaction, getTransactionBasicList } from "../../../../actions/TransactionAction";
import ApiServicePath from "../../../../enums/ApiServicePath";
import ListOperationType from "../../../../enums/ListOperationType";
import TransactionFormState from "../../../../enums/TransactionFormState";
import IProduct from "../../../../interfaces/Product";
import ITransaction from "../../../../interfaces/Transaction";
import ITransactionBasic from "../../../../interfaces/TransactionBasic";
import ITransactionItem from "../../../../interfaces/TransactionItem";
import { API_URL, APPLICATION_DATE_FORMAT } from "../../../../settings";
import "./Style.css";
type Props = {};


export default function OpeningBalance({ }: Props) {
  const [loadingTransactionList, setLoadingTransactionList] = useState(false);

  const [transaction, setTransaction] = useState<ITransaction>();
  const [transactionItem, setTransactionItem] = useState<ITransactionItem>();
  const [transactionBasicList, setTransactionBasicList] = useState<
    ITransactionBasic[]
  >([]);
  const [transactionItems, setTransactionItems] =
    useState<ITransactionItem[]>();
  const [populatedTransactionItems, setPopulatedTransactionItems] = useState<
    ITransactionItem[]
  >([]);
  const [products, setProducts] = useState<IProduct[]>();
  const [product, setProduct] = useState<IProduct>();
  const [productId, setProductId] = useState<number>(0);

  const [transactionId, setTransactionId] = useState<number>(0);
  const [formState, setFormState] = useState(TransactionFormState.CREATE);
  const [formActionButtonText, setFormActionButtonText] = useState("Create");

  // Page related
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [collectedElements, setCollectedElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const [itemAddform] = Form.useForm();
  const [transactionForm] = Form.useForm();
  const [, forceUpdate] = useState({});

  const getProductList = async () => {
    try {
      const { data } = await getProducts();
      data.map((x: { [x: string]: any; id: any }) => {
        x["key"] = x.id;
        x["value"] = x.id;
        x["label"] = "[" + x.code + "] " + x.name;
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
      render: (_: any, record: ITransactionItem) => record.receiveQuantity,
    },
  ];

  const getTransactionBasic = async () => {
    try {
      const { data } = await getTransactionBasicList(1);
      setTransactionBasicList(data);
    } catch (error) {
      console.log("server error");
    }
  };

  const getTransactionDetails = async (id: number) => {
    try {
      const { data } = await getTransaction(id);
      setTransaction(data);

      let date = dayjs(
        moment
          .utc(data.date)
          .local()
          .format(APPLICATION_DATE_FORMAT),
        APPLICATION_DATE_FORMAT
      );

      transactionForm.setFieldsValue({
        code: data.code,
        date: date,
        description: data.description,
        postingStatus: data.postingStatus,
      });
      console.log('data.transactionItems', data.transactionItems);

      let items = data.transactionItems.map((element: any) => {
        element["key"] = element.productId;
        return element;
      });

      console.log('items', items);


      setPopulatedTransactionItems(items);
      setFormState(TransactionFormState.UPDATE);

    } catch (error) {
      console.log("server error");
    }
  };

  const loadTransactionList = async () => {
    if (loadingTransactionList) {
      return;
    }
    setLoadingTransactionList(true);

    axios
      .get(
        `http://localhost:8081/transactions/basic-list?transactionTypeId=1&pageNo=${pageNo}`
      )
      .then((response) => {
        if (response.data.content.length > 0) {
          setTransactionBasicList([...transactionBasicList, ...response.data.content]);
          setPageNo((prevState) => prevState + 1);
          setCollectedElements(
            (prevState) => prevState + response.data.content.length
          );
          setTotalElements(response.data.totalElements);

          if (response.data.first) {
            setTransactionId(response.data.content[0].id);
          }
        }

        setLoadingTransactionList(false);

      })
      .catch((err) => {
        setLoadingTransactionList(false);
        console.log("server error", err);
      });
  };

  // Initial page setup
  useEffect(() => {
    resetTransactionForm();
    getProductList();
    loadTransactionList();
    if (transactionBasicList.length > 0) {
      setTransactionId(transactionBasicList[0].id);
    }

  }, []);

  useEffect(() => {
    setProduct(products?.find((x) => x.id === productId));
    return () => { };
  }, [productId]);

  useEffect(() => {
    if (formState === TransactionFormState.CREATE) {
      setFormActionButtonText("Create");
    } else if (formState === TransactionFormState.UPDATE) {
      setFormActionButtonText("Change");
    }
    return () => { };
  }, [formState]);


  const onCreateTransaction = () => {
    if (formState === TransactionFormState.CREATE) {
      axios
        .post(`${API_URL}/${ApiServicePath.Transaction}`, {
          date: transactionForm.getFieldValue("date"),
          transactionTypeId: 1,
          description: transactionForm.getFieldValue("description"),
          postingStatus: transactionForm.getFieldValue("postingStatus"),
          transactionItems: populatedTransactionItems,
        })
        .then((response) => {

          const tranItem: ITransactionBasic = {
            id: response.data.id,
            code: response.data.code,
            date: response.data.code,
          };

          let tranList = transactionBasicList;
          tranList.splice(0, 0, tranItem);
          setTransactionBasicList(tranList);

          setTotalElements((prevState) => prevState + 1);
          setCollectedElements((prevState) => prevState + 1);
          setTransactionId(response.data.id);
          setFormState(TransactionFormState.UPDATE);
        })
        .catch((err) => {
          console.log("server error", err);
        });
    } else if (formState === TransactionFormState.UPDATE) {
      axios
        .put(`${API_URL}/${ApiServicePath.Transaction}/${transactionId}`, {
          date: transactionForm.getFieldValue("date"),
          transactionTypeId: 1,
          description: transactionForm.getFieldValue("description"),
          postingStatus: transactionForm.getFieldValue("postingStatus"),
          transactionItems: populatedTransactionItems,
        })
        .then((response) => {
          setTransactionId(response.data.id);
        })
        .catch((err) => {
          console.log("server error", err);
        });
    }
  };

  const resetTransactionForm = () => {
    transactionForm.resetFields();
    transactionForm.setFieldsValue({
      gender: "MALE",
      postingStatus: false,
      date: dayjs(
        moment.utc().local().format("DD-MMM-YYYY"),
        APPLICATION_DATE_FORMAT
      ),
    });
  };

  const onAddProduct = (values: any) => {
    const currentProductId = values.productId;

    if (
      populatedTransactionItems?.find(
        (x) => x.productId === currentProductId
      ) != null
    ) {
      const updateItems = populatedTransactionItems.map((element) => {
        if (element.productId === currentProductId) {
          element.receiveQuantity += values.quantity;
          element.listOperationType = ListOperationType.CHANGE;
        }
        return element;
      });

      setPopulatedTransactionItems(updateItems);
    } else {
      const obj: ITransactionItem = {
        productId: currentProductId,
        receiveQuantity: values.quantity,
        salePrice: 0,
        issueQuantity: 0,
        transaction: null,
        product: products?.find((x) => x.id === currentProductId),
        createdDate: null,
        lastModifiedDate: null,
        listOperationType: ListOperationType.ADD,
        id: null
      };

      setPopulatedTransactionItems((items) => [
        ...items,
        { ...obj, key: obj.productId },
      ]);
      console.log("Not Found");
    }

    itemAddform.resetFields();
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

  useEffect(() => {
    if (transactionId != 0) {
      getTransactionDetails(transactionId);
    }

    return () => {
    }
  }, [transactionId])


  const onSelectTransaction = (tranId: number) => {
    setTransactionId(tranId);
  }

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
              dataLength={transactionBasicList.length}
              next={loadTransactionList}
              hasMore={collectedElements < totalElements}
              loader={<Skeleton paragraph={{ rows: 10 }} active />}
              endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
              scrollableTarget="scrollableDiv"
            >
              <List
                dataSource={transactionBasicList}
                renderItem={(transaction) => (
                  <List.Item onClick={() => onSelectTransaction(transaction.id)}
                    key={transaction.id}
                    className={`cursor-pointer ${transaction.id == transactionId ? "transaction-item-highlight" : ""} `}
                  >
                    <div>{transaction.code}</div>
                  </List.Item>
                )}
              />
            </InfiniteScroll>
          </div>
          Count: {collectedElements}/{totalElements}
        </Col>
        <Col span={18}>
          <Form
            {...layout}
            name="transactionForm"
            form={transactionForm}
            validateMessages={validateMessages}
          >
            <Form.Item label="Tran Code" style={{ marginBottom: 0 }}>
              <Form.Item
                name={["code"]}
                style={{ display: "inline-block", width: "calc(50% - 8px)" }}
              >
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name={["date"]}
                style={{
                  display: "inline-block",
                  width: "calc(50% - 8px)",
                  margin: "0 8px",
                }}
                rules={[{ required: true }]}
              >
                <DatePicker
                  allowClear={false}
                  format={APPLICATION_DATE_FORMAT}
                />
              </Form.Item>
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
          <br />
          <Form form={itemAddform} onFinish={onAddProduct}>
            <Form.Item label="Select a Item" style={{ marginBottom: 0 }}>
              <Form.Item
                name="productId"
                rules={[{ required: true }]}
                style={{ display: "inline-block", width: "calc(30% - 8px)" }}
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
                rules={[
                  { required: true, message: "Please input your Quantity!" },
                ]}
                style={{
                  display: "inline-block",
                  width: "calc(15% - 8px)",
                  margin: "0 8px",
                }}
              >
                <InputNumber placeholder="Quantity" />
              </Form.Item>
              <Form.Item
                shouldUpdate
                style={{ display: "inline-block", width: "calc(30% - 8px)" }}
              >
                {() => (
                  <Button type="primary" htmlType="submit">
                    <PlusOutlined /> Add
                  </Button>
                )}
              </Form.Item>
            </Form.Item>

            <br />
            <Table
              size="small"
              pagination={false}
              dataSource={populatedTransactionItems}
              columns={columns}
            />
            <Form.Item name="submitButton">
              <Button
                onClick={onCreateTransaction}
                type="primary"
                htmlType="button"
              >
                {formActionButtonText}
              </Button>
            </Form.Item>
            <Form.Item name="addNewButton">
              <Button type="primary" htmlType="button">
                Add New
              </Button>
            </Form.Item>
            <Form.Item name="resetButton">
              <Button type="default" htmlType="button">
                Add New
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
