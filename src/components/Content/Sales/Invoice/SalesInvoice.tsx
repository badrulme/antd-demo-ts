import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Col,
    DatePicker, Form,
    Input,
    InputNumber,
    List, Row,
    Select,
    Skeleton,
    Spin,
    Switch,
    Table,
    Typography
} from "antd";
import Title from "antd/es/typography/Title";
import axios from "axios";
import dayjs from "dayjs";
import moment from "moment";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { getProducts } from "../../../../actions/ProductAction";
import { getCustomers } from "../../../../actions/CustomerAction";
import { deleteTransaction, getTransaction, getTransactionBasicList } from "../../../../actions/TransactionAction";
import ApiServicePath from "../../../../enums/ApiServicePath";
import ListOperationType from "../../../../enums/ListOperationType";
import TransactionFormState from "../../../../enums/TransactionFormState";
import TransactionType from "../../../../enums/TransactionType";
import IProduct from "../../../../interfaces/Product";
import ICustomer from "../../../../interfaces/Customer";
import ITransactionBasic from "../../../../interfaces/TransactionBasic";
import ITransactionItem from "../../../../interfaces/TransactionItem";
import { API_URL, APPLICATION_DATE_FORMAT } from "../../../../settings";
type Props = {};


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: ITransactionItem;
    index: number;
    children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};



