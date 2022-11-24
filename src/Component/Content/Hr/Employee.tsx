import { CheckCircleTwoTone } from '@ant-design/icons';
import { Button, Col, Collapse, DatePicker, Form, Input, InputNumber, message, Modal, Popconfirm, Row, Select, Space, Spin, Switch, Table } from 'antd';
import { Option } from 'antd/es/mentions';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
const { Panel } = Collapse;

const Employee: React.FC = () => {
    var [tableLoadingSpin, setTableSpinLoading] = useState(false);

    interface Employee {
        id: number;
        code: string;
        firstName: string;
        lastName: string;
        emailOfficial: string;
        emailPersonal: string;
        phonePersonal: string;
        phoneOfficial: string;
        presentAddress: string;
        permanentAddress: string;
        dob: Date;
        bloodGroup: string;
        jobTitleId: number;
        gender: string;
        activeStatus: boolean;
        createdDate: Date;
        lastModifiedDate: Date;
    }

    const dateFormat = 'DD-MMM-YYYY';
    const [employeeForm] = Form.useForm();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employee, setEmployee] = useState<Employee>();
    const [employeeId, setEmployeeId] = useState<number>();
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    // Modal related properties
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setmodalState] = useState('CREATE');
    const [modalOkButtonText, setModalOkButtonText] = useState('Create');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


    useEffect(() => {

        getEmployees();

        return () => {

        }
    }, []);

    const getEmployees = () => {
        setTableSpinLoading(true);
        axios.get(`http://localhost:8081/employees/all-employee-details`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                })
                setEmployees(response.data);
                setTableSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setTableSpinLoading(false);
            });
    }

    const getEmployee = (id: number) => {
        axios.get(`http://localhost:8081/employees/${id}`)
            .then((response) => {
                console.log(response.data);
                setEmployee(response.data);
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
            setEmployeeId(0);
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
        employeeForm.resetFields();
        employeeForm.setFieldsValue(
            {
                'gender': 'MALE',
                'activeStatus': true,
            }
        )
    }

    const checkFormValidation = async () => {
        try {
            const values = await employeeForm.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const modalFormSubmit = async () => {

        try {
            const values = await employeeForm.validateFields();
            console.log('Success:', values);
            checkFormValidation();
            setModalConfirmLoading(true);

            if (modalState === 'CREATE') {
                axios.post(`http://localhost:8081/employees`, {
                    code: employeeForm.getFieldValue('code'),
                    firstName: employeeForm.getFieldValue('firstName'),
                    lastName: employeeForm.getFieldValue('lastName'),
                    gender: employeeForm.getFieldValue('gender'),
                    emailOfficial: employeeForm.getFieldValue('emailOfficial'),
                    emailPersonal: employeeForm.getFieldValue('emailPersonal'),
                    phonePersonal: employeeForm.getFieldValue('phonePersonal'),
                    phoneOfficial: employeeForm.getFieldValue('phoneOfficial'),
                    presentAddress: employeeForm.getFieldValue('presentAddress'),
                    permanentAddress: employeeForm.getFieldValue('permanentAddress'),
                    dob: employeeForm.getFieldValue('dob'),
                    activeStatus: employeeForm.getFieldValue('activeStatus'),
                    bloodGroup: employeeForm.getFieldValue('bloodGroup'),
                    jobTitleId: employeeForm.getFieldValue('jobTitleId'),

                }).then((response) => {
                    setModalOpen(false);
                    clearModalField();
                    setModalConfirmLoading(false);
                    getEmployees();
                    console.log(response);
                }).catch(err => {
                    // Handle error
                    console.log("server error");
                    setModalConfirmLoading(false);
                });
            } else {
                axios.put(`http://localhost:8081/employees/${employeeId}`, {
                    code: employeeForm.getFieldValue('code'),
                    firstName: employeeForm.getFieldValue('firstName'),
                    lastName: employeeForm.getFieldValue('lastName'),
                    gender: employeeForm.getFieldValue('gender'),
                    emailOfficial: employeeForm.getFieldValue('emailOfficial'),
                    emailPersonal: employeeForm.getFieldValue('emailPersonal'),
                    phonePersonal: employeeForm.getFieldValue('phonePersonal'),
                    phoneOfficial: employeeForm.getFieldValue('phoneOfficial'),
                    presentAddress: employeeForm.getFieldValue('presentAddress'),
                    permanentAddress: employeeForm.getFieldValue('permanentAddress'),
                    dob: employeeForm.getFieldValue('dob'),
                    activeStatus: employeeForm.getFieldValue('activeStatus'),
                    bloodGroup: employeeForm.getFieldValue('bloodGroup'),
                    jobTitleId: employeeForm.getFieldValue('jobTitleId'),

                }).then((response) => {
                    clearModalField();
                    setModalOpen(false);
                    setModalConfirmLoading(false);
                    getEmployees();
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
    const employeeColumns: ColumnsType<Employee> = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: Employee) => (record.firstName + " " + record.lastName)
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
            render: (_: any, record: Employee) => {
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
                        <a onClick={() => deleteEmployeeAction(record.id)}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const deletePopConfirm = (e: any) => {
        axios.delete(`http://localhost:8081/employees/${employeeId}`)
            .then((response) => {
                getEmployees();
                message.success('Deleted Successfully.');
            }).catch(err => {
                console.log("server error", err);
            });
    };

    const deletePopCancel = (e: any) => {
        console.log(e);
    };

    const updateAction = (id: number) => {

        setEmployeeId(id);
        setmodalState('UPDATE');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/employees/${id}`)
            .then((response) => {
                employeeForm.setFieldsValue({
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

    const deleteEmployeeAction = (id: number) => {
        setEmployeeId(id);
    }

    const viewAction = (id: number) => {
        setEmployeeId(id);
        setmodalState('VIEW');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/employees/${id}`)
            .then((response) => {

                employeeForm.setFieldsValue({
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
                        <Title level={2}>Employee</Title>

                        <Button type="primary" onClick={showModal}>Create</Button>
                        <Table
                            loading={tableLoadingSpin}
                            size="small"
                            dataSource={employees}
                            columns={employeeColumns}
                        />

                        <Modal
                            title="Employee"
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

                                        name="employeeForm"
                                        form={employeeForm}
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
                                            label="Company Name"
                                            name="companyName"
                                            rules={[{ required: true, message: 'Company Name can not be null!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Mobile No"
                                            name="mobile1"
                                            rules={[{ required: true, message: 'Mobile No can not be null!' }]}
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
                                                    label="Mobile Home"
                                                    name="mobile2"
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

export default Employee;