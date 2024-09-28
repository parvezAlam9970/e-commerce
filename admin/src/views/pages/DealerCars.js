/* eslint-disable no-unused-vars */
import {
  Table,
  Button,
  Form,
  Row,
  Col,
  Popconfirm,
  Card,
  Spin,
  Typography,
  message,
  Input,
  Divider,
  Space,
  Tag,
  Select,
  Modal,
  Text,
  Tabs,
  Carousel,
  Image,
} from "antd";
import {
  ArrowLeftOutlined,
  HeartOutlined,
  BookOutlined,
  TwitterOutlined,
  PlusOutlined,
  CloseOutlined
} from "@ant-design/icons";
import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import serviceRight from "../../services/right";
import serviceState from "../../services/state";
import Pagination from "../components/Pagination";
import serviceDealer from "../../services/dealer";
import UploadImage from "../../utils/UploadImage";
import util from "../../utils/util";
import { useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";
import serviceDealerCar from "../../services/dealerCar";

export default function DealerCars() {
  const [ar, setAr] = useState({
    viewAccess: util.checkRightAccess("list-dealer"),
    addAccess: util.checkRightAccess("add-dealer"),
    editAccess: util.checkRightAccess("edit-dealer"),
    deleteAccess: util.checkRightAccess("delete-dealer"),
    viewRightAccess: util.checkRightAccess("list-dealer"),
  });


  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState([]);
  const [state, setState] = useState([]);
  const [qData, setQData] = useState({ page: 1, limit: 20 });
  const [rights, setRights] = useState([]);
  const navigate = useNavigate();

  const addNewModalRef = useRef();
  const columns = [
    {
      title: "Dealer Id",
      dataIndex: "crz",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "Dealership Name",
      dataIndex: "dealershipName",
      width: 130,
    },
    {
      title: "Bidding Cars",
      dataIndex: "isBlocked",
      width: 80,
      render: (v, row) => (
        <Button
          type="primary"
          size="small"
          onClick={() => {
            addNewModalRef.current.openForm(row);
          }}
        >
          Show
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "isBlocked",
      width: 80,
      render: (isActive) => {
        if (isActive) {
          return <Tag color="red">Unverified</Tag>;
        } else {
          return <Tag color="green">Verified</Tag>;
        }
      },
    },
    {
      title: "Current Status",
      dataIndex: "status",
      width: 80,
      render: (isActive) => {
        if (isActive) {
          return <Tag color="green">Active</Tag>;
        } else {
          return <Tag color="red">Inactive</Tag>;
        }
      },
    },
  ].filter((item) => !item.hidden);

  function list() {
    if (ar.viewAccess) {
      setLoading(true);
      serviceDealer
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

  const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

  tableColumns[0].fixed = true;
  tableColumns[tableColumns.length - 1].fixed = "right";

  const tableProps = {
    bordered: true,
    loading,
    size: "small",
    title: () => (
      <Search {...{ addNewModalRef, selected, qData, setQData, list, ar }} />
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
    if (ar.viewRightAccess) {
      serviceRight.list({ isAll: 1 }).then((res) => {
        setRights(res.data || []);
      });
      serviceState
        .list({ isAll: 1 })
        .then((res) => {
          setState(res.data || []);
        })
        .catch((err) => {
          message.error("State data not loaded");
        });
    }

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
              List of Bidding Cars
            </Space>
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
        <BiddingCarModel
          ref={addNewModalRef}
          {...{ list, rights, ar, state }}
        />
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
            placeholder="Search by name / id / phone / email / dealership name"
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

const BiddingCarModel = forwardRef((props, ref) => {
  const { list, state } = props;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);
  const [activeKey, setActiveKey] = useState("account-info");
  const handleChange = (v, k) => {
    let varDt = data;
    if (k) {
      let keys = k.split(".");
      for (let i = 0; i < keys.length; i++) {
        if (i + 1 === keys.length) {
          varDt[keys[i]] = v;
        } else {
          if (typeof varDt[keys[i]] === "undefined") {
            if (parseInt(keys[i + 1]) * 1 >= 0) {
              varDt[keys[i]] = [];
            } else {
              varDt[keys[i]] = {};
            }
          }
          varDt = varDt[keys[i]];
        }
      }
    }
    setData({ ...data, ...v });
  };

  useImperativeHandle(ref, () => ({
    openForm(dt) {
      setOpen(true);
      setData(dt ? { ...dt } : {});
    },
  }));

  const save = () => {
    setAjxRequesting(true);
    serviceDealer
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

  useEffect(()=>{
    if(open){
      list();
    }
  },[open])
  return (
    <>
      <Modal
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
        width={"90%"}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>,
        ]}
      >
        <Spin spinning={ajxRequesting}>
          <Row gutter={24}>
            <Col span={4}>
              <img
                src={data.avatar}
                alt="Profile-img"
                width={200}
                style={{aspectRatio:"3/2"}}
                
              />
            </Col>
            <Col span={4}>
              <Title level={5} style={{ margin: "0px" }}>
                Username
              </Title>
              <Typography.Text strong style={{ fontSize: "18px" }}>
                {data.name || "-"}
              </Typography.Text>
            </Col>
            <Col span={4}>
              <Title level={5} style={{ margin: "0px" }}>
                Showroom Name
              </Title>
              <Typography.Text strong style={{ fontSize: "18px" }}>
                {data.dealershipName || "-"}
              </Typography.Text>
            </Col>
            <Col span={4}>
              <Title level={5} style={{ margin: "0px" }}>
                Wallet Amount
              </Title>
              <Typography.Text strong style={{ fontSize: "18px" }}>
                ₹ 500
              </Typography.Text>
            </Col>
            <Col span={4}>
              <Title level={5} style={{ margin: "0px" }}>
                Purchase Plan
              </Title>
              <Typography.Text strong style={{ fontSize: "18px" }}>
                ₹ 50,000
                <Typography.Text italic style={{ fontSize: "10px" }}>
                  {" "}
                  12 months
                </Typography.Text>
              </Typography.Text>
            </Col>
            <Col span={4}>
              <Title level={5} style={{ margin: "0px" }}>
                Status
              </Title>
              <Typography.Text
                strong
                style={{
                  fontSize: "18px",
                  color: data.status ? "green" : "red",
                }}
              >
                {data.status ? "Active" : "In-Active"}
              </Typography.Text>
            </Col>
            <Col span={6}></Col>
            <Col span={4}>
              <Title level={5} style={{ margin: "0px" }}>
                Followers
              </Title>
              <Typography.Text
                strong
                style={{ fontSize: "18px", textAlign: "center" }}
              >
                0
              </Typography.Text>
            </Col>
            <Col span={4}>
              <Title level={5} style={{ margin: "0px" }}>
                Following
              </Title>
              <Typography.Text
                strong
                style={{ fontSize: "18px", textAlign: "center" }}
              >
                0
              </Typography.Text>
            </Col>
            <Col span={4}>
              <Title level={5} style={{ margin: "0px" }}>
                Sold
              </Title>
              <Typography.Text
                strong
                style={{ fontSize: "18px", textAlign: "center" }}
              >
                0
              </Typography.Text>
            </Col>
            <Col span={4}>
              <Title level={5} style={{ margin: "0px" }}>
                Posts
              </Title>
              <Typography.Text
                strong
                style={{ fontSize: "18px", textAlign: "center" }}
              >
                0
              </Typography.Text>
            </Col>
          </Row>
          <Row gutter={24} style={{ margin: "2rem 0 0 0 " }}>
            <Col span={24}>
              <Tabs
                type="card"
                onChange={(v) => {
                  setActiveKey(v);
                }}
                activeKey={activeKey}
                items={[
                  {
                    label: `Account Information`,
                    key: "account-info",
                    children: <Card size="small">
                      <AccountInformation dealerId={data._id} state={state} />
                    </Card>,
                  },
                  {
                    label: `Ledger`,
                    key: "ledger",
                    children: <Card size="small">Two</Card>,
                  },
                  {
                    label: `Bidding Car`,
                    key: "bidding-car",
                    children: (
                      <Card size="small">
                        <BiddingCarTab dealerId={data._id} />
                      </Card>
                    ),
                  },
                  {
                    label: `Market Place`,
                    key: "market-place",
                    children: <Card size="small">
                      <MarketPlaceTab dealerId={data._id} />
                    </Card>,
                  },
                  {
                    label: `Sold Cars`,
                    key: "sold-cars",
                    children: <Card size="small">Five</Card>,
                  },
                  {
                    label: `Purchased Cars`,
                    key: "purchased-cars",
                    children: <Card size="small">Six</Card>,
                  },
                ]}
              />
            </Col>
          </Row>
        </Spin>
      </Modal>
    </>
  );
});

const BiddingCarTab = ({ dealerId }) => {
  const [ajxRequesting, setAjxRequesting] = useState(true);
  const [biddingCars, setBiddingCars] = useState([]);

  function list() {
    setAjxRequesting(true);
    serviceDealerCar
      .list({ dealerId })
      .then((res) => {
        setBiddingCars(res.data);
        setAjxRequesting(false);
      })
      .catch((err) => { })
      .finally(() => {
        setAjxRequesting(false);
      });
  }

  useEffect(() => {
    list();
  }, [dealerId]);

  let data = {
    img: [
      "https://images.unsplash.com/photo-1654157925394-4b7809721149?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1460&q=80",
      "https://images.unsplash.com/photo-1654157925394-4b7809721149?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1460&q=80",
    ],

    title: "Cars",
    Price: "$99798878",
    description:
      "Rishawa motors collect and monitor list of app in your device for credit debit enrichmentRishawa motors collect and monitor list of app in your device for credit debit enrichmentRishawa motors collect and monitor list of app in your device for credit debit enrichmentRishawa motors collect and monitor list of app in your device for credit debit enrichmentRishawa motors collect and monitor list of app in your device for credit debit enrichmentRishawa motors collect and monitor list of app in your device for credit debit enrichment",
  };
  return (
    <>
      <Spin spinning={ajxRequesting}>
        <Row style={{ color: "red" }} gutter={[24]}>
          {biddingCars.map((v) => (
            <Col span={6}>
              <Card style={{ background: "#e1ebf2" }}>
                <Carousel dots={true}>
                  {v?.exteriorImageVideos?.map((vv) => {
                    return (
                      <div>
                        <Image
                          preview={false}
                          style={{ width: "280px", height: "210px" }}
                          src={vv}
                          alt="exterior-images"
                        />
                      </div>
                    );
                  })}
                  {v?.interiorImageVideos?.map((vv) => {
                    return (
                      <div>
                        <Image
                          preview={false}
                          style={{ width: "280px", height: "210px" }}
                          src={vv}
                          alt="exterior-images"
                        />
                      </div>
                    );
                  })}
                </Carousel>
                <Row gutter={[10, 10]}>
                  <Col span={24}>2014 NISSAN SUNNY XV-DIESEL</Col>
                  <Col span={24}>
                    <Space size={[0, 8]} wrap>
                      <Tag
                        color="rgb(165 205 235)"
                        style={{ color: "black", borderRadius: "5px" }}
                      >
                        {v?.fuelType}
                      </Tag>
                      <Tag
                        color="rgb(165 205 235)"
                        style={{ color: "black", borderRadius: "5px" }}
                      >
                        {v?.kmsDriven} kms
                      </Tag>
                      <Tag
                        color="rgb(165 205 235)"
                        style={{ color: "black", borderRadius: "5px" }}
                      >
                        {v?.numberOfOwners == 1 ? "1st Owner" : null}
                        {v?.numberOfOwners == 2 ? "2nd Owner" : null}
                        {v?.numberOfOwners == 3 ? "3rd Owner" : null}
                      </Tag>
                    </Space>
                  </Col>
                  <br />
                  <Col span={24}>
                    <Row justify={"space-between"}>
                      <Col span={14} style={{ background: "#003D78 0%" }}>
                        <div
                          style={{
                            padding: "5px",
                            color: "white",
                            fontWeight: "600",
                          }}
                        >
                          <span>Highest Bid</span>{" "}
                          <span style={{ float: "right" }}>₹ {util.convertToCommaSeperatedValue(v?.liveBiddingDetails?.[0].lastBid)}</span>
                        </div>
                      </Col>
                      <Col span={10} style={{ background: "rgb(0, 61, 120)" }}>
                        <div className="proPrice">
                          <div
                            style={{
                              color: "white",
                              fontWeight: "500",
                              margin: "10px 0 0 20px",
                            }}
                          >
                             <Timer now={new Date(v?.liveBiddingDetails?.[0].startTime)} endTime={new Date(v?.liveBiddingDetails?.[0].endTime)} />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <br />
                  <br />
                  <Col span={24}>
                    <Space size={[10, 8]} wrap>
                      <HeartOutlined style={{ fontSize: "20px" }} />
                      <BookOutlined style={{ fontSize: "20px" }} />
                      <TwitterOutlined style={{ fontSize: "20px" }} />
                    </Space>
                  </Col>
                  <br />
                  <Col span={24}>
                    <div>{util.convertToCommaSeperatedValue(v.likeCount)} Likes</div>
                  </Col>
                  <br />
                  <Col span={24}>
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 2,
                        expandable: true,
                        symbol: "more",
                      }}
                    >
                      {v?.information}
                    </Typography.Paragraph>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

    </>
  );
};

const MarketPlaceTab = ({ dealerId }) => {
  const [ajxRequesting, setAjxRequesting] = useState(true);
  const [marketPlaceCars, setMarketPlaceCars] = useState([]);

  function list() {
    setAjxRequesting(true);
    serviceDealerCar
      .list({ dealerId, type: "Market" })
      .then((res) => {
        setMarketPlaceCars(res.data);
        setAjxRequesting(false);
      })
      .catch((err) => { })
      .finally(() => {
        setAjxRequesting(false);
      });
  }

  useEffect(() => {
    list();
  }, [dealerId]);

  let data = [{
    img: [
      "https://images.unsplash.com/photo-1654157925394-4b7809721149?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1460&q=80",
      "https://images.unsplash.com/photo-1654157925394-4b7809721149?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1460&q=80",
    ],

    title: "Cars",
    Price: "$99798878",
    description:
      "Rishawa motors collect and monitor list of app in your device for credit debit enrichmentRishawa motors collect and monitor list of app in your device for credit debit enrichmentRishawa motors collect and monitor list of app in your device for credit debit enrichmentRishawa motors collect and monitor list of app in your device for credit debit enrichmentRishawa motors collect and monitor list of app in your device for credit debit enrichmentRishawa motors collect and monitor list of app in your device for credit debit enrichment",
  }];
  return (
    <>
      <Spin spinning={ajxRequesting}>
        <Row style={{ color: "red" }}>
          {marketPlaceCars.map((v) => (
            <Col span={6}>
              <Card style={{ background: "#e1ebf2" }}>
                <Carousel dots={true}>
                  {v?.exteriorImageVideos?.map((vv) => {
                    return (
                      <div>
                        <Image
                          preview={false}
                          style={{ width: "280px", height: "210px" }}
                          src={vv}
                          alt="exterior-images"
                        />
                      </div>
                    );
                  })}
                  {v?.interiorImageVideos?.map((vv) => {
                    return (
                      <div>
                        <Image
                          preview={false}
                          style={{ width: "280px", height: "210px" }}
                          src={vv}
                          alt="exterior-images"
                        />
                      </div>
                    );
                  })}
                </Carousel>
                <Row gutter={[10, 10]}>
                  <Col span={24}>2014 NISSAN SUNNY XV-DIESEL</Col>
                  <Col span={24}>
                    <Space size={[0, 8]} wrap>
                      <Tag
                        color="rgb(165 205 235)"
                        style={{ color: "black", borderRadius: "5px" }}
                      >
                        {v?.fuelType}
                      </Tag>
                      <Tag
                        color="rgb(165 205 235)"
                        style={{ color: "black", borderRadius: "5px" }}
                      >
                        {v?.kmsDriven} kms
                      </Tag>
                      <Tag
                        color="rgb(165 205 235)"
                        style={{ color: "black", borderRadius: "5px" }}
                      >
                        {v?.numberOfOwners == 1 ? "1st Owner" : null}
                        {v?.numberOfOwners == 2 ? "2nd Owner" : null}
                        {v?.numberOfOwners == 3 ? "3rd Owner" : null}
                      </Tag>
                    </Space>
                  </Col>
                  <br />
                  <Col span={24}>
                    <Row justify={"space-between"}>
                      <Col span={14} style={{ background: "#003D78 0%" }}>
                        <div
                          style={{
                            padding: "5px",
                            color: "white",
                            fontWeight: "600",
                          }}
                        >
                          <span>₹ {util.convertToCommaSeperatedValue(v?.askingPrice)}</span>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <br />
                  <br />
                  <Col span={24}>
                    <Space size={[10, 8]} wrap>
                      <HeartOutlined style={{ fontSize: "20px" }} />
                      <BookOutlined style={{ fontSize: "20px" }} />
                      <TwitterOutlined style={{ fontSize: "20px" }} />
                    </Space>
                  </Col>
                  <br />
                  <Col span={24}>
                    <div>{util.convertToCommaSeperatedValue(v.likeCount)} Likes</div>
                  </Col>
                  <br />
                  <Col span={24}>
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 2,
                        expandable: true,
                        symbol: "more",
                      }}
                    >
                      {v?.information}
                    </Typography.Paragraph>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

    </>
  );
};

const AccountInformation = ({ dealerId, state }) => {
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);

  const handleChange = (v, k) => {
    let varDt = data;
    if (k) {
      let keys = k.split('.');
      for (let i = 0; i < keys.length; i++) {
        if (i + 1 === keys.length) {
          varDt[keys[i]] = v;
        } else {
          if (typeof varDt[keys[i]] === 'undefined') {
            if (parseInt(keys[i + 1]) * 1 >= 0) {
              varDt[keys[i]] = [];
            } else {
              varDt[keys[i]] = {};
            }
          } varDt = varDt[keys[i]];
        }
      }
    }
    setData({ ...data, ...v });

  }

  const save = () => {
    setAjxRequesting(true);
    serviceDealer.save(data).then((res) => {
      message.success(res.message);
      details();
    }).catch(err => {
      if (typeof err.message === 'object') {
        let dt = err.message[Object.keys(err.message)[0]];
        message.error(dt);
      } else {
        message.error(err.message);
      }
    }).finally(() => {
      setAjxRequesting(false);
    });
  }
  const details = () => {
    setAjxRequesting(true);
    serviceDealer.details(dealerId).then((res) => {
      message.success(res.message);
      setData(res.data)
    }).catch(err => {
      if (typeof err.message === 'object') {
        let dt = err.message[Object.keys(err.message)[0]];
        message.error(dt);
      } else {
        message.error(err.message);
      }
    }).finally(() => {
      setAjxRequesting(false);
    });
  }

  useEffect(() => {
    details()

  }, [])

  return (
    <>
      {/* onSubmitCapture={save} */}
      <Spin spinning={ajxRequesting}>
        <Form layout="vertical">
          <Row gutter={10}>
            <Col span={12}>
              <Col span={24}>
                <Form.Item label="Photo" style={{ width: "300px" }}>
                  <UploadImage
                    value={data.avatar ? data.avatar : []}
                    onChange={v => setData({ ...data, avatar: v?.[0] })}
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Phone Numbers">
                  {
                    data?.phones?.length > 0 ?
                      <Col span={24}>
                        <PhoneNumbers {...{ variantDetails: data?.phones, parentKay: 'phone', handleChange }} />
                      </Col>
                      :
                      <Col span={24}>
                        <Input placeholder="Phone" onChange={(e) => { handleChange({ phones: [e.target.value] }, `phone.${0}`) }} />
                      </Col>
                  }
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Crz" required>
                  <Input placeholder="Crz" addonBefore="CRZ" value={data.crz || ''} onChange={e => { handleChange({ crz: e.target.value }) }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="User Name" required>
                  <Input placeholder="User Name" value={data.name || ''} onChange={e => { handleChange({ name: e.target.value }) }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Rto" required>
                  <Input placeholder="Rto" value={data.rto || ''} onChange={e => { handleChange({ rto: e.target.value }) }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Dealership Name" required>
                  <Input placeholder="dealershipName" value={data.dealershipName || ''} onChange={e => { handleChange({ dealershipName: e.target.value }) }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Email" required>
                  <Input placeholder="Email" value={data.email || ''} onChange={e => { handleChange({ email: e.target.value }) }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Address" required>
                  <Input placeholder="Address" value={data.address || ''} onChange={e => { handleChange({ address: e.target.value }) }} />
                </Form.Item>
              </Col>
              <Row gutter={5}>
                <Col span={12}>
                  <Form.Item label="State" required>
                    <Select defaultValue={true} value={data.stateId} onChange={e => { handleChange({ stateId: e }) }}
                      options={
                        state?.map(v => (
                          {
                            value: v?._id,
                            label: v?.name,
                          }
                        ))
                      }
                    >
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Pin Code" required>
                    <Input placeholder="Pin Code" value={data.pinCode || ''} onChange={e => { handleChange({ pinCode: e.target.value }) }} />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Current Status" required>
                    <Select defaultValue={true} value={data.status} onChange={e => { handleChange({ status: e }) }}>
                      <Select.Option value={true}>Active</Select.Option>
                      <Select.Option value={false}>Inactive</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="Status" required>
                    <Select defaultValue={false} value={data.isBlocked} onChange={e => { handleChange({ isBlocked: e }) }}>
                      <Select.Option value={false}>Verified</Select.Option>
                      <Select.Option value={true}>Unverified</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Typography.Text>Upload Document</Typography.Text>
              <Divider />

              <Col span={24}>
                <Form.Item label="Aadhaar No." required>
                  <Input placeholder="Aadhaar No.." value={data.aadhaarNo || ''} onChange={e => { handleChange({ aadhaarNo: e.target.value }) }} />
                </Form.Item>
              </Col>
              <Row>
                <Col span={12}>
                  <Form.Item label="AADAR CARD FRONT">
                    <UploadImage
                      value={data.adharFrontImgUrl ? [data.adharFrontImgUrl] : []}
                      onChange={v => setData({ ...data, adharFrontImgUrl: v?.[0] })}
                      listType="picture-card"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="AADAR CARD BACK">
                    <UploadImage
                      value={data.adharBackImgUrl ? [data.adharBackImgUrl] : []}
                      onChange={v => setData({ ...data, adharBackImgUrl: v?.[0] })}
                      listType="picture-card"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Col span={24}>
                <Form.Item label="Pan No." required>
                  <Input placeholder="Pan No." value={data.panNo || ''} onChange={e => { handleChange({ panNo: e.target.value }) }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="PAN CARD PHOTO">
                  <UploadImage
                    value={data.panCardimgUrl ? [data.panCardimgUrl] : []}
                    onChange={v => setData({ ...data, panCardimgUrl: v?.[0] })}
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="Shop Photo (Optional)">
                  <UploadImage
                    value={data.shopPhotoUrl ? [data.shopPhotoUrl] : []}
                    onChange={v => setData({ ...data, shopPhotoUrl: v?.[0] })}
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Typography.Text>Dealership Registration Certificate</Typography.Text>
                <Form.Item label="Document Type : Certificate">
                  <UploadImage
                    value={data.registrationCertImgUrl ? [data.registrationCertImgUrl] : []}
                    onChange={v => setData({ ...data, registrationCertImgUrl: v?.[0] })}
                    listType="picture-card"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Typography.Text>GST Certificate (Optional)</Typography.Text>
                <Form.Item>
                  <Input placeholder="Aadhaar No.." value={data.gstNo || ''} onChange={e => { handleChange({ gstNo: e.target.value }) }} />
                </Form.Item>
                <UploadImage
                  value={data.gstImgUrl ? [data.gstImgUrl] : []}
                  onChange={v => setData({ ...data, gstImgUrl: v?.[0] })}
                  listType="picture-card"
                />
              </Col>
            </Col>
            <Row>
              <Col span={24} >
                <Button key="save" type="primary" onClick={save}>Update Dealer Information</Button>
              </Col>
            </Row>
          </Row>
        </Form>
      </Spin>
    </>
  );
};

function PhoneNumbers({ variantDetails: data, parentKay, handleChange }) {

  return (
    <>
      <Table
        {...{
          bordered: true,
          size: 'small',
          showHeader: true,
          footer: null,
          tableLayout: undefined,
        }}

        pagination={{ position: ['none'] }}
        columns={
          [

            {

              width: 300,
              render: (v, row, i) => {
                return <>

                  <Input placeholder="Phone" value={v} onChange={(e) => { data[i] = (e.target.value); handleChange([...data,], `${parentKay}.${i}`) }} />

                </>
              }
            },
            {

              width: 100,
              render: (v, row, i) => {
                return <>
                  {
                    i + 1 === data?.length
                      ? <Button icon={<PlusOutlined />} shape="circle" type="dashed" onClick={() => { data.push(""); handleChange([...data], parentKay); }} />
                      : null
                  }
                  {
                    i + 1 === data?.length && i !== 0
                      ? <Button icon={<CloseOutlined />} shape="circle" type="dashed" className="mx-2" danger onClick={() => { data.pop(); handleChange([...data], parentKay); }} />
                      : null
                  }
                </>
              }
            }
          ]
        }

        dataSource={data?.length ? data?.map((v, i) => (v)) : []}
      />
    </>
  );
}

const Timer = ({ endTime }) => {
  const [now, setNow] = useState(new Date());
  const [timer, setTimer] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date()); // Update the current time

      const distance = endTime.getTime() - now.getTime();

      if (distance <= 0) {
        clearInterval(interval);
        setTimer("Bidding Over");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimer(`${hours.toString().padStart(2, "0")}h ${minutes.toString().padStart(2, "0")}m ${seconds.toString().padStart(2, "0")}s`);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [now, endTime]);

  return <div>{timer}</div>;
};
