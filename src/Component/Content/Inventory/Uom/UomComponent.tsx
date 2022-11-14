import { Button, Form, Input, message, Modal, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

type Props = {}

const UomComponent: React.FC = () => {
    console.log("Ami run");

    const [uomForm] = Form.useForm();

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const [okButtonText, setOkButtonText] = useState('Create');
    const [inputName, setInputName] = useState('l');
    const [inputAlias, setInputAlias] = useState('s');
    const [inputDescription, setInputDescription] = useState('d');

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
                setUoms(response.data);
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
        }).then((data) => {
            console.log(data);

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

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        createUom();
        setOpen(false);
        setConfirmLoading(false);
        getUoms();
        // setTimeout(() => {
        //     createUom();
        //     setOpen(false);
        //     setConfirmLoading(false);
        // }, 2000);
    };

    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    interface Uom {
        id: number;
        name: string;
        alias: string;
        createdDate: string;
        lastModifiedDate: string;
    }

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
            title: 'Created Date',
            dataIndex: 'createdDate',
            key: 'createdDate',
        },
        {
            title: 'Last Modified Date',
            dataIndex: 'lastModifiedDate',
            key: 'lastModifiedDate',
        },
    ];


    const [uoms, setUoms] = useState([]);


    return (
        <>
            <div>
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
                    <div>
                        <Form
                            name="uomForm"
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
                </Modal>
            </div>
        </>
    )
}

export default UomComponent;