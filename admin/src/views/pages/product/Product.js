import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import util from "../../../utils/util";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  LoadingOutlined,
  //   UploadImage,
  UploadOutlined,
} from "@ant-design/icons";
import Pagination from "../../components/Pagination";
import ProductService from "../../../services/product";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";
import UploadImage from "../../../utils/UploadImage";
import ProductBasicDetails from "./ProductBasicDetails";
import Productvariant from "./Productvariant";

const Product = () => {
  const [ar, setAr] = useState({
    viewAccess: true || util.checkRightAccess(),
    addAccess: true || util.checkRightAccess(),
    editAccess: true || util.checkRightAccess(),
    deleteAccess: true || util.checkRightAccess(),
    viewRightAccess: true || util.checkRightAccess(),
  });
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qData, setQData] = useState({ page: 1, limit: 20 });

  const addNewModalRef = useRef();

  const columns = [
    {
      title: "#",
      width: 40,
      render: (v, row, i) => <b>{i + 1}</b>,
    },

    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Product Code",
      dataIndex: "productCode",
    },

    {
      title: "Category",
      dataIndex: "categoryDetails",
      render: (v, row) => (
        <Space>
          <Tag color="red">{v?.map((elm, i) => elm?.name)}</Tag>
        </Space>
      ),
    },

    {
      title: "Brand",
      render: (v, row) => (
        <>
          <Tag style={{ fontWeight: 700 }}>{row?.brandDetails.name}</Tag>
        </>
      ),
    },
    {
      title: "Model",
      render: (v, row) => (
        <>
          <Tag style={{ fontWeight: 700 }}>{row?.modelDetails.name}</Tag>
        </>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      render: (isActive) => {
        if (isActive) {
          return (
            <Tag className="custom-tag" color="#87d068">
              Active
            </Tag>
          );
        } else {
          return (
            <Tag className="custom-tag" color="#f50">
              InActive
            </Tag>
          );
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (v, row) => {
        return (
          <>
            {ar.deleteAccess ? (
              <Popconfirm
                title="Are you sure to delete this right?"
                // onConfirm={() => { deleteData(row._id); }}
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
  ];

  const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

  tableColumns[0].fixed = true;
  tableColumns[tableColumns.length - 1].fixed = "right";

  function list() {
    if (ar.viewAccess) {
      setLoading(true);
      ProductService.list(qData)
        .then((res) => {
          setData(res.data?.map((v) => ({ ...v, key: v._id })));
          setQData({
            ...qData,
            limit: res.extra.limit,
            page: res.extra.page,
            total: res.extra.total,
          });
        })
        .catch((err) => {})
        .finally(() => {
          setLoading(false);
        });
    }
  }
  const tableProps = {
    loading,
    size: "small",
    title: () => <Search {...{ addNewModalRef, qData, setQData, list, ar }} />,
    showHeader: true,
    footer: () => <Pagination {...{ qData, setQData }} />,
    tableLayout: undefined,
  };

  useEffect(() => {
    list();
  }, [qData.page, qData.limit]);
  return (
    <>
      <Row
        align="middle"
        gutter={[16, 0]}
        className="mb10 flex j-center a-center"
      >
        <Col flex="auto">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="back_arrow c-pointer" onClick={() => navigate(-1)}>
              <FaLongArrowAltLeft size={20} style={{ color: "white" }} />
            </span>
            <Typography.Title
              className="m-0"
              style={{ fontWeight: 700 }}
              level={4}
            >
              List Of Products
            </Typography.Title>
          </div>
        </Col>

        <Col>
          {ar.addAccess ? (
            <Button
              onClick={() => {
                addNewModalRef.current.openForm();
              }}
              type="primary"
              icon={<PlusOutlined />}
            >
              Add New
            </Button>
          ) : null}
        </Col>
      </Row>
      <Card>
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
};

export default Product;

function Search({ qData, setQData, list }) {
  return (
    <Form onSubmitCapture={list}>
      <Row gutter={12}>
        <Col span={6}>
          <Input
            placeholder="Search by name or code"
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
      setData(dt ? { ...dt } : { status: true });
    },
  }));

  const save = () => {
    setAjxRequesting(true);
    ProductService.save(data)
      .then((res) => {
        message.success(res.message);
        setOpen(false);
        list();
      })
      .catch((err) => {
        message.error(err.message);
      })
      .finally(() => {
        setAjxRequesting(false);
      });
  };

  const item = [
    {
      key: "1",
      label: <div>Basic Details</div>,
      children: <ProductBasicDetails  {...{  data,setData, handleChange, ajxRequesting }}/>,
    },

    {
      key: "2",
      label: <div>Product Variant</div>,
      children: <Productvariant  productDetails={data}   />,
      disabled: data?._id ? false : true

    },
  ];

  return (
    <>
      <Modal
        title={(!data?._id ? "Add" : "Edit") + " Product"}
        style={{ top: 20 }}
        open={open}
        okText="Save"
        onOk={save}
        okButtonProps={{ disabled: ajxRequesting }}
        onCancel={() => {
          setOpen(false);
        }}
        destroyOnClose
        maskClosable={false}
        width={1300}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setOpen(false);
            }}
          >
            {" "}
            Cancel{" "}
          </Button>,
          <Button key="save" type="primary" onClick={save}>
            {" "}
            Save{" "}
          </Button>,
        ]}
      >
        <Tabs type="card" defaultActiveKey="1" items={item} />
        
      </Modal>
    </>
  );
});
