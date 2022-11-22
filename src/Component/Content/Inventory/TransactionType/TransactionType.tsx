import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Spin, Table } from 'antd';
import { Option } from 'antd/es/mentions';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';


const TransactionType: React.FC = () => {
    var [tableLoadingSpin, setTableSpinLoading] = useState(false);

    interface TransactionType {
        id: number;
        name: string;
        alias: string;
        description: string;
        transactionFlow: string;
        createdDate: string;
        lastModifiedDate: string;
    }

    const [transactionTypeForm] = Form.useForm();
    const [transactionTypes, setTransactionTypes] = useState<TransactionType[]>([]);
    const [transactionType, setTransactionType] = useState<TransactionType>();
    const [transactionTypeId, setTransactionTypeId] = useState<number>();
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    // Modal related properties
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setmodalState] = useState('CREATE');
    const [modalOkButtonText, setModalOkButtonText] = useState('Create');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


    useEffect(() => {

        getTransactionTypes();

        return () => {

        }
    }, []);

    const getTransactionTypes = () => {
        setTableSpinLoading(true);
        axios.get(`http://localhost:8081/transactionTypes`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                })
                setTransactionTypes(response.data);
                setTableSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setTableSpinLoading(false);
            });
    }

    const getTransactionType = (id: number) => {
        axios.get(`http://localhost:8081/transactionTypes/${id}`)
            .then((response) => {
                console.log(response.data);
                setTransactionType(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

    useEffect(() => {
        if (modalState === 'CREATE') {
            setModalOkButtonText('Create');
            setIsFormDisabled(false);
            setTransactionTypeId(0);
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

        transactionTypeForm.setFieldsValue({
            name: '',
            alias: '',
            description: '',
            transactionFlow: ''
        });
    }

    const checkFormValidation = async () => {
        try {
            const values = await transactionTypeForm.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const modalFormSubmit = async () => {

        try {
            const values = await transactionTypeForm.validateFields();
            console.log('Success:', values);
            checkFormValidation();
            setModalConfirmLoading(true);

            if (modalState === 'CREATE') {
                axios.post(`http://localhost:8081/transactionTypes`, {
                    name: transactionTypeForm.getFieldValue('name'),
                    alias: transactionTypeForm.getFieldValue('alias'),
                    description: transactionTypeForm.getFieldValue('description'),
                    transactionFlow: transactionTypeForm.getFieldValue('transactionFlow')

                }).then((response) => {
                    setModalOpen(false);
                    clearModalField();
                    setModalConfirmLoading(false);
                    getTransactionTypes();
                    console.log(response);
                }).catch(err => {
                    // Handle error
                    console.log("server error");
                    setModalConfirmLoading(false);
                });
            } else {
                axios.put(`http://localhost:8081/transactionTypes/${transactionTypeId}`, {
                    name: transactionTypeForm.getFieldValue('name'),
                    alias: transactionTypeForm.getFieldValue('alias'),
                    description: transactionTypeForm.getFieldValue('description'),
                    transactionFlow: transactionTypeForm.getFieldValue('transactionFlow')

                }).then((response) => {
                    clearModalField();
                    setModalOpen(false);
                    setModalConfirmLoading(false);
                    getTransactionTypes();
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
    const transactionTypeColumns: ColumnsType<TransactionType> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Alias',
            dataIndex: 'alias',
            key: 'alias',
        },
        {
            title: 'Flow',
            dataIndex: 'transactionFlow',
            key: 'transactionFlow',
            render: (_: any, record: TransactionType) => {
                if (record.transactionFlow === 'OUT') {
                    return (
                        <span>
                            <ArrowDownOutlined /> {record.transactionFlow}
                        </span>
                    )
                } else {
                    return (
                        <span>
                            <ArrowUpOutlined />  {record.transactionFlow}
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
                    .format('DD-MM-YYYY')
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
                    .format('DD-MM-YYYY')
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
                        <a onClick={() => deleteTransactionTypeAction(record.id)}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const deletePopConfirm = (e: any) => {
        axios.delete(`http://localhost:8081/transactionTypes/${transactionTypeId}`)
            .then((response) => {
                getTransactionTypes();
                message.success('Deleted Successfully.');
            }).catch(err => {
                console.log("server error", err);
            });
    };

    const deletePopCancel = (e: any) => {
        console.log(e);
    };

    const updateAction = (id: number) => {

        setTransactionTypeId(id);
        setmodalState('UPDATE');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/transactionTypes/${id}`)
            .then((response) => {

                transactionTypeForm.setFieldsValue({
                    name: response.data.name,
                    alias: response.data.alias,
                    description: response.data.description,
                    transactionFlow: response.data.transactionFlow
                });

                setModalSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setModalSpinLoading(false);
            });
    }

    const deleteTransactionTypeAction = (id: number) => {
        setTransactionTypeId(id);
    }

    const viewAction = (id: number) => {
        setTransactionTypeId(id);
        setmodalState('VIEW');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/transactionTypes/${id}`)
            .then((response) => {

                transactionTypeForm.setFieldsValue({
                    name: response.data.name,
                    alias: response.data.alias,
                    description: response.data.description,
                    transactionFlow: response.data.transactionFlow
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
                        <Title level={2}>Transaction Type</Title>

                        <Button type="primary" onClick={showModal}>Create</Button>
                        <Table
                            loading={tableLoadingSpin}
                            size="small"
                            dataSource={transactionTypes}
                            columns={transactionTypeColumns} />

                        <Modal
                            title="Transaction Type"
                            open={modalOpen}
                            onOk={modalFormSubmit}
                            confirmLoading={modalConfirmLoading}
                            onCancel={handleCancel}
                            okText={modalOkButtonText}
                            okButtonProps={{ disabled: isFormDisabled }}
                        >
                            <Spin spinning={modalLoadingSpin}>

                                <div>
                                    <Form
                                        name="transactionTypeForm"
                                        form={transactionTypeForm}
                                        labelCol={{ span: 8 }}
                                        wrapperCol={{ span: 16 }}
                                        initialValues={{ remember: true }}
                                        autoComplete="off"
                                        disabled={isFormDisabled}
                                    >
                                        <Form.Item
                                            label="Name"
                                            name="name"
                                            rules={[{ required: true, message: 'Name can not be null!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Alias"
                                            name="alias"
                                            rules={[{ required: true, message: 'Alias can not be null!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name="transactionFlow" label="Flow" rules={[{ required: true }]}>
                                            <Select
                                                placeholder="Select a option"
                                                allowClear={false}
                                            >
                                                <Option value="IN">IN (+)</Option>
                                                <Option value="OUT">OUT (-)</Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            name="description"
                                            label="Description">
                                            <Input.TextArea />
                                        </Form.Item>
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

export default TransactionType;