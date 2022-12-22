import { Button, Col, Form, Input, message, Modal, Popconfirm, Row, Space, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Title from 'antd/es/typography/Title';
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { deleteBrand, getBrand, getBrands } from '../../../../actions/BrandAction';
import IBrand from '../../../../interfaces/Brand';

type Props = {}

export default function Brand({ }: Props) {
    var [tableLoadingSpin, setTableSpinLoading] = useState(false);



    const [brandForm] = Form.useForm();
    const [brands, setIBrands] = useState<IBrand[]>([]);
    const [brand, setIBrand] = useState<IBrand>();
    const [brandId, setIBrandId] = useState<number>(0);
    const [isFormDisabled, setIsFormDisabled] = useState(false);

    // Modal related properties
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setmodalState] = useState('CREATE');
    const [modalOkButtonText, setModalOkButtonText] = useState('Create');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfirmLoading, setModalConfirmLoading] = useState(false);


    useEffect(() => {

        getIBrands();

        return () => {

        }
    }, []);

    const getIBrands = async () => {
        try {
            setTableSpinLoading(true);
            const { data } = await getBrands();
            data.map((x: { [x: string]: any; id: any }) => {
                x["key"] = x.id;
            });
            setIBrands(data);
            setTableSpinLoading(false);
        } catch (error) {
            console.log("server error");
            setTableSpinLoading(false);
        }
    }

    const getBrandDetails = async (id: number) => {
        try {
            const { data } = await getBrand(id);
            setIBrand(data);
        } catch (error) {
            console.log("server error");
        }
    };

    useEffect(() => {
        if (modalState === 'CREATE') {
            setModalOkButtonText('Create');
            setIsFormDisabled(false);
            setIBrandId(0);
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
                    getIBrands();
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
                    getIBrands();
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
    const brandColumns: ColumnsType<IBrand> = [
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
            render: (_: any, record: IBrand) => (
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
            render: (_: any, record: IBrand) => (
                moment
                    .utc(record.lastModifiedDate)
                    .local()
                    .format('DD-MM-YYYY')
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: IBrand) => (
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
                        <a onClick={() => deleteIBrandAction(record.id)}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const deletePopConfirm = async (e: any) => {
        try {
            await deleteBrand(brandId);
            message.success("Deleted Successfully.");
            getBrands();
        } catch (error) {
            message.error("Failed!");
        }
    };


    const deletePopCancel = (e: any) => {
        console.log(e);
    };


    const setFormValues = () => {
        brandForm.setFieldsValue({
            name: brand?.name,
            alias: brand?.alias,
            description: brand?.description,
        });
    };

    const updateAction = (id: number) => {
        setIBrandId(id);
        setmodalState("UPDATE");
        showModal();
        setModalSpinLoading(true);
        getBrandDetails(id);
        setFormValues();
        setModalSpinLoading(false);
    }

    const deleteIBrandAction = (id: number) => {
        setIBrandId(id);
    }

    const viewAction = (id: number) => {

        setIBrandId(id);
        setmodalState("VIEW");
        showModal();
        setModalSpinLoading(true);
        setFormValues();
        setModalSpinLoading(false);
    }

    return (
        <>
            <Row>
                <Col md={24}>
                    <div>
                        <Title level={4}>Brand</Title>
                        <Button type="primary" onClick={showModal}>Create</Button>
                        <Table
                            loading={tableLoadingSpin}
                            size="small"
                            dataSource={brands}
                            columns={brandColumns} />

                        <Modal
                            title="IBrand"
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