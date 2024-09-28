import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import transactionService from "../../services/transaction";
import util from "../../utils/util";
import { Button, Card, Col, Form, Input, Row, Space, Table, Tag, Typography } from "antd";
import { FaLongArrowAltLeft } from "react-icons/fa";
import Pagination from "../components/Pagination";



const Transaction = () => {
  const [ar, setAr] = useState({
    viewAccess: util.checkRightAccess("super-admin-access-list"),
    addAccess: util.checkRightAccess("super-admin-access-add"),
    editAccess: util.checkRightAccess("super-admin-access-edit"),
    deleteAccess: util.checkRightAccess("super-admin-access-delete"),
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qData, setQData] = useState({ page: 1, limit: 20 });
  const navigate = useNavigate();


  async function list() {
      setLoading(true);
      
      try {
          const res = await transactionService.transactionList(qData);
          setData(res.data?.map((v) => ({ ...v, key: v._id })));
          setQData({
              ...qData,
              limit: res.extra.limit,
              page: res.extra.page,
              total: res.extra.total,
            });
        } catch (error) {
          console.log('list' ,error)
        // Handle error appropriately here
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    
  }
  

  useEffect(() => {
    list();
  }, []);


console.log(data , "dhvfgdvb")
  const columns = [
    {
      title: "#",
      width: 40,
      render: (v, row, i) => <b>{i + 1}</b>,
    },

    {
      title: "Products",
      dataIndex: "products",
      width: 100,
      render: (v, row) => (
        <Space>
            {console.log(v)}
         {
        row?.products?.map((v) => v.productDetails?.name )
         }
        </Space>
      ),
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      width: 150,
      render: (v, row) => (
        <Space>
          <span style={{ fontWeight: 600 }}>{v}</span>
        </Space>
      ),
    },
    {
      title: "Transaction Type",
      dataIndex: "transaction_type",
      width: 150,
      render: (v) => (
        <Tag
          key={v?._id}
          className="custom-tag overflow-hidden "
          color="#2db7f5"
          fontSize={20}
          borderRadiusSM
        >
          {v.toUpperCase() || "UNKNOWN"}
        </Tag>
      ),
    },

    {
        title: "Transaction ID",
        dataIndex: "_id",
        width: 150,
        render: (v) => (
          <Tag
     
          >
            {v}
          </Tag>
        ),
      },
    {
      title: "Date",
      dataIndex: "transaction_date",
      width: 100,

      render: (v, row) => (
        <Space>
          <span style={{ fontWeight: 600 }}>{v?.split("T")?.[0]}</span>
        </Space>
      ),
    },


   
 
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (v, row) => {
       
        return    <Tag
        className="custom-tag"
        color="#87d068"
        fontSize={20}
        borderRadiusSM
      >
        {v}
      </Tag>
            
        

      },
    },
   
  ].filter((item) => !item.hidden);



  const tableColumns = columns?.map((item) => ({ ...item, ellipsis: false }));
  tableColumns[0].fixed = true;
  tableColumns[tableColumns.length - 1].fixed = "right";

  const tableProps = {
    bordered: true,
    loading,
    size: "small",
    title: () => (
      <Search {...{   qData, setQData, list, ar }} />
    ),
    showHeader: true,
    footer: () => <Pagination {...{ qData, setQData }} />,
    tableLayout: undefined,
  };


  return <>
  
  
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
              List of transactions
            </Typography.Title>
          </div>
        </Col>

       
  
      </Row>

      <Card
        bordered={false}
        size="small"
        className="shadow_1 br-10"
        style={{ marginTop: "15px" }}
      >
        <Table
          {...tableProps}
          pagination={{ position: ["none"], pageSize: qData.limit }}
          columns={tableColumns}
          dataSource={data.length ? data : []}
          scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
        />

      </Card>
  </>;
};

export default Transaction;



function Search({ qData, setQData, list }) {
    return (
      <Form onSubmitCapture={list}>
        <Row gutter={12}>
          <Col span={6}>
            <Input
              placeholder="Search by Title"
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