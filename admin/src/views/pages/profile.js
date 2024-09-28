import { Form, Spin, Row, Col, message, Divider, Input, Button, Select, Tag } from 'antd';
import React, { useEffect, useState } from "react";
import service from "../../services/user"
import serviceState from '../../services/state';
import serviceCity from '../../services/city';
import { LoadingOutlined } from '@ant-design/icons';
import util from '../../utils/util';
import ProfileDetails from '../components/dashboardPages/profileDetails';
import UploadImage from '../../utils/UploadImage';
import {UploadOutlined} from '@ant-design/icons';

const Profile = () => {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const handleChange = (value) => {
        setData({ ...data, ...value });
    }

    function list() {
        setLoading(true);
        service.profile().then(res => {
            setData(res.data.result || {});
        }).catch(err => {
            message.error(err.message, 'error');
        }).finally(() => {
            setLoading(false);
        });
    }

    console.log(data)
    useEffect(() => {
        list();
    }, []);


    const save = () => {
        // setAjxRequesting(true);
        service.saveProfile(data).then((res) => {
            message.success(res.message);
            // window.location.reload();
            // setOpen(false);
            list();
        }).catch(err => {
            if (typeof err.message === 'object') {
                let dt = err.message[Object.keys(err.message)[0]];
                message.error(dt);
            } else {
                message.error(err.message);
            }
        }).finally(() => {
            // setAjxRequesting(false);
        });
    }
    console.log(data)

    return (
        <div className='shadow_1' style={{background : "white" , padding :"20px" , borderRadius : "10px"}}>
            <ProfileDetails data={data} />
            <Spin spinning={loading} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                <Divider />

                <Form layout="vertical">
                    <Row gutter={[12, 2]}>
                        <Col span={24}>
                            <Row gutter={[12, 10]}>
                                <Col span={12}>
                                    <Form.Item label='First Name'>
                                        <Input placeholder="Your First Name" value={data?.firstName} onChange={e => { handleChange({ firstName: e.target.value }); }} />
                                        <Divider style={{ margin: 0 }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Last Name'>
                                        <Input placeholder="Your Last Name" value={data?.lastName} onChange={e => { handleChange({ lastName: e.target.value }); }} />
                                        <Divider style={{ margin: 0 }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Phone Number'>
                                        <Input placeholder='7485961230' value={data?.phone} onChange={e => { handleChange({ phone: e.target.value }); }} />
                                        <Divider style={{ margin: 0 }} />
                                    </Form.Item>
                                </Col>

                                <Col span={12}>
                                    <Form.Item label='Email'>
                                        <Input placeholder="test@arramton.com" value={data?.email} onChange={e => { handleChange({ email: e.target.value }); }} disabled />
                                        <Divider style={{ margin: 0 }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label='Postal Code'>
                                        <Input placeholder="210301" value={data?.pinCode} onChange={e => { handleChange({ pinCode: e.target.value }); }} />
                                        <Divider style={{ margin: 0 }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                <Form.Item
                                    name="thumbnail"
                                    label="Thumbnail"
                                    rules={[{ required: true, message: 'Please upload a thumbnail!' }]}
                                >
                                    <UploadImage value={data.avatar ? [data.avatar] : []}
                                        onChange={(v) => { setData({ ...data, avatar: v?.[0] }); }}
                                        listType="picture"
                                        uploadButton={
                                            <Tag style={{ width: "100%", padding: 10 }}>
                                                <Button block size="large" type="link" icon={<UploadOutlined />}>Upload</Button>
                                            </Tag>
                                        }
                                    />
                                </Form.Item>
                            </Col>
                              
                            </Row>
                        </Col>
                        <Button style={{ marginTop: '20px', marginLeft: '20px' }} type='primary' onClick={() => save()}>Update All</Button>
                    </Row>
                </Form>
            </Spin>
        </div>
    );
};
export default Profile;