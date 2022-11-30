import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
} from "antd";
import { ColumnsType } from "antd/es/table";
import Title from "antd/es/typography/Title";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { deleteUom, getUom, getUoms } from "../../../../actions/UomAction";
import IUom from "../../../../interfaces/Uom";

const Uom: React.FC = () => {
  var [tableLoadingSpin, setTableSpinLoading] = useState(false);

  const [uomForm] = Form.useForm();
  const [uoms, setIUoms] = useState<IUom[]>([]);
  const [uom, setIUom] = useState<IUom>();
  const [uomId, setIUomId] = useState<number>(0);
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  // Modal related properties
  var [modalLoadingSpin, setModalSpinLoading] = useState(false);
  var [modalState, setmodalState] = useState("CREATE");
  const [modalOkButtonText, setModalOkButtonText] = useState("Create");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfirmLoading, setModalConfirmLoading] = useState(false);

  useEffect(() => {
    getIUoms();

    return () => {};
  }, []);

  const getIUoms = async () => {
    try {
      setTableSpinLoading(true);
      const { data } = await getUoms();
      data.map((x: { [x: string]: any; id: any }) => {
        x["key"] = x.id;
      });
      setIUoms(data);
      setTableSpinLoading(false);
    } catch (error) {
      console.log("server error");
      setTableSpinLoading(false);
    }
  };

  const getUomDetails = async (id: number) => {
    try {
      const { data } = await getUom(id);
      setIUom(data);
    } catch (error) {
      console.log("server error");
    }
  };

  useEffect(() => {
    if (modalState === "CREATE") {
      setModalOkButtonText("Create");
      setIsFormDisabled(false);
      setIUomId(0);
    } else if (modalState === "VIEW") {
      setModalOkButtonText("Change");
      setIsFormDisabled(true);
    } else {
      setModalOkButtonText("Change");
      setIsFormDisabled(false);
    }

    return () => {};
  }, [modalState]);

  const showModal = () => {
    clearModalField();
    setModalOpen(true);
  };

  const clearModalField = () => {
    uomForm.resetFields();
  };

  const checkFormValidation = async () => {
    try {
      const values = await uomForm.validateFields();
      console.log("Success:", values);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const modalFormSubmit = async () => {
    try {
      checkFormValidation();
      setModalConfirmLoading(true);

      if (modalState === "CREATE") {
        axios
          .post(`http://localhost:8081/uoms`, {
            name: uomForm.getFieldValue("name"),
            alias: uomForm.getFieldValue("alias"),
            description: uomForm.getFieldValue("description"),
          })
          .then((response) => {
            setModalOpen(false);
            clearModalField();
            setModalConfirmLoading(false);
            getIUoms();
            console.log(response);
          })
          .catch((err) => {
            // Handle error
            console.log("server error");
            setModalConfirmLoading(false);
          });
      } else {
        axios
          .put(`http://localhost:8081/uoms/${uomId}`, {
            name: uomForm.getFieldValue("name"),
            alias: uomForm.getFieldValue("alias"),
            description: uomForm.getFieldValue("description"),
          })
          .then((response) => {
            clearModalField();
            setModalOpen(false);
            setModalConfirmLoading(false);
            getIUoms();
            console.log(response);
            setmodalState("CREATE");
          })
          .catch((err) => {
            // Handle error
            console.log("server error");
            setModalConfirmLoading(false);
          });
      }
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setModalSpinLoading(false);
    setmodalState("CREATE");
  };

  // table rendering settings
  const uomColumns: ColumnsType<IUom> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Alias",
      dataIndex: "alias",
      key: "alias",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (_, record) =>
        moment.utc(record.createdDate).local().format("DD-MM-YYYY"),
    },
    {
      title: "Last Modified Date",
      dataIndex: "lastModifiedDate",
      key: "lastModifiedDate",
      render: (_, record) =>
        moment.utc(record.lastModifiedDate).local().format("DD-MM-YYYY"),
    },
    {
      title: "Action",
      key: "action",
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
            <a onClick={() => deleteIUomAction(record.id)}>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const deletePopConfirm = async (e: any) => {
    try {
      await deleteUom(uomId);
      message.success("Deleted Successfully.");
      getIUoms();
    } catch (error) {
      message.error("Failed!");
    }
  };

  const deletePopCancel = (e: any) => {
    console.log(e);
  };

  const updateAction = (id: number) => {
    setIUomId(id);
    setmodalState("UPDATE");
    showModal();
    setModalSpinLoading(true);
    getUomDetails(id);
    setFormValues();
    setModalSpinLoading(false);
  };

  const viewAction = (id: number) => {
    setIUomId(id);
    setmodalState("VIEW");
    showModal();
    setModalSpinLoading(true);
    setFormValues();
    setModalSpinLoading(false);
  };

  const deleteIUomAction = (id: number) => {
    setIUomId(id);
  };

  const setFormValues = () => {
    uomForm.setFieldsValue({
      name: uom?.name,
      alias: uom?.alias,
      description: uom?.description,
    });
  };

  return (
    <>
      <Row>
        <Col md={24}>
          <div>
            <Title level={2}>UoM</Title>

            <Button type="primary" onClick={showModal}>
              Create
            </Button>
            <Table
              loading={tableLoadingSpin}
              size="small"
              dataSource={uoms}
              columns={uomColumns}
            />

            <Modal
              title="IUom"
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
                    name="uomForm"
                    form={uomForm}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    disabled={isFormDisabled}
                  >
                    <Form.Item
                      label="Name"
                      name="name"
                      rules={[
                        { required: true, message: "Name can not be null!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label="Alias"
                      name="alias"
                      rules={[
                        { required: true, message: "Alias can not be null!" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
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
  );
};

export default Uom;
