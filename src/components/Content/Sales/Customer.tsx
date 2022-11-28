import { CheckCircleTwoTone } from '@ant-design/icons';
import { Button, Col, Collapse, DatePicker, Form, Input, InputNumber, message, Modal, Popconfirm, Row, Select, Space, Spin, Switch, Table } from 'antd';
import { Option } from 'antd/es/mentions';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ICustomer from '../../../interfaces/Customer';

const { Panel } = Collapse;

const Customer: React.FC = () => {
    var [tableLoadingSpin, setTableSpinLoading] = useState(false);
    const dateFormat = 'DD-MMM-YYYY';



    const [customerForm] = Form.useForm();
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [customer, setCustomer] = useState<ICustomer>();
    const [customerId, setCustomerId] = useState<number>();
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    // Modal related properties
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setmodalState] = useState('CREATE');
    const [modalOkButtonText, setModalOkButtonText] = useState('Create');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


    useEffect(() => {

        getCustomers();

        return () => {

        }
    }, []);

    const getCustomers = () => {
        setTableSpinLoading(true);
        axios.get(`http://localhost:8081/customers/all-customer-details`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                })
                setCustomers(response.data);
                setTableSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setTableSpinLoading(false);
            });
    }

    const getCustomer = (id: number) => {
        axios.get(`http://localhost:8081/customers/${id}`)
            .then((response) => {
                console.log(response.data);
                setCustomer(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

    useEffect(() => {
        if (modalState === 'CREATE') {
            setModalOkButtonText('Create');
            setIsFormDisabled(false);
            setCustomerId(0);
        } else if (modalState === 'VIEW') {
            setModalOkButtonText('Change');
            setIsFormDisabled(true);
        } else {
            setModalOkButtonText('Change');
            setIsFormDisabled(false);
        }

        return () => {
        }
    }, [modalState])


    const showModal = () => {
        clearModalField();
        setModalOpen(true);
    };

    const clearModalField = () => {
        customerForm.resetFields();
        customerForm.setFieldsValue(
            {
                'gender': 'MALE',
                'openingBalance': 0,
                'activeStatus': true,
                'openingDate': dayjs(
                    moment
                        .utc()
                        .local()
                        .format('DD-MMM-YYYY')
                    , dateFormat)
            }
        )
    }

    const checkFormValidation = async () => {
        try {
            const values = await customerForm.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const modalFormSubmit = async () => {

        try {
            const values = await customerForm.validateFields();
            console.log('Success:', values);
            checkFormValidation();
            setModalConfirmLoading(true);

            if (modalState === 'CREATE') {
                axios.post(`http://localhost:8081/customers`, {
                    code: customerForm.getFieldValue('code'),
                    name: customerForm.getFieldValue('name'),
                    openingBalance: customerForm.getFieldValue('openingBalance'),
                    openingDate: customerForm.getFieldValue('openingDate'),
                    companyName: customerForm.getFieldValue('companyName'),
                    description: customerForm.getFieldValue('description'),
                    address: customerForm.getFieldValue('address'),
                    email: customerForm.getFieldValue('email'),
                    gender: customerForm.getFieldValue('gender'),
                    remarks: customerForm.getFieldValue('remarks'),
                    activeStatus: customerForm.getFieldValue('activeStatus'),
                    mobile1: customerForm.getFieldValue('mobile1'),
                    mobile2: customerForm.getFieldValue('mobile2'),

                }).then((response) => {
                    setModalOpen(false);
                    clearModalField();
                    setModalConfirmLoading(false);
                    getCustomers();
                    console.log(response);
                }).catch(err => {
                    // Handle error
                    console.log("server error");
                    setModalConfirmLoading(false);
                });
            } else {
                axios.put(`http://localhost:8081/customers/${customerId}`, {
                    code: customerForm.getFieldValue('code'),
                    name: customerForm.getFieldValue('name'),
                    openingBalance: customerForm.getFieldValue('openingBalance'),
                    openingDate: customerForm.getFieldValue('openingDate'),
                    companyName: customerForm.getFieldValue('companyName'),
                    description: customerForm.getFieldValue('description'),
                    address: customerForm.getFieldValue('address'),
                    email: customerForm.getFieldValue('email'),
                    gender: customerForm.getFieldValue('gender'),
                    remarks: customerForm.getFieldValue('remarks'),
                    activeStatus: customerForm.getFieldValue('activeStatus'),
                    mobile1: customerForm.getFieldValue('mobile1'),
                    mobile2: customerForm.getFieldValue('mobile2'),

                }).then((response) => {
                    clearModalField();
                    setModalOpen(false);
                    setModalConfirmLoading(false);
                    getCustomers();
                    console.log(response);
                    setmodalState('CREATE');
                }).catch(err => {
                    // Handle error
                    console.log("server error");
                    setModalConfirmLoading(false);
                });
            }
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }



    };

    const handleCancel = () => {
        setModalOpen(false);
        setModalSpinLoading(false);
        setmodalState('CREATE');
    };


    // table rendering settings
    const customerColumns: ColumnsType<ICustomer> = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Mobile No',
            dataIndex: 'mobile1',
            key: 'mobile1',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, record: ICustomer) => {
                if (record.activeStatus) {
                    return (
                        <span>
                            <CheckCircleTwoTone twoToneColor="#52c41a" /> Active
                        </span>
                    )
                } else {
                    return (
                        <span>
                            <CheckCircleTwoTone twoToneColor="#eb2f96" /> InActive
                        </span>
                    )
                }

            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (_, record) => (
                moment
                    .utc(record.createdDate)
                    .local()
                    .format(dateFormat)
            )
        },
        {
            title: 'Last Modified Date',
            dataIndex: 'lastModifiedDate',
            key: 'lastModifiedDate',
            render: (_, record) => (
                moment
                    .utc(record.lastModifiedDate)
                    .local()
                    .format(dateFormat)
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => viewAction(record.id)}>View</a>
                    <a onClick={() => updateAction(record.id)}>Update</a>
                    <Popconfirm
                        title="Are you sure to delete this record?"
                        onConfirm={deletePopConfirm}
                        onCancel={deletePopCancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a onClick={() => deleteCustomerAction(record.id)}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const deletePopConfirm = (e: any) => {
        axios.delete(`http://localhost:8081/customers/${customerId}`)
            .then((response) => {
                getCustomers();
                message.success('Deleted Successfully.');
            }).catch(err => {
                console.log("server error", err);
            });
    };

    const deletePopCancel = (e: any) => {
        console.log(e);
    };

    const updateAction = (id: number) => {

        setCustomerId(id);
        setmodalState('UPDATE');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/customers/${id}`)
            .then((response) => {
                customerForm.setFieldsValue({
                    name: response.data.name,
                    code: response.data.code,
                    openingBalance: response.data.openingBalance,
                    openingDate: dayjs(moment
                        .utc(response.data.openingDate)
                        .local()
                        .format(dateFormat), dateFormat),
                    companyName: response.data.companyName,
                    description: response.data.description,
                    address: response.data.address,
                    email: response.data.email,
                    gender: response.data.gender,
                    remarks: response.data.remarks,
                    activeStatus: response.data.activeStatus,
                    mobile1: response.data.mobile1,
                    mobile2: response.data.mobile2,
                });

                setModalSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error", err);
                setModalSpinLoading(false);
            });
    }

    const deleteCustomerAction = (id: number) => {
        setCustomerId(id);
    }

    const viewAction = (id: number) => {
        setCustomerId(id);
        setmodalState('VIEW');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/customers/${id}`)
            .then((response) => {

                customerForm.setFieldsValue({
                    name: response.data.name,
                    code: response.data.code,
                    openingBalance: response.data.openingBalance,
                    openingDate: dayjs(moment
                        .utc(response.data.openingDate)
                        .local()
                        .format(dateFormat), dateFormat),
                    companyName: response.data.companyName,
                    description: response.data.description,
                    address: response.data.address,
                    email: response.data.email,
                    gender: response.data.gender,
                    remarks: response.data.remarks,
                    activeStatus: response.data.activeStatus,
                    mobile1: response.data.mobile1,
                    mobile2: response.data.mobile2,
                });

                setModalSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setModalSpinLoading(false);
            });
    }

    return (
        <>
            <Row>
                <Col md={24}>

                    <div>
                        <Title level={2}>Customer</Title>

                        <Button type="primary" onClick={showModal}>Create</Button>
                        <Table
                            loading={tableLoadingSpin}
                            size="small"
                            dataSource={customers}
                            columns={customerColumns}
                        />

                        <Modal
                            title="Customer"
                            open={modalOpen}
                            onOk={modalFormSubmit}
                            confirmLoading={modalConfirmLoading}
                            onCancel={handleCancel}
                            okText={modalOkButtonText}
                            okButtonProps={{ disabled: isFormDisabled }}
                            centered={true}
                        >
                            <Spin spinning={modalLoadingSpin}>

                                <div>
                                    <Form

                                        name="customerForm"
                                        form={customerForm}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                        initialValues={{ remember: true }}
                                        autoComplete="off"
                                        disabled={isFormDisabled}
                                    >
                                        <Form.Item
                                            label="Code"
                                            name="code"
                                            rules={[{ required: true, message: 'Code can not be null!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Name"
                                            name="name"
                                            rules={[{ required: true, message: 'Name can not be null!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Mobile No"
                                            name="mobile1"
                                        >
                                            <Input />
                                        </Form.Item>


                                        <Form.Item
                                            label="Gender"
                                            name="gender"
                                            rules={[{ required: true, message: 'Gender can not be null!' }]}
                                        >
                                            <Select
                                                placeholder="Select a option"
                                                allowClear={false}
                                            >
                                                <Option value="MALE">Male</Option>
                                                <Option value="FEMALE">Female</Option>
                                            </Select>
                                        </Form.Item>


                                        <Form.Item
                                            label="Active Status"
                                            name="activeStatus"
                                            valuePropName="checked"
                                        >
                                            <Switch />
                                        </Form.Item>
                                        <Collapse ghost>
                                            <Panel header="Show More Fields" key="1">
                                                <Form.Item
                                                    label="Opening Balance"
                                                    name="openingBalance"
                                                    rules={[{ required: true, message: 'Opening Balance can not be null!' }]}
                                                >
                                                    <InputNumber />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Opening Date"
                                                    name="openingDate"
                                                    rules={[{ required: true, message: 'Opening Date can not be null!' }]}

                                                >
                                                    <DatePicker
                                                        allowClear={false}
                                                        format={dateFormat}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Phone Home"
                                                    name="mobile2"
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Company Name"
                                                    name="companyName"
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item rules={[{ type: 'email' }]}
                                                    label="email"
                                                    name="email"
                                                >
                                                    <Input />
                                                </Form.Item>

                                                <Form.Item
                                                    name="remarks"
                                                    label="remarks">
                                                    <Input.TextArea />
                                                </Form.Item>
                                                <Form.Item
                                                    name="description"
                                                    label="Description">
                                                    <Input.TextArea />
                                                </Form.Item>
                                                <Form.Item
                                                    name="address"
                                                    label="Address">
                                                    <Input.TextArea />
                                                </Form.Item>
                                            </Panel>

                                        </Collapse>
                                    </Form>
                                </div>
                            </Spin>
                        </Modal>
                    </div>
                </Col>
            </Row>

        </>
    )
}

export default Customer;