import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Space, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';

type Props = {}

export default function Brand({ }: Props) {
    var [tableLoadingSpin, setTableSpinLoading] = useState(false);

    interface Brand {
        id: number;
        name: string;
        alias: string;
        description: string;
        createdDate: string;
        lastModifiedDate: string;
    }

    const [brandForm] = Form.useForm();
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brand, setBrand] = useState<Brand>();
    const [brandId, setBrandId] = useState<number>();
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    // Modal related properties
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setmodalState] = useState('CREATE');
    const [modalOkButtonText, setModalOkButtonText] = useState('Create');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


    useEffect(() => {

        getBrands();

        return () => {

        }
    }, []);

    const getBrands = () => {
        setTableSpinLoading(true);
        axios.get(`http://localhost:8081/brands`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                })
                setBrands(response.data);
                setTableSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setTableSpinLoading(false);
            });
    }

    const getBrand = (id: number) => {
        axios.get(`http://localhost:8081/brands/${id}`)
            .then((response) => {
                console.log(response.data);
                setBrand(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

    useEffect(() => {
        if (modalState === 'CREATE') {
            setModalOkButtonText('Create');
            setIsFormDisabled(false);
            setBrandId(0);
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
        brandForm.setFieldsValue({
            name: '',
            alias: '',
            description: ''
        });
    }

    const checkFormValidation = async () => {
        try {
            const values = await brandForm.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const modalFormSubmit = async () => {

        try {
            const values = await brandForm.validateFields();
            console.log('Success:', values);
            checkFormValidation();
            setModalConfirmLoading(true);

            if (modalState === 'CREATE') {
                axios.post(`http://localhost:8081/brands`, {
                    name: brandForm.getFieldValue('name'),
                    alias: brandForm.getFieldValue('alias'),
                    description: brandForm.getFieldValue('description')

                }).then((response) => {
                    setModalOpen(false);
                    clearModalField();
                    setModalConfirmLoading(false);
                    getBrands();
                    console.log(response);
                }).catch(err => {
                    // Handle error
                    console.log("server error");
                    setModalConfirmLoading(false);
                });
            } else {
                axios.put(`http://localhost:8081/brands/${brandId}`, {
                    name: brandForm.getFieldValue('name'),
                    alias: brandForm.getFieldValue('alias'),
                    description: brandForm.getFieldValue('description')

                }).then((response) => {
                    clearModalField();
                    setModalOpen(false);
                    setModalConfirmLoading(false);
                    getBrands();
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
    const brandColumns: ColumnsType<Brand> = [
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
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
            render: (_: any, record: Brand) => (
                moment
                    .utc(record.createdDate)
                    .local()
                    .format('DD-MMM-YYYY')
            )
        },
        {
            title: 'Last Modified Date',
            dataIndex: 'lastModifiedDate',
            key: 'lastModifiedDate',
            render: (_: any, record: Brand) => (
                moment
                    .utc(record.lastModifiedDate)
                    .local()
                    .format('DD-MM-YYYY')
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Brand) => (
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
                        <a onClick={() => deleteBrandAction(record.id)}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const deletePopConfirm = (e: any) => {
        axios.delete(`http://localhost:8081/brands/${brandId}`)
            .then((response) => {
                getBrands();
                message.success('Deleted Successfully.');
            }).catch(err => {
                console.log("server error", err);
            });
    };

    const deletePopCancel = (e: any) => {
        console.log(e);
    };

    const updateAction = (id: number) => {

        setBrandId(id);
        setmodalState('UPDATE');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/brands/${id}`)
            .then((response) => {

                brandForm.setFieldsValue({
                    name: response.data.name,
                    alias: response.data.alias,
                    description: response.data.description
                });

                setModalSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setModalSpinLoading(false);
            });
    }

    const deleteBrandAction = (id: number) => {
        setBrandId(id);
    }

    const viewAction = (id: number) => {
        setBrandId(id);
        setmodalState('VIEW');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/brands/${id}`)
            .then((response) => {

                brandForm.setFieldsValue({
                    name: response.data.name,
                    alias: response.data.alias,
                    description: response.data.description
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
                        <Title level={2}>Brand</Title>
                        <Button type="primary" onClick={showModal}>Create</Button>
                        <Table
                            loading={tableLoadingSpin}
                            size="small"
                            dataSource={brands}
                            columns={brandColumns} />

                        <Modal
                            title="Brand"
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
                                        name="brandForm"
                                        form={brandForm}
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