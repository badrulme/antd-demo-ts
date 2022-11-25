import { CheckCircleTwoTone } from '@ant-design/icons';
import { Button, Col, Collapse, DatePicker, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Spin, Switch, Table } from 'antd';
import { Option } from 'antd/es/mentions';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
const { Panel } = Collapse;

const Product: React.FC = () => {
    var [tableLoadingSpin, setTableSpinLoading] = useState(false);
    const [uoms, setUoms] = useState<Uom[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    interface Uom {
        id: number;
        name: string;
        alias: string;
        description: string;
        createdDate: string;
        lastModifiedDate: string;
    }

    interface Category {
        id: number;
        name: string;
        parentId: number;
        description: string;
        createdDate: string;
        lastModifiedDate: string;
    }

    interface Brand {
        id: number;
        name: string;
        alias: string;
        description: string;
        createdDate: string;
        lastModifiedDate: string;
    }

    interface Product {
        id: number;
        code: string;
        name: string;
        summary: string;
        description: string;


        uomId: number;
        categoryId: number;
        brandId: number;
        activeStatus: boolean;
        createdDate: Date;
        lastModifiedDate: Date;
    }

    const dateFormat = 'DD-MMM-YYYY';
    const [productForm] = Form.useForm();
    const [products, setProducts] = useState<Product[]>([]);
    const [product, setProduct] = useState<Product>();
    const [productId, setProductId] = useState<number>();
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    // Modal related properties
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setmodalState] = useState('CREATE');
    const [modalOkButtonText, setModalOkButtonText] = useState('Create');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


    useEffect(() => {

        getProducts();
        getUoms();
        getBrands();
        getCategories();

        return () => {

        }
    }, []);

    const getUoms = () => {
        axios.get(`http://localhost:8081/uoms`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                    x['value'] = x.id;
                    x['label'] = x.name;
                })
                setUoms(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

    const getBrands = () => {
        axios.get(`http://localhost:8081/brands`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                    x['value'] = x.id;
                    x['label'] = x.name;
                })
                setBrands(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

    const getCategories = () => {
        axios.get(`http://localhost:8081/categories`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                    x['value'] = x.id;
                    x['label'] = x.name;
                })
                setCategories(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

    const getProducts = () => {
        setTableSpinLoading(true);
        axios.get(`http://localhost:8081/products/all-product-details`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                })
                setProducts(response.data);
                setTableSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setTableSpinLoading(false);
            });
    }

    const getProduct = (id: number) => {
        axios.get(`http://localhost:8081/products/${id}`)
            .then((response) => {
                console.log(response.data);
                setProduct(response.data);
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
            setProductId(0);
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
        productForm.resetFields();
        productForm.setFieldsValue(
            {
                'gender': 'MALE',
                'activeStatus': true,
            }
        )
    }

    const checkFormValidation = async () => {
        try {
            const values = await productForm.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const modalFormSubmit = async () => {

        try {
            const values = await productForm.validateFields();
            console.log('Success:', values);
            checkFormValidation();
            setModalConfirmLoading(true);

            if (modalState === 'CREATE') {
                axios.post(`http://localhost:8081/products`, {
                    code: productForm.getFieldValue('code'),
                    name: productForm.getFieldValue('name'),
                    summary: productForm.getFieldValue('summary'),
                    description: productForm.getFieldValue('description'),
                    uomId: productForm.getFieldValue('uomId'),
                    categoryId: productForm.getFieldValue('categoryId'),
                    brandId: productForm.getFieldValue('brandId'),
                    activeStatus: productForm.getFieldValue('activeStatus'),

                }).then((response) => {
                    setModalOpen(false);
                    clearModalField();
                    setModalConfirmLoading(false);
                    getProducts();
                    console.log(response);
                }).catch(err => {
                    // Handle error
                    console.log("server error");
                    setModalConfirmLoading(false);
                });
            } else {
                axios.put(`http://localhost:8081/products/${productId}`, {
                    code: productForm.getFieldValue('code'),
                    name: productForm.getFieldValue('name'),
                    summary: productForm.getFieldValue('summary'),
                    description: productForm.getFieldValue('description'),
                    uomId: productForm.getFieldValue('uomId'),
                    categoryId: productForm.getFieldValue('categoryId'),
                    brandId: productForm.getFieldValue('brandId'),
                    activeStatus: productForm.getFieldValue('activeStatus'),

                }).then((response) => {
                    clearModalField();
                    setModalOpen(false);
                    setModalConfirmLoading(false);
                    getProducts();
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
    const productColumns: ColumnsType<Product> = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Job Title',
            dataIndex: 'jobTitle.name',
            key: 'jobTitle.name',
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
            render: (_: any, record: Product) => {
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
                        <a onClick={() => deleteProductAction(record.id)}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const deletePopConfirm = (e: any) => {
        axios.delete(`http://localhost:8081/products/${productId}`)
            .then((response) => {
                getProducts();
                message.success('Deleted Successfully.');
            }).catch(err => {
                console.log("server error", err);
            });
    };

    const deletePopCancel = (e: any) => {
        console.log(e);
    };

    const updateAction = (id: number) => {

        setProductId(id);
        setmodalState('UPDATE');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/products/${id}`)
            .then((response) => {
                productForm.setFieldsValue({
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
                    productId: response.data.productId,
                });

                setModalSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error", err);
                setModalSpinLoading(false);
            });
    }

    const deleteProductAction = (id: number) => {
        setProductId(id);
    }

    const viewAction = (id: number) => {
        setProductId(id);
        setmodalState('VIEW');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8081/products/${id}`)
            .then((response) => {

                productForm.setFieldsValue({
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
                    productId: response.data.productId,
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
                        <Title level={2}>Product</Title>

                        <Button type="primary" onClick={showModal}>Create</Button>
                        <Table
                            loading={tableLoadingSpin}
                            size="small"
                            dataSource={products}
                            columns={productColumns}
                        />

                        <Modal
                            title="Product"
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

                                        name="productForm"
                                        form={productForm}
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

                                        <Form.Item name="uomId" label="Uom" rules={[{ required: true }]}>
                                            <Select
                                                showSearch={true}
                                                placeholder="Select a Uom"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={uoms}
                                            />
                                        </Form.Item>

                                        <Form.Item name="brandId" label="Brand" rules={[{ required: true }]}>
                                            <Select
                                                showSearch={true}
                                                placeholder="Select a Brand"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={brands}
                                            />
                                        </Form.Item>

                                        <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
                                            <Select
                                                showSearch={true}
                                                placeholder="Select a Category"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    (option?.name ?? '').toLowerCase().includes(input.toLowerCase())
                                                }
                                                options={categories}
                                            />
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
                                                    label="summary"
                                                    name="summary"
                                                    rules={[]}
                                                >
                                                    <Input.TextArea />
                                                </Form.Item>
                                                <Form.Item
                                                    label="description"
                                                    name="description"
                                                    rules={[]}
                                                >
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

export default Product;