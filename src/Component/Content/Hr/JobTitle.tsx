import { CheckCircleTwoTone } from '@ant-design/icons';
import { Badge, Button, Col, Form, Input, message, Modal, PageHeader, Popconfirm, Row, Space, Spin, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react';


const JobTitle: React.FC = () => {
    var [tableLoadingSpin, setTableSpinLoading] = useState(false);

    interface JobTitle {
        id: number;
        name: string;
        alias: string;
        activeStatus: boolean;
        description: string;
        createdDate: string;
        lastModifiedDate: string;
    }

    const [jobTitleForm] = Form.useForm();
    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const [jobTitle, setJobTitle] = useState<JobTitle>();
    const [jobTitleId, setJobTitleId] = useState<number>();
    const [isFormDisabled, setisFormDisabled] = useState(false);

    // Modal related properties
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setmodalState] = useState('CREATE');
    const [modalOkButtonText, setModalOkButtonText] = useState('Create');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


    useEffect(() => {

        getJobTitles();

        return () => {

        }
    }, []);

    const getJobTitles = () => {
        setTableSpinLoading(true);
        axios.get(`http://localhost:8080/jobTitles`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                })
                setJobTitles(response.data);
                setTableSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setTableSpinLoading(false);
            });
    }

    const getJobTitle = (id: number) => {
        axios.get(`http://localhost:8080/jobTitles/${id}`)
            .then((response) => {
                console.log(response.data);
                setJobTitle(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

    useEffect(() => {
        if (modalState === 'CREATE') {
            setModalOkButtonText('Create');
            setisFormDisabled(false);
            setJobTitleId(0);
        } else if (modalState === 'VIEW') {
            setModalOkButtonText('Change');
            setisFormDisabled(true);
        } else {
            setModalOkButtonText('Change');
            setisFormDisabled(false);
        }

        return () => {
        }
    }, [modalState])


    const showModal = () => {
        clearModalField();
        setModalOpen(true);
    };

    const clearModalField = () => {
        jobTitleForm.setFieldsValue({
            name: '',
            alias: '',
            description: '',
            activeStatus: true
        });
    }

    const checkFormValidation = async () => {
        try {
            const values = await jobTitleForm.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const modalFormSubmit = async () => {

        try {
            const values = await jobTitleForm.validateFields();
            console.log('Success:', values);
            checkFormValidation();
            setModalConfirmLoading(true);

            if (modalState === 'CREATE') {
                axios.post(`http://localhost:8080/jobTitles`, {
                    name: jobTitleForm.getFieldValue('name'),
                    alias: jobTitleForm.getFieldValue('alias'),
                    description: jobTitleForm.getFieldValue('description'),
                    activeStatus: jobTitleForm.getFieldValue('activeStatus'),

                }).then((response) => {
                    setModalOpen(false);
                    clearModalField();
                    setModalConfirmLoading(false);
                    getJobTitles();
                    console.log(response);
                }).catch(err => {
                    // Handle error
                    console.log("server error");
                    setModalConfirmLoading(false);
                });
            } else {
                axios.put(`http://localhost:8080/jobTitles/${jobTitleId}`, {
                    name: jobTitleForm.getFieldValue('name'),
                    alias: jobTitleForm.getFieldValue('alias'),
                    description: jobTitleForm.getFieldValue('description'),
                    activeStatus: jobTitleForm.getFieldValue('activeStatus')

                }).then((response) => {
                    clearModalField();
                    setModalOpen(false);
                    setModalConfirmLoading(false);
                    getJobTitles();
                    console.log(response);
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
    const jobTitleColumns: ColumnsType<JobTitle> = [
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
            render: (_, record) => {
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
                        <a onClick={() => deleteJobTitleAction(record.id)}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const deletePopConfirm = (e: any) => {
        axios.delete(`http://localhost:8080/jobTitles/${jobTitleId}`)
            .then((response) => {
                getJobTitles();
                message.success('Deleted Successfully.');
            }).catch(err => {
                console.log("server error", err);
            });
    };

    const deletePopCancel = (e: any) => {
        console.log(e);
    };

    const updateAction = (id: number) => {

        setJobTitleId(id);
        setmodalState('UPDATE');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8080/jobTitles/${id}`)
            .then((response) => {

                jobTitleForm.setFieldsValue({
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

    const deleteJobTitleAction = (id: number) => {
        setJobTitleId(id);
    }

    const viewAction = (id: number) => {
        setJobTitleId(id);
        setmodalState('VIEW');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8080/jobTitles/${id}`)
            .then((response) => {

                jobTitleForm.setFieldsValue({
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

    return (
        <>
            <Row>
                <Col md={24}>
                    <div>

                        <PageHeader
                            title="Job Title"
                            subTitle=""
                        />
                        <Button type="primary" onClick={showModal}>Create</Button>
                        <Table
                            loading={tableLoadingSpin}
                            size="small"
                            dataSource={jobTitles}
                            columns={jobTitleColumns} />

                        <Modal
                            title="JobTitle"
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
                                        name="jobTitleForm"
                                        form={jobTitleForm}
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

export default JobTitle;