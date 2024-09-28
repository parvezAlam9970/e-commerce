import {
    Card, Col, Row, Typography,
} from "antd";
import { cart, dollor, heart, profile } from "../../utlis";
import { BiDollar } from "react-icons/bi";
import { IoMdPeople } from "react-icons/io";
import { FaShoppingBag } from "react-icons/fa";
import Usertable from "../components/dashboardPages/Usertable";
import LineChart from "../components/charts/LineChart";
import ApexChart from "../components/charts/PiChart";




const App = () => {
    const { Title, Paragraph, Text, Link } = Typography;


    const count = [
        {
            today: "Today’s Sales",
            title: "$53,000",
            persent: "+30%",
            icon: <BiDollar />,
            bnb: "bnb2",
        },
        {
            today: "Today’s Users",
            title: "3,200",
            persent: "+20%",
            icon: <IoMdPeople />,
            bnb: "bnb2",
        },
        {
            today: "New Orders",
            title: "+1,200",
            persent: "-20%",
            icon: <FaShoppingBag />,
            bnb: "redtext",
        },
        {
            today: "Total Income",
            title: "$13,200",
            persent: "10%",
            icon: <BiDollar />,
            bnb: "bnb2",
        },
    ];


    return (
        <>
            <Row className="rowgap-vbox" gutter={[24, 0]} style={{ marginBottom: "24px" }}>
                {count.map((c, index) => (
                    <Col
                        key={index}
                        xs={24}
                        sm={24}
                        md={12}
                        lg={6}
                        xl={6}
                        className="mb-24"
                    >
                        <Card bordered={false} className="criclebox ">
                            <div className="number">
                                <Row align="middle" gutter={[20, 0]} >
                                    <Col xs={18}>
                                        <Text strong type="secondary" >{c.today}</Text>
                                        <Title level={3} style={{ marginTop: "10px" }}>
                                            <strong>{c.title}</strong> <small className={c.bnb}>{c.persent}</small>
                                        </Title>
                                    </Col>
                                    <Col xs={6}>
                                        <div className="icons_style">
                                            {c.icon}
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* <Row gutter={16}>
                <Col span={16}>

                    <Card bordered={false} className="criclebox h-full">
                        <LineChart />
                    </Card>


                </Col>
                <Col span={8}>
                    <Card bordered={false} className="criclebox h-full shadow_1">
                        <h1>
                            Transactions
                        </h1>
                        <ApexChart />
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginTop: "15px" }}>
                <Col span={24}>
                    <Usertable />
                </Col>
            </Row> */}



        </>
    );
};

export default App;