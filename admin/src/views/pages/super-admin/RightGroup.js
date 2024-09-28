import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Popconfirm,
  Spin,
  Card,
  message,
  Input,
  Space,
  Drawer,
  Tag,
  Select,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import serviceRole from "../../../services/rightGrp";
import Pagination from "../../components/Pagination";
import util from "../../../utils/util";
import { useNavigate } from "react-router-dom";

/* eslint-disable no-unused-vars */
export default function RightGroup() {
  const [ar, setAr] = useState({
    viewAccess: util.checkRightAccess("super-admin-access-list"),
    addAccess: util.checkRightAccess("super-admin-access-add"),
    editAccess: util.checkRightAccess("super-admin-access-edit"),
    deleteAccess: util.checkRightAccess("super-admin-access-delete"),
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [qData, setQData] = useState({ page: 1, limit: 20 });
  const navigate = useNavigate();

  const addNewModalRef = useRef();
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      // width: 40,
    },
    {
      title: "Action",
      dataIndex: "_id",
      width: 70,
      hidden:
        !ar.addAccess && !ar.editAccess && !ar.deleteAccess && !ar.viewAccess,
      render: (v, row) => {
        return (
          <>
            {ar.deleteAccess ? (
              <Popconfirm
                title="Are you sure to delete this Role Group?"
                onConfirm={() => {
                  deleteData(row._id);
                }}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                />
                &nbsp;
              </Popconfirm>
            ) : null}

            {ar.editAccess ? (
              <Button
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  addNewModalRef.current.openForm(row);
                }}
              />
            ) : null}
            {!ar.editAccess && ar.viewAccess ? (
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => {
                  addNewModalRef.current.openForm(row);
                }}
              />
            ) : null}
          </>
        );
      },
    },
  ].filter((item) => !item.hidden);

  function list() {
    if (ar.viewAccess) {
      setLoading(true);
      serviceRole
        .list(qData)
        .then((res) => {
          setData(res.data?.map((v) => ({ ...v, key: v._id })));
          setQData({
            ...qData,
            limit: res.extra.limit,
            page: res.extra.page,
            total: res.extra.total,
          });
        })
        .catch((err) => { })
        .finally(() => {
          setLoading(false);
        });
    }
  }

  const deleteData = (id) => {
    serviceRole
      .delete(id)
      .then((res) => {
        message.success(res.message);
        list();
        setSelected([]);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

  tableColumns[0].fixed = true;
  tableColumns[tableColumns.length - 1].fixed = "right";

  const tableProps = {
    bordered: true,
    loading,
    size: "small",
    title: () => (
      <Search
        {...{ addNewModalRef, selected, deleteData, qData, setQData, list, ar }}
      />
    ),
    showHeader: true,
    footer: () => <Pagination {...{ qData, setQData }} />,
    rowSelection: {
      onChange: (selectedRowKeys) => {
        setSelected(selectedRowKeys);
      },
    },
    tableLayout: undefined,
  };

  useEffect(() => {
    list();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qData.page, qData.limit]);

  return (
    <>
      <Card
        bordered={false}
        size="small"
        title={
          <>
            <Space>
              <Button
                type="dashed"
                danger
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              List of Role Groups
            </Space>
          </>
        }
        extra={
          <>
            <Row justify="end" gutter={12}>
              <Col>
                {selected.length && ar.deleteAccess ? (
                  <Popconfirm
                    title="Are you sure to delete these selected images?"
                    onConfirm={() => {
                      deleteData(selected);
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="primary"
                      danger
                      style={{ float: "right" }}
                      icon={<DeleteOutlined />}
                    >
                      Delete Selected
                    </Button>
                  </Popconfirm>
                ) : null}
              </Col>
              <Col>
                {ar.addAccess ? (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      addNewModalRef.current.openForm();
                    }}
                  >
                    Add New
                  </Button>
                ) : null}
              </Col>
            </Row>
          </>
        }
      >
        <Table
          {...tableProps}
          pagination={{ position: ["none"], pageSize: qData.limit }}
          columns={tableColumns}
          dataSource={data.length ? data : []}
          scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
        />
        <AddForm ref={addNewModalRef} {...{ list, ar }} />
      </Card>
    </>
  );
}

function Search({ qData, setQData, list }) {
  return (
    <Form onSubmitCapture={list}>
      <Row gutter={12}>
        <Col span={6}>
          <Input
            placeholder="Search by name"
            value={qData.key}
            onChange={(e) => setQData({ ...qData, key: e.target.value })}
            allowClear
          />
        </Col>
        <Col span={3}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

const AddForm = forwardRef((props, ref) => {
  const { list, ar } = props;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

  const handleChange = (value) => {
    if (ar.addAccess || ar.editAccess) {
      setData({ ...data, ...value });
    }
  };

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { rightCodes: [], ...dt } : { rightCodes: [] });
    },
  }));

  const save = () => {
    setAjxRequesting(true);
    serviceRole
      .save(data)
      .then((res) => {
        message.success(res.message);
        setOpen(false);
        list();
      })
      .catch((err) => {
        if (typeof err.message === "object") {
          let dt = err.message[Object.keys(err.message)[0]];
          message.error(dt);
        } else {
          message.error(err.message);
        }
      })
      .finally(() => {
        setAjxRequesting(false);
      });
  };

  return (
    <>
      <Drawer
        title={data._id ? "Edit Role Group" : "Create a Role Group"}
        width={400}
        onClose={() => {
          setOpen(false);
        }}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={save} type="primary" disabled={ajxRequesting}>
              Save
            </Button>
          </Space>
        }
        destroyOnClose
      >
        <Spin spinning={ajxRequesting}>
          <Form layout="vertical" onSubmitCapture={save}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Name" required>
                  <Input
                    placeholder="Name"
                    value={data.name || ""}
                    onChange={(e) => {
                      handleChange({ name: e.target.value });
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Drawer>
    </>
  );
});
