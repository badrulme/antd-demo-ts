import { CheckCircleTwoTone } from '@ant-design/icons';
import { Button, Col, Collapse, DatePicker, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Spin, Switch, Table } from 'antd';
import { Option } from 'antd/es/mentions';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import IDepartment from '../../../interface/Department';
import IEmployee from '../../../interface/Employee';
import IJobTitle from '../../../interface/JobTitle';
const { Panel } = Collapse;

const Employee: React.FC = () => {
    var [tableLoadingSpin, setTableSpinLoading] = useState(false);
    const [jobTitles, setJobTitles] = useState<IJobTitle[]>([]);
    const [departments, setDepartments] = useState<IDepartment[]>([]);




    const dateFormat = 'DD-MMM-YYYY';
    const [employeeForm] = Form.useForm();
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [employee, setEmployee] = useState<IEmployee>();
    const [employeeId, setEmployeeId] = useState<number>();
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    // Modal related properties
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setmodalState] = useState('CREATE');
    const [modalOkButtonText, setModalOkButtonText] = useState('Create');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


    useEffect(() => {

        getJobTitles();
        getDepartments();
        getEmployees();

        return () => {

        }
    }, []);

    const getDepartments = () => {
        axios.get(`http://localhost:8081/departments`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                    x['value'] = x.id;
                    x['label'] = x.name;
                })
                setDepartments(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

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

    const getJobTitles = () => {
        axios.get(`http://localhost:8081/jobTitles`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                    x['value'] = x.id;
                    x['label'] = x.name;
                })
                setJobTitles(response.data);
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
                    departmentId: employeeForm.getFieldValue('departmentId'),

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
                    departmentId: employeeForm.getFieldValue('departmentId'),

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
    const employeeColumns: ColumnsType<IEmployee> = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (_: any, record: IEmployee) => (record.firstName + " " + record.lastName)
        },
        {
            title: 'Job Title',
            dataIndex: 'jobTitle',
            key: 'jobTitle',
            render: (_: any, record: IEmployee) => (record.jobTitle?.name)

        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (_: any, record: IEmployee) => (record.department?.name)

        },
        {
            title: 'Email Official',
            dataIndex: 'emailOfficial',
            key: 'emailOfficial',
        },
        {
            title: 'Phone Official',
            dataIndex: 'phoneOfficial',
            key: 'phoneOfficial',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, record: IEmployee) => {
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
                    code: response.data.code,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    gender: response.data.gender,
                    dob: dayjs(moment
                        .utc(response.data.dob)
                        .local()
                        .format(dateFormat), dateFormat),
                    emailOfficial: response.data.emailOfficial,
                    emailPersonal: response.data.emailPersonal,
                    phoneOfficial: response.data.phoneOfficial,
                    phonePersonal: response.data.phonePersonal,
                    presentAddress: response.data.presentAddress,
                    permanentAddress: response.data.permanentAddress,
                    bloodGroup: response.data.bloodGroup,
                    activeStatus: response.data.activeStatus,
                    jobTitleId: response.data.jobTitleId,
                    departmentId: response.data.departmentId,
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
                    code: response.data.code,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    gender: response.data.gender,
                    dob: dayjs(moment
                        .utc(response.data.dob)
                        .local()
                        .format(dateFormat), dateFormat),
                    emailOfficial: response.data.emailOfficial,
                    emailPersonal: response.data.emailPersonal,
                    phoneOfficial: response.data.phoneOfficial,
                    phonePersonal: response.data.phonePersonal,
                    presentAddress: response.data.presentAddress,
                    permanentAddress: response.data.permanentAddress,
                    bloodGroup: response.data.bloodGroup,
                    activeStatus: response.data.activeStatus,
                    jobTitleId: response.data.jobTitleId,
                    departmentId: response.data.departmentId,
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
                <Col span={24}>

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
                                            label="First Name"
                                            name="firstName"
                                            rules={[{ required: true, message: 'First Name can not be null!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Last Name"
                                            name="lastName"
                                            rules={[{ required: true, message: 'Last Name can not be null!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name="departmentId" label="Department" rules={[{ required: true }]}>
                                            <Select
                                                showSearch={true}
                                                placeholder="Select a Department"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={departments}
                                            />
                                        </Form.Item>
                                        <Form.Item name="jobTitleId" label="Job Title" rules={[{ required: true }]}>
                                            <Select
                                                showSearch={true}
                                                placeholder="Select a Job Title"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={jobTitles}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Mobile No"
                                            name="phonePersonal"
                                            rules={[]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Official Email"
                                            name="emailOfficial"
                                            rules={[{ type: 'email', message: "Email should be valid!" }]}
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
                                                    label="Personal Email"
                                                    name="emailPersonal"
                                                    rules={[{ type: 'email' }]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Phone Office"
                                                    name="phoneOfficial"
                                                    rules={[]}
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
                                                        <Option value="OTHERS">Others</Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item
                                                    label="Date of Birth"
                                                    name="dob"
                                                    rules={[]}
                                                >
                                                    <DatePicker
                                                        allowClear={false}
                                                        format={dateFormat}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Blood Group"
                                                    name="bloodGroup"
                                                    rules={[]}
                                                >
                                                    <Input />
                                                </Form.Item>
                                                <Form.Item
                                                    label="Present Address"
                                                    name="presentAddress"
                                                    rules={[]}
                                                >
                                                    <Input />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Permanent Address"
                                                    name="permanentAddress"
                                                    rules={[]}
                                                >
                                                    <Input />
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