import { CheckCircleTwoTone } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Popconfirm, Row, Select, Space, Spin, Switch, Table } from 'antd';
import { Option } from 'antd/es/mentions';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const Supplier: React.FC = () => {
    var [tableLoadingSpin, setTableSpinLoading] = useState(false);

    interface Supplier {
        id: number;
        code: string;
        name: string;
        openingBalance: number;
        openingDate: Date;
        companyName: string;
        description: string;
        address: string;
        email: string;
        gender: string;
        contactPersonName: string;
        contactPersonPhone: string;
        remarks: string;
        activeStatus: boolean;
        mobile1: string;
        mobile2: string;
        createdDate: Date;
        lastModifiedDate: Date;
    }

    const dateFormat = 'DD-MMM-YYYY';
    const [supplierForm] = Form.useForm();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [supplier, setSupplier] = useState<Supplier>();
    const [supplierId, setSupplierId] = useState<number>();
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    // Modal related properties
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setmodalState] = useState('CREATE');
    const [modalOkButtonText, setModalOkButtonText] = useState('Create');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


    useEffect(() => {

        getSuppliers();

        return () => {

        }
    }, []);

    const getSuppliers = () => {
        setTableSpinLoading(true);
        axios.get(`http://localhost:8081/suppliers/all-supplier-details`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                })
                setSuppliers(response.data);
                setTableSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setTableSpinLoading(false);
            });
    }

    const getSupplier = (id: number) => {
        axios.get(`http://localhost:8081/suppliers/${id}`)
            .then((response) => {
                console.log(response.data);
                setSupplier(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

    useEffect(() => {
        console.log(new Date());

        if (modalState === 'CREATE') {
            setModalOkButtonText('Create');
            setIsFormDisabled(false);
            setSupplierId(0);
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
        supplierForm.resetFields();
        supplierForm.setFieldsValue(
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
            const values = await supplierForm.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const modalFormSubmit = async () => {

        try {
            const values = await supplierForm.validateFields();
            console.log('Success:', values);
            checkFormValidation();
            setModalConfirmLoading(true);

            if (modalState === 'CREATE') {
                axios.post(`http://localhost:8081/suppliers`, {
                    code: supplierForm.getFieldValue('code'),
                    name: supplierForm.getFieldValue('name'),
                    openingBalance: supplierForm.getFieldValue('openingBalance'),
                    openingDate: supplierForm.getFieldValue('openingDate'),
                    companyName: supplierForm.getFieldValue('companyName'),
                    description: supplierForm.getFieldValue('description'),
                    address: supplierForm.getFieldValue('address'),
                    email: supplierForm.getFieldValue('email'),
                    gender: supplierForm.getFieldValue('gender'),
                    contactPersonName: supplierForm.getFieldValue('contactPersonName'),
                    contactPersonPhone: supplierForm.getFieldValue('contactPersonPhone'),
                    remarks: supplierForm.getFieldValue('remarks'),
                    activeStatus: supplierForm.getFieldValue('activeStatus'),
                    mobile1: supplierForm.getFieldValue('mobile1'),
                    mobile2: supplierForm.getFieldValue('mobile2'),

                }).then((response) => {
                    setModalOpen(false);
                    clearModalField();
                    setModalConfirmLoading(false);
                    getSuppliers();
                    console.log(response);
                }).catch(err => {
                    // Handle error
                    console.log("server error");
                    setModalConfirmLoading(false);
                });
            } else {
                axios.put(`http://localhost:8081/suppliers/${supplierId}`, {
                    code: supplierForm.getFieldValue('code'),
                    name: supplierForm.getFieldValue('name'),
                    openingBalance: supplierForm.getFieldValue('openingBalance'),
                    openingDate: supplierForm.getFieldValue('openingDate'),
                    companyName: supplierForm.getFieldValue('companyName'),
                    description: supplierForm.getFieldValue('description'),
                    address: supplierForm.getFieldValue('address'),
                    email: supplierForm.getFieldValue('email'),
                    gender: supplierForm.getFieldValue('gender'),
                    contactPersonName: supplierForm.getFieldValue('contactPersonName'),
                    contactPersonPhone: supplierForm.getFieldValue('contactPersonPhone'),
                    remarks: supplierForm.getFieldValue('remarks'),
                    activeStatus: supplierForm.getFieldValue('activeStatus'),
                    mobile1: supplierForm.getFieldValue('mobile1'),
                    mobile2: supplierForm.getFieldValue('mobile2'),

                }).then((response) => {
                    clearModalField();
                    setModalOpen(false);
                    setModalConfirmLoading(false);
                    getSuppliers();
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
    const supplierColumns: ColumnsType<Supplier> = [
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
            title: 'Mobile1',
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
            render: (_: any, record: Supplier) => {
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
                        <a onClick={() => deleteSupplierAction(record.id)}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const deletePopConfirm = (e: any) => {
        axios.delete(`http://localhost:8081/suppliers/${supplierId}`)
            .then((response) => {
                getSuppliers();
                message.success('Deleted Successfully.');
            }).catch(err => {
                console.log("server error", err);
            });
    };

    const deletePopCancel = (e: any) => {
        console.log(e);
    };

    const updateAction = (id: number) => {

        setSupplierId(id);
        setmodalState('UPDATE');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/suppliers/${id}`)
            .then((response) => {
                supplierForm.setFieldsValue({
                    name: response.data.name,
                    code: response.data.code,
                    openingBalance: response.data.openingBalance,
                    openingDate: dayjs(moment
                        .utc(response.data.openingDate)
                        .local()
                        .format('DD-MMM-YYYY'), dateFormat),
                    companyName: response.data.companyName,
                    description: response.data.description,
                    address: response.data.address,
                    email: response.data.email,
                    gender: response.data.gender,
                    contactPersonName: response.data.contactPersonName,
                    contactPersonPhone: response.data.contactPersonPhone,
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

    const deleteSupplierAction = (id: number) => {
        setSupplierId(id);
    }

    const viewAction = (id: number) => {
        setSupplierId(id);
        setmodalState('VIEW');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/suppliers/${id}`)
            .then((response) => {

                supplierForm.setFieldsValue({
                    name: response.data.name,
                    code: response.data.code,
                    openingBalance: response.data.openingBalance,
                    openingDate: dayjs(moment
                        .utc(response.data.openingDate)
                        .local()
                        .format('DD-MMM-YYYY'), dateFormat),
                    companyName: response.data.companyName,
                    description: response.data.description,
                    address: response.data.address,
                    email: response.data.email,
                    gender: response.data.gender,
                    contactPersonName: response.data.contactPersonName,
                    contactPersonPhone: response.data.contactPersonPhone,
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
                        <Title level={2}>Supplier</Title>

                        <Button type="primary" onClick={showModal}>Create</Button>
                        <Table
                            loading={tableLoadingSpin}
                            size="small"
                            dataSource={suppliers}
                            columns={supplierColumns}
                        />

                        <Modal
                            title="Supplier"
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

                                        name="supplierForm"
                                        form={supplierForm}
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
                                            label="Opening Balance"
                                            name="openingBalance"
                                        >
                                            <InputNumber />
                                        </Form.Item>
                                        <Form.Item
                                            label="Opening Date"
                                            name="openingDate"
                                        >
                                            <DatePicker
                                                allowClear={false}
                                                format={dateFormat}
                                            // defaultValue={moment()}
                                            // defaultValue={dayjs(
                                            //     moment
                                            //         .utc()
                                            //         .local()
                                            //         .format('DD-MMM-YYYY')
                                            //     , dateFormat)}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Company Name"
                                            name="companyName"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="email"
                                            name="email"
                                            rules={[{ type: 'email' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Gender"
                                            name="gender"
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
                                            label="Contact Person Name"
                                            name="contactPersonName"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Contact Person Phone"
                                            name="contactPersonPhone"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Mobile1"
                                            name="mobile1"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Mobile2"
                                            name="mobile2"
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Active Status"
                                            name="activeStatus"
                                            valuePropName="checked"
                                        >
                                            <Switch />
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

export default Supplier;