import React, { useState } from "react";
import { Row, Col, Layout, theme, Button } from "antd";
import { Routes, Route } from "react-router-dom";
import Menu from "./Menu";
import routes from "./route";
import Breadcrumb from "./Breadcrumb";
import Error404 from "../pages/errors/Error404";
import Top from "./Top";
import { Logo, LogoSmall, MenuFold } from '../components/svgIcons';
import { Link } from 'react-router-dom';

let customLayout = {
    overflow: "auto",
    margin: "12px",
    backgroundColor: "transparent",
    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
    borderRadius : "10px",
    position : "sticky",
    top : "100px"
    
};



const newRoutes = [];
function convertMultiToSingle(arr, prevBaseUrl = '') {
    arr.forEach(v => {
        if (v.children) {
            convertMultiToSingle(v.children, prevBaseUrl + v.url);
        } else {
            newRoutes.push({ ...v, url: prevBaseUrl + v.url })
        }
    })
}
convertMultiToSingle([...routes]);


export default function MyLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer } } = theme.useToken();

    return (
        <>
            <Layout>
                <Layout.Sider width={250} style={customLayout} collapsible={false} collapsed={collapsed} >
                    <Layout.Header style={{ padding: 10, background: colorBgContainer }}>
                        <Link to="/"> {collapsed ? <LogoSmall /> : <Logo />} </Link>
                    </Layout.Header>
                    <Menu />
                </Layout.Sider>
                <Layout>
                    <Layout.Header className="shadow_1 br-10"   style={{  paddingRight: "10px", marginTop :"10px"  , height : "70px" , background: colorBgContainer }} >
                        <Row>
                            <Col span={24}>
                                <Row justify="space-between" align="middle">
                                    <Col span={4}>
                                        <Button size="small" type="text" icon={<MenuFold />} onClick={() => setCollapsed(!collapsed)} />
                                    </Col>
                                    <Col span={20}>
                                        <Top />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Layout.Header>
                    <Layout.Content style={{ padding: 24 }}>
                        <Routes>
                            {newRoutes.map((v) => <Route path={v.url} key={v.url} element={<v.component />} />)}
                            <Route path={'*'} element={<Error404 />} />
                        </Routes>
                    </Layout.Content>
                </Layout>
            </Layout>
        </>
    );
}