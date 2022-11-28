import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ICategory from '../../../../Interfaces/Category';

type Props = {}

export default function Category({ }: Props) {
    const [parentCategories, setParentCategories] = useState<ICategory[]>([]);
    const [displayParentCategories, setDisplayParentCategories] = useState<ICategory[]>([]);

    const onChange = (value: string) => {
        console.log(`selected ${value}`);
    };

    const onSearch = (value: string) => {
        console.log('search:', value);
    };

    var [tableLoadingSpin, setTableSpinLoading] = useState(false);

    const [categoryForm] = Form.useForm();
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [category, setICategory] = useState<ICategory>();
    const [categoryId, setICategoryId] = useState<number>();
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    // Modal related properties
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setmodalState] = useState('CREATE');
    const [modalOkButtonText, setModalOkButtonText] = useState('Create');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


    useEffect(() => {

        getICategorys();

        return () => {

        }
    }, []);

    const getICategorys = () => {
        setTableSpinLoading(true);
        axios.get(`http://localhost:8081/categories`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                    x['value'] = x.id;
                    x['label'] = x.name;
                })
                setCategories(response.data);
                setTableSpinLoading(false);
                setParentCategories(response.data);
                setDisplayParentCategories(response.data);

            }).catch(err => {
                // Handle error
                console.log("server error");
                setTableSpinLoading(false);
            });
    }

    const getICategory = (id: number) => {
        axios.get(`http://localhost:8081/categories/${id}`)
            .then((response) => {
                console.log(response.data);
                setICategory(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

    useEffect(() => {
        if (modalState === 'CREATE') {
            setModalOkButtonText('Create');
            setIsFormDisabled(false);
            setICategoryId(0);
            setDisplayParentCategories(parentCategories);
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
        categoryForm.setFieldsValue({
            name: '',
            alias: '',
            description: '',
            parentId: ''
        });
    }

    const checkFormValidation = async () => {
        try {
            const values = await categoryForm.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const modalFormSubmit = async () => {

        try {
            const values = await categoryForm.validateFields();
            console.log('Success:', values);
            checkFormValidation();
            setModalConfirmLoading(true);

            if (modalState === 'CREATE') {
                axios.post(`http://localhost:8081/categories`, {
                    name: categoryForm.getFieldValue('name'),
                    description: categoryForm.getFieldValue('description'),
                    parentId: categoryForm.getFieldValue('parentId')

                }).then((response) => {
                    setModalOpen(false);
                    clearModalField();
                    setModalConfirmLoading(false);
                    getICategorys();
                    console.log(response);
                }).catch(err => {
                    // Handle error
                    console.log("server error");
                    setModalConfirmLoading(false);
                });
            } else {
                axios.put(`http://localhost:8081/categories/${categoryId}`, {
                    name: categoryForm.getFieldValue('name'),
                    description: categoryForm.getFieldValue('description'),
                    parentId: categoryForm.getFieldValue('parentId')

                }).then((response) => {
                    clearModalField();
                    setModalOpen(false);
                    setModalConfirmLoading(false);
                    getICategorys();
                    setmodalState('CREATE');
                }).catch(err => {
                    console.log("server error", err);
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
    const categoryColumns: ColumnsType<ICategory> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
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
            render: (_: any, record: ICategory) => (
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
            render: (_: any, record: ICategory) => (
                moment
                    .utc(record.lastModifiedDate)
                    .local()
                    .format('DD-MM-YYYY')
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: ICategory) => (
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
                        <a onClick={() => deleteICategoryAction(record.id)}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const deletePopConfirm = (e: any) => {
        axios.delete(`http://localhost:8081/categories/${categoryId}`)
            .then((response) => {
                getICategorys();
                message.success('Deleted Successfully.');
            }).catch(err => {
                console.log("server error", err);
            });
    };

    const deletePopCancel = (e: any) => {
        console.log(e);
    };

    const updateAction = (id: number) => {

        setICategoryId(id);
        setmodalState('UPDATE');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/categories/${id}`)
            .then((response) => {

                categoryForm.setFieldsValue({
                    name: response.data.name,
                    description: response.data.description,
                    parentId: response.data.parentICategory?.id,
                });

                setModalSpinLoading(false);
                setDisplayParentCategories(parentCategories.filter(x => x.id != id))
            }).catch(err => {
                // Handle error
                console.log("server error");
                setModalSpinLoading(false);
            });
    }

    const deleteICategoryAction = (id: number) => {
        setICategoryId(id);
    }

    const viewAction = (id: number) => {
        setICategoryId(id);
        setmodalState('VIEW');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/categories/${id}`)
            .then((response) => {
                categoryForm.setFieldsValue({
                    name: response.data.name,
                    description: response.data.description,
                    parentId: response.data.parentICategory?.id,
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

                        <Title level={2}>Category</Title>

                        <Button type="primary" onClick={showModal}>Create</Button>
                        <Table
                            loading={tableLoadingSpin}
                            size="small"
                            dataSource={categories}
                            columns={categoryColumns} />

                        <Modal
                            title="ICategory"
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
                                        name="categoryForm"
                                        form={categoryForm}
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
                                            name="description"
                                            label="Description">
                                            <Input.TextArea />
                                        </Form.Item>
                                        <Form.Item name="parentId" label="Parent ICategory" rules={[{ required: false }]}>
                                            <Select
                                                allowClear={true}
                                                showSearch
                                                placeholder="Select Parent ICategory"
                                                optionFilterProp="children"
                                                onChange={onChange}
                                                onSearch={onSearch}
                                                filterOption={(input, option) =>
                                                    (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={displayParentCategories}
                                            />
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