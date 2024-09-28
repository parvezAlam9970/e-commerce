import { Input, Button, Row, Col, Form, message } from 'antd';
import { Logo } from '../components/svgIcons';
import { useState } from 'react';
import service from '../../services/user';
import util from '../../utils/util';

export default function Login() {
    const [data, setData] = useState({});
    const [ajxRequesting, setAjxRequesting] = useState(false);

    const login = () => {
        setAjxRequesting(true);
        service.login({ ...data }).then(res => {
            message.success(res.message);
            util.setUserData(res.data);
            window.location.reload();
        }).catch((err) => {
            if (typeof err.message !== 'string') {
                message.error(err.message[Object.keys(err.message)[0]][0]);
            } else {
                message.error(err.message);
            }
        }).finally(() => {
            setAjxRequesting(false);
        });
    }

    return (
        <>

            <div style={{ background: "#ff6a02", height: '100vh' }}>
                <div span={24} className="login-form-logo">
                    <Row justify="center">
                        <Col span={24} >
                            <Row justify="center">
                                <Col>
                                    <Logo height={100} width={400} />
                                </Col>
                            </Row>


                        </Col>
                    </Row>
                </div>

                <div span={24} className="login-form">
                    <Row justify="center" style={{ width: '100%' }}>
                        <Col span={24} style={{ backgroundColor: 'white', padding: '50px 50px' }} >
                            <Form layout="vertical" size="large" onSubmitCapture={login}>
                                <Row gutter={[12, 2]} span={20}>
                                    <Col span={24}>
                                        <Form.Item label="User name">
                                            <Input placeholder="User name" value={data.email} onChange={e => { setData({ ...data, email: e.target.value }) }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label="Password">
                                            <Input.Password placeholder="Password" value={data.password} onChange={e => { setData({ ...data, password: e.target.value }) }} />
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Form.Item label=" ">
                                            <Button type="primary" htmlType="submit" block loading={ajxRequesting}>Login</Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                    <div className="login-form-bottom"></div>
                </div>
            </div>
        </>
    );
};