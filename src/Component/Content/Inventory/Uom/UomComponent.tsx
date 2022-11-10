import { Button, Modal, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react'
import { message, Popconfirm } from 'antd';
import axios from 'axios';

type Props = {}

const UomComponent: React.FC = () => {
    console.log("Ami run");


    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');

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


    const confirm = (e: any) => {
        console.log(e);
        return new Promise(resolve => {

            setTimeout(() => {
                message.success('Click on Yes');
                resolve(null)
            }, 3000);
        });
    };

    // const confirm = () =>
    //     new Promise(resolve => {
    //         setTimeout(() => resolve(null), 3000);
    //     });

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
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
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
                <h4>Middle size table</h4>
                <Table size="small" dataSource={uoms} columns={uomColumns} />

                <Modal
                    title="Title"
                    open={open}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                >
                    <p>{modalText}</p>
                </Modal>
            </div>
        </>
    )
}

export default UomComponent;