export default function SalesInvoice({ }: Props) {
    const [loadingTransactionList, setLoadingTransactionList] = useState(false);

    const [transactionBasicList, setTransactionBasicList] = useState<
        ITransactionBasic[]
    >([]);

    const [populatedTransactionItems, setPopulatedTransactionItems] = useState<
        ITransactionItem[]
    >([]);
    const [products, setProducts] = useState<IProduct[]>();
    const [customers, setCustomers] = useState<ICustomer[]>();
    const [transactionId, setTransactionId] = useState<number>(0);
    const [formState, setFormState] = useState(TransactionFormState.CREATE);
    const [formActionButtonText, setFormActionButtonText] = useState("Create");

    // Page related
    const [pageNo, setPageNo] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [collectedElements, setCollectedElements] = useState<number>(0);

    const [itemAddform] = Form.useForm();
    const [transactionForm] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

    const [transactionItemForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState<string>('');
    const isEditing = (record: ITransactionItem) => record.key === editingKey;

    const edit = (record: Partial<ITransactionItem> & { key: React.Key }) => {
        transactionItemForm.setFieldsValue({ code: '', name: '', receiveQuantity: '', ...record });
        setEditingKey(record.key);
    };

    const deleteItem = (record: Partial<ITransactionItem> & { key: React.Key }) => {
        setPopulatedTransactionItems((prevState) => prevState.filter(x => x.key != record.key));
    };

    const cancelItemEditing = () => {
        setEditingKey('');
    };

    const resetTransactionScreen = () => {
        setTransactionId(0);
        setFormState(TransactionFormState.CREATE);
        resetTransactionForm();
        resetItemAddform();
        resetTransactionItemForm();
        setPopulatedTransactionItems([]);
    }

    const resetTransactionItemForm = () => {
        transactionItemForm.resetFields();
    }

    const validateTransactionForm = async () => {
        const values = await transactionForm.validateFields();
    }
    const save = async (key: React.Key) => {
        try {
            const row = (await transactionItemForm.validateFields()) as ITransactionItem;

            const newData = [...populatedTransactionItems];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setPopulatedTransactionItems(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setPopulatedTransactionItems(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };


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

    const getCustomerList = async () => {
        try {
            const { data } = await getCustomers();
            data.map((x: { [x: string]: any; id: any }) => {
                x["key"] = x.id;
                x["value"] = x.id;
                x["label"] = "[" + x.code + "] " + x.name;
            });
            setCustomers(data);
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
            title: "Quantity",
            dataIndex: "issueQuantity",
            key: "issueQuantity",
            editable: true,
            render: (_: any, record: ITransactionItem) => record.receiveQuantity,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: any, record: ITransactionItem) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Typography.Link onClick={cancelItemEditing}>
                            Cancel
                        </Typography.Link>
                    </span>
                ) : (
                    <span>
                        <Typography.Link disabled={editingKey !== ''} style={{ marginRight: 8 }} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        <Typography.Link disabled={editingKey !== ''} onClick={() => deleteItem(record)}>
                            Delete
                        </Typography.Link>
                    </span>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ITransactionItem) => ({
                record,
                inputType: col.dataIndex === 'receiveQuantity' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const deleteTransactionEntity = async () => {
        await deleteTransaction(transactionId);
        setTransactionBasicList((prevState) => prevState.filter(x => x.id !== transactionId));
        setTransactionId(0);
    }

    const getTransactionDetails = async (id: number) => {
        try {
            setLoading(true);
            const { data } = await getTransaction(id);

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
                customerId: data.customerId,
                postingStatus: data.postingStatus,
            });

            let items = data.transactionItems.map((element: any) => {
                element["key"] = element.productId;
                return element;
            });

            setPopulatedTransactionItems(items);
            setFormState(TransactionFormState.UPDATE);
            setLoading(false);
        } catch (error) {
            setLoading(false);
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
                `${API_URL}/${ApiServicePath.Transaction}/basic-list?transactionTypeId=${TransactionType.SALES_INVOICE}&pageNo=${pageNo}`
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

        getProductList();
        getCustomerList();
        loadTransactionList();
        resetTransactionScreen();
        if (transactionBasicList.length > 0) {
            setTransactionId(transactionBasicList[0].id);
        }

    }, []);

    const addNew = () => {
        resetTransactionScreen()
    }

    const resetItemAddform = () => {
        itemAddform.resetFields();
    }

    useEffect(() => {
        if (formState === TransactionFormState.CREATE) {
            setFormActionButtonText("Create");
        } else if (formState === TransactionFormState.UPDATE) {
            setFormActionButtonText("Change");
        }
        return () => { };
    }, [formState]);


    const onCreateTransaction = async () => {
        try {
            setLoading(true);
            await transactionForm.validateFields();
            if (formState === TransactionFormState.CREATE) {
                axios
                    .post(`${API_URL}/${ApiServicePath.Transaction}`, {
                        date: transactionForm.getFieldValue("date"),
                        transactionTypeId: TransactionType.SALES_INVOICE,
                        description: transactionForm.getFieldValue("description"),
                        customerId: transactionForm.getFieldValue("customerId"),
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

                        setLoading(false);

                    })
                    .catch((err) => {
                        setLoading(false);
                        console.log("server error", err);
                    });
            } else if (formState === TransactionFormState.UPDATE) {
                axios
                    .put(`${API_URL}/${ApiServicePath.Transaction}/${transactionId}`, {
                        date: transactionForm.getFieldValue("date"),
                        transactionTypeId: TransactionType.SALES_INVOICE,
                        customerId: transactionForm.getFieldValue("customerId"),
                        description: transactionForm.getFieldValue("description"),
                        postingStatus: transactionForm.getFieldValue("postingStatus"),
                        transactionItems: populatedTransactionItems,
                    })
                    .then((response) => {
                        setTransactionId(response.data.id);
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                        console.log("server error", err);
                    });
            }
        } catch (e) {
            setLoading(false);
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
                id: null,
                key: currentProductId
            };

            setPopulatedTransactionItems((items) => [
                ...items, obj,
            ]);
        }
        resetItemAddform();
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

        if (transactionId !== 0) {
            getTransactionDetails(transactionId);
            setEditingKey('');
            resetItemAddform();
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
                    <Title level={4}>Sales Invoice</Title>
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
                            scrollableTarget="scrollableDiv"
                        >
                            <List
                                dataSource={transactionBasicList}
                                renderItem={(transaction) => (
                                    <List.Item onClick={() => onSelectTransaction(transaction.id)}
                                        key={transaction.id}
                                        className={`cursor-pointer ${transaction.id === transactionId ? "transaction-item-highlight" : ""} `}
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
                    <Spin indicator={antIcon} spinning={loading}>
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
                                label="Customer"
                                name="customerId"
                                rules={[{ required: true }]}
                            >
                                <Select
                                    showSearch={true}
                                    allowClear={true}
                                    placeholder="Select a Customer"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.name ?? "")
                                            .toLowerCase()
                                            .includes(input.toLowerCase()) ||
                                        (option?.code ?? "")
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
                                    style={{ display: "inline-block", width: "calc(50% - 8px)" }}
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
                                        <Button
                                            type="primary" htmlType="submit"
                                            disabled={
                                                !itemAddform.isFieldsTouched()
                                            }>
                                            <PlusOutlined />
                                        </Button>
                                    )}
                                </Form.Item>
                            </Form.Item>

                            <br />
                            <Form form={transactionItemForm} component={false}>
                                <Table
                                    components={{
                                        body: {
                                            cell: EditableCell,
                                        },
                                    }}
                                    size="small"
                                    rowClassName="editable-row"
                                    dataSource={populatedTransactionItems}
                                    columns={mergedColumns}
                                    pagination={{
                                        onChange: cancelItemEditing,
                                    }}
                                />
                            </Form>
                            <Form.Item name="submitButton">
                                <Button
                                    onClick={onCreateTransaction}
                                    type="primary"
                                    htmlType="button"
                                    disabled={editingKey !== ''}
                                >
                                    {formActionButtonText}
                                </Button>
                            </Form.Item>
                            <Form.Item name="addNewButton">
                                <Button disabled={editingKey !== '' || transactionId < 1} onClick={addNew} type="default" htmlType="button">
                                    Add New
                                </Button>
                            </Form.Item>
                            {
                                formState !== TransactionFormState.CREATE &&
                                <Form.Item name="resetButton">
                                    <Button disabled={(editingKey !== '' || transactionId < 1)} onClick={deleteTransactionEntity} danger type="default" htmlType="button">
                                        Delete
                                    </Button>
                                </Form.Item>
                            }
                        </Form>
                    </Spin>
                </Col>
            </Row>
        </>
    );
}
