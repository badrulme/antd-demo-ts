import { CheckCircleTwoTone } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Space, Spin, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import IDepartment from '../../../interfaces/Department';


const Department: React.FC = () => {
    var [tableLoadingSpin, setTableSpinLoading] = useState(false);

    const [departmentForm] = Form.useForm();
    const [departments, setDepartments] = useState<IDepartment[]>([]);
    // const [department, setDepartment] = useState<Department>();
    const [departmentId, setDepartmentId] = useState<number>();
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    // Modal related properties
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setModalState] = useState('CREATE');
    const [modalOkButtonText, setModalOkButtonText] = useState('Create');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


    useEffect(() => {

        getDepartments();

        return () => {

        }
    }, []);

    const getDepartments = () => {
        setTableSpinLoading(true);
        axios.get(`http://localhost:8081/departments`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                })
                setDepartments(response.data);
                setTableSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setTableSpinLoading(false);
            });
    }

    // const getDepartment = (id: number) => {
    //     axios.get(`http://localhost:8081/departments/${id}`)
    //         .then((response) => {
    //             console.log(response.data);
    //             setDepartment(response.data);
    //         }).catch(err => {
    //             // Handle error
    //             console.log("server error");
    //         });
    // }

    useEffect(() => {
        if (modalState === 'CREATE') {
            setModalOkButtonText('Create');
            setIsFormDisabled(false);
            setDepartmentId(0);
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
        departmentForm.setFieldsValue({
            name: '',
            alias: '',
            description: '',
            activeStatus: true
        });
    }

    // const checkFormValidation = async () => {
    //     try {
    //         const values = await departmentForm.validateFields();
    //         console.log('Success:', values);
    //     } catch (errorInfo) {
    //         console.log('Failed:', errorInfo);
    //     }
    // };


    const handleCancel = () => {
        setModalOpen(false);
        setModalSpinLoading(false);
        setModalState('CREATE');
    };



    // table rendering settings
    const departmentColumns: ColumnsType<IDepartment> = [
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
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (_: any, record: IDepartment) => {
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
            render: (_: any, record: IDepartment) => (
                moment
                    .utc(record.createdDate)
                    .local()
                    .format('DD-MMM-YYYY')
            )
        },
        {
            title: 'Modified Date',
            dataIndex: 'lastModifiedDate',
            key: 'lastModifiedDate',
            render: (_: any, record: IDepartment) => (
                moment
                    .utc(record.lastModifiedDate)
                    .local()
                    .format('DD-MMM-YYYY')
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: IDepartment) => (
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
                        <a onClick={() => deleteDepartmentAction(record.id)}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];


    const modalFormSubmit = async () => {

        try {
            const values = await departmentForm.validateFields();
            console.log('Success:', values);
            setModalConfirmLoading(true);

            if (modalState === 'CREATE') {
                axios.post(`http://localhost:8081/departments`, {
                    name: departmentForm.getFieldValue('name'),
                    alias: departmentForm.getFieldValue('alias'),
                    description: departmentForm.getFieldValue('description'),
                    activeStatus: departmentForm.getFieldValue('activeStatus'),

                }).then((response) => {
                    setModalOpen(false);
                    clearModalField();
                    setModalConfirmLoading(false);
                    getDepartments();
                    console.log(response);
                }).catch(err => {
                    // Handle error
                    console.log("server error");
                    setModalConfirmLoading(false);
                });
            } else {
                axios.put(`http://localhost:8081/departments/${departmentId}`, {
                    name: departmentForm.getFieldValue('name'),
                    alias: departmentForm.getFieldValue('alias'),
                    description: departmentForm.getFieldValue('description'),
                    activeStatus: departmentForm.getFieldValue('activeStatus')

                }).then((response) => {
                    clearModalField();
                    setModalOpen(false);
                    setModalConfirmLoading(false);
                    getDepartments();
                    setModalState('CREATE');
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


    const deletePopConfirm = (e: any) => {
        axios.delete(`http://localhost:8081/departments/${departmentId}`)
            .then((response) => {
                getDepartments();
                message.success('Deleted Successfully.');
            }).catch(err => {
                console.log("server error", err);
            });
    };

    const deletePopCancel = (e: any) => {
    };

    const updateAction = (id: number) => {

        setDepartmentId(id);
        setModalState('UPDATE');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/departments/${id}`)
            .then((response) => {

                departmentForm.setFieldsValue({
                    name: response.data.name,
                    alias: response.data.alias,
                    description: response.data.description,
                    activeStatus: response.data.activeStatus
                });

                setModalSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setModalSpinLoading(false);
            });
    }

    const deleteDepartmentAction = (id: number) => {
        setDepartmentId(id);
    }

    const viewAction = (id: number) => {
        setDepartmentId(id);
        setModalState('VIEW');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/departments/${id}`)
            .then((response) => {

                departmentForm.setFieldsValue({
                    name: response.data.name,
                    alias: response.data.alias,
                    description: response.data.description,
                    activeStatus: response.data.activeStatus
                });

                setModalSpinLoading(false);
            }).catch(err => {
                console.log("server error");
                setModalSpinLoading(false);
            });
    }

    return (
        <>
            <Row>
                <Col md={24}>
                    <div>
                        <Title level={2}>Department</Title>
                        <Button type="primary" onClick={showModal}>Create</Button>
                        <Table
                            loading={tableLoadingSpin}
                            size="small"
                            dataSource={departments}
                            columns={departmentColumns} />

                        <Modal
                            title="Department"
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
                                        name="departmentForm"
                                        form={departmentForm}
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
                                        <Form.Item
                                            name="description"
                                            label="Description">
                                            <Input.TextArea />
                                        </Form.Item>
                                        <Form.Item
                                            name="activeStatus"
                                            label="Active"
                                            valuePropName="checked">
                                            <Switch />
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

export default Department;