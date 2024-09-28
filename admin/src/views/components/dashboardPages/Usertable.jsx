import React from 'react'
import {
    Row,
    Col,
    Card,
    Radio,
    Table,
    Upload,
    message,
    Progress,
    Button,
    Avatar,
    Typography,
} from "antd";

import { ToTopOutlined } from "@ant-design/icons";
// Images
import ava1 from "../../../assets/images/logo-shopify.svg";
import ava2 from "../../../assets/images/logo-atlassian.svg";
import ava3 from "../../../assets/images/logo-slack.svg";
import ava5 from "../../../assets/images/logo-jira.svg";
import ava6 from "../../../assets/images/logo-invision.svg";
import face from "../../../assets/images/face-1.jpg";
import face2 from "../../../assets/images/face-2.jpg";
import face3 from "../../../assets/images/face-3.jpg";
import face4 from "../../../assets/images/face-4.jpg";
import face5 from "../../../assets/images/face-5.jpeg";
import face6 from "../../../assets/images/face-6.jpeg";
import pencil from '../../../assets/images/pencil.svg';




const Usertable = () => {
    const { Title } = Typography;

    const columns = [
        {
            title: "Product",
            dataIndex: "prodcut",
            key: "product",
            width: "32%",
        },
        {
            title: "Order Placed",
            dataIndex: "order_placed",
            key: "email",
        },

        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },

        {
            title: "Paymnet Status",
            key: "status",
            dataIndex: "status",
        },
        {
            title: "Order Status",
            key: "status",
            dataIndex: "status",
        },
        {
            title: "Date",
            key: "date",
            dataIndex: "date",
        },
    ];

    const data = [
        {
            key: "1",
            name: (
                <>
                    <Avatar.Group>
                        <Title level={5}>Michael John</Title>

                    </Avatar.Group>
                </>
            ),
            email: (
                <>
                    <div className="author-info">
                        <Title level={5}>email@gmail.com</Title>

                    </div>
                </>
            ),

            status: (
                <>
                    <Button type="primary" danger className="tag-primary">
                        Pending
                    </Button>
                </>
            ),
            date: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>

                    </div>
                </>
            ),
        },

        {
            key: "2",
            name: (
                <>
                    <Avatar.Group>
                        <Title level={5}>Michael John</Title>

                    </Avatar.Group>
                </>
            ),
            email: (
                <>
                    <div className="author-info">
                        <Title level={5}>email@gmail.com</Title>

                    </div>
                </>
            ),

            status: (
                <>
                    <Button type="primary" className="tag-primary" danger>
                        Pending
                    </Button>
                </>
            ),
            date: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>

                    </div>
                </>
            ),
        },

        {
            key: "3",
            name: (
                <>
                    <Avatar.Group>
                        <Title level={5}>Michael John</Title>

                    </Avatar.Group>
                </>
            ),
            email: (
                <>
                    <div className="author-info">
                        <Title level={5}>email@gmail.com</Title>

                    </div>
                </>
            ),

            status: (
                <>
                    <Button type="primary" className="tag-primary" style={{ backgroundColor: "green" }}>
                        Deleveried
                    </Button>
                </>
            ),
            date: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>

                    </div>
                </>
            ),
        },
        {
            key: "3",
            name: (
                <>
                    <Avatar.Group>
                        <Title level={5}>Michael John</Title>

                    </Avatar.Group>
                </>
            ),
            email: (
                <>
                    <div className="author-info">
                        <Title level={5}>email@gmail.com</Title>

                    </div>
                </>
            ),

            status: (
                <>
                    <Button type="primary" className="tag-primary" style={{ backgroundColor: "green" }}>
                        Deleveried
                    </Button>
                </>
            ),
            date: (
                <>
                    <div className="ant-employed">
                        <span>23/04/18</span>

                    </div>
                </>
            ),
        },

    ];



    return (
        <>
            <Card
                bordered={false}
                className="criclebox tablespace mb-24"
                title={<strong>Recent Orders </strong>}


            >
                <div className="table-responsive">
                    <Table
                        columns={columns}
                        dataSource={data}
                        pagination={true}
                        className="ant-border-space"
                    />
                </div>
            </Card>
        </>

    )
}

export default Usertable    