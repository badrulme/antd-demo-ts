import { Button, Form, Input, message, Modal, PageHeader, Popconfirm, Space, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

type Props = {}

const UomComponent: React.FC = () => {
    var [modalLoadingSpin, setModalSpinLoading] = useState(false);
    var [modalState, setmodalState] = useState('CREATE');
    const [okButtonText, setOkButtonText] = useState('Create');
    var [uomId, setUomId] = useState<number>();

    console.log("Ami run");

    interface Uom {
        id: number;
        name: string;
        alias: string;
        description: string;
        createdDate: string;
        lastModifiedDate: string;
    }

    const [uomForm] = Form.useForm();
    const [uoms, setUoms] = useState<Uom[]>([]);
    const [uom, setUom] = useState<Uom>();


    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [inputName, setInputName] = useState();
    const [inputAlias, setInputAlias] = useState();
    const [inputDescription, setInputDescription] = useState();

    const inputNameHandler = (e: any) => {
        console.log('s' + e.target.value);
        setInputName(e.target.value);
    };

    const inputAliasHandler = (e: any) => {
        console.log(e.target.value);
        setInputAlias(e.target.value);

    };

    const inputDescriptionHandler = (e: any) => {
        console.log(e.target.value);
        setInputDescription(e.target.value);
    };

    useEffect(() => {

        getUoms();

        return () => {

        }
    }, []);

    const getUoms = () => {
        axios.get(`http://localhost:8080/uoms`)
            .then((response) => {
                console.log(response.data);
                response.data.map((x: { [x: string]: any; id: any; }) => {
                    x['key'] = x.id;
                })
                setUoms(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

    const getUom = (id: number) => {
        axios.get(`http://localhost:8080/uoms/${id}`)
            .then((response) => {
                console.log(response.data);
                setUom(response.data);
            }).catch(err => {
                // Handle error
                console.log("server error");
            });
    }

    const createUom = () => {
        axios.post(`http://localhost:8080/uoms`, {
            name: inputName,
            alias: inputAlias,
            description: inputDescription
        }).then((response) => {
            setUoms(response.data);
            console.log(response);

            // history.push('/read')
        })
    }


    const confirm = (e: any) => {
        console.log(e);
        return new Promise(resolve => {

            setTimeout(() => {
                message.success('Click on Yes');
                resolve(null)
            }, 3000);
        });
    };

    const cancel = (e: any) => {
        console.log(e);
        message.error('Click on No');
    };

    useEffect(() => {
        if (modalState === 'CREATE') {
            setOkButtonText('Create');
            setUomId(0);
        } else {
            setOkButtonText('Change');
        }

        return () => {
        }
    }, [modalState])


    const showModal = () => {
        clearModalField();
        setOpen(true);
    };

    const clearModalField = () => {
        uomForm.setFieldsValue({
            name: '',
            alias: '',
            description: ''
        });
    }

    const handleOk = () => {
        setConfirmLoading(true);

        if (modalState === 'CREATE') {
            axios.post(`http://localhost:8080/uoms`, {
                name: inputName,
                alias: inputAlias,
                description: inputDescription
            }).then((response) => {
                setOpen(false);
                clearModalField();
                setConfirmLoading(false);
                getUoms();
                console.log(response);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setConfirmLoading(false);
            });
        } else {
            axios.put(`http://localhost:8080/uoms/${uomId}`, {
                name: inputName,
                alias: inputAlias,
                description: inputDescription
            }).then((response) => {
                clearModalField();
                setOpen(false);
                setConfirmLoading(false);
                getUoms();
                console.log(response);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setConfirmLoading(false);
            });
        }

    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
        setModalSpinLoading(false);
        setmodalState('CREATE');
    };



    const uomColumns: ColumnsType<Uom> = [
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
        },
        {
            title: 'Last Modified Date',
            dataIndex: 'lastModifiedDate',
            key: 'lastModifiedDate',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => updateUomAction(record.id)}>Update</a>
                    <Popconfirm
                        title="Are you sure to delete this task?"
                        onConfirm={deletePopConfirm}
                        onCancel={deletePopCancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a onClick={() => deleteUomAction(record.id)}>Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const deletePopConfirm = (e: any) => {
        console.log(e);
        message.success('Click on Yes');
    };

    const deletePopCancel = (e: any) => {
        console.log(e);
        message.error('Click on No');
    };

    const updateUomAction = (id: number) => {

        setUomId(id);
        setmodalState('UPDATE');
        showModal();
        setModalSpinLoading(true);
        axios.get(`http://localhost:8080/uoms/${id}`)
            .then((response) => {
                console.log(response.data);

                setUom(response.data);

                uomForm.setFieldsValue({
                    name: response.data.name,
                    alias: response.data.alias,
                    description: response.data.description
                });

                setInputName(response.data.name);
                setInputAlias(response.data.alias);
                setInputDescription(response.data.description);

                setModalSpinLoading(false);
            }).catch(err => {
                // Handle error
                console.log("server error");
                setModalSpinLoading(false);
            });




    }

    const deleteUomAction = (id: number) => {

    }

    return (
        <>

            <div>

                <PageHeader
                    title="UoM"
                    subTitle=""
                />
                <Button type="primary" onClick={showModal}>Create</Button>
                <Table size="small" dataSource={uoms} columns={uomColumns} />

                <Modal
                    title="Uom"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    okText={okButtonText}
                >
                    <Spin spinning={modalLoadingSpin}>

                        <div>
                            <Form
                                name="uomForm"
                                form={uomForm}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                initialValues={{ remember: true }}
                                // onFinish={onFinish}
                                // onFinishFailed={onFinishFailed}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Name"
                                    name="name"
                                    rules={[{ required: true, message: 'Name can not be null!' }]}
                                >
                                    <Input onChange={inputNameHandler} value={inputName} />
                                </Form.Item>
                                <Form.Item
                                    label="Alias"
                                    name="alias"
                                    rules={[{ required: true, message: 'Alias can not be null!' }]}
                                >
                                    <Input onChange={inputAliasHandler} value={inputAlias} />
                                </Form.Item>
                                <Form.Item
                                    name="description"
                                    label="Description">
                                    <Input.TextArea onChange={inputDescriptionHandler} value={inputDescription} />
                                </Form.Item>
                            </Form>
                        </div>
                    </Spin>
                </Modal>
            </div>

        </>
    )
}

export default UomComponent;