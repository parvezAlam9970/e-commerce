/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Layout, Typography, Divider, Tabs, message, Card } from 'antd';
import Profile from './profile';
import ChangePassword from './changePass';
import service from '../../services/user';
import UploadImage from '../../utils/UploadImage';
import util from '../../utils/util';
const { Sider, Content } = Layout;


const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    // color: '#fff',
    backgroundColor: 'white',
};
const siderStyle = {
    textAlign: 'center',
    lineHeight: '50px',
    backgroundColor: 'white',
    marginLeft: '20px',
    boxShowdow: '10px'
};

const AdminProfile = () => {

    const [type, setType] = useState('todaysFollowUp');
    const [data, setData] = useState('');
    const [fileList, setFileList] = useState([]);

    function profileDetails() {
        service.profile().then(res => {
            setData(res.data.result || {});
            setFileList(util.getFileFormat(res.data.result.avatar));
        }).catch(err => {
            message(err.message, 'error');
        }).finally(() => {
        });
    }

    useEffect(() => {
        profileDetails();
    }, []);

    useEffect(() => {
        if (fileList?.[0]?.url) {
            service.changeAvatar({ avatar: fileList[0].url });
        }
    }, [fileList])


    return (
        <>
            <div className='bannerImg'>
                <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="Banner" />
            </div>
            <Card hoverable className='profile-wrapper' style={{ backgroundColor: "transparent", marginTop: "8rem", border: "none" }}>

                <Layout style={{ backgroundColor: "transparent" }}>
                    <Card hoverable>
                        <Sider style={siderStyle}>
                            <UploadImage
                                value={data.avatar ? [data.avatar] : []}
                                onChange={v => setData({ ...data, avatar: v?.[0] })}
                                listType="picture-card"
                            />
                            {/* <Image src={data?.avatar} style={{ marginTop: "20px", }} width={120} height={120} preview={false} /> */}
                            <Typography.Title level={4} ><b>{data?.firstName} {data?.lastName}</b></Typography.Title>
                            <Divider />
                            <Typography.Title level={5} ><b> 😉 Hello {data?.firstName} {data?.lastName}</b></Typography.Title>
                            <Divider />
                            <Typography.Title level={4} ><b> Contact Number</b></Typography.Title>
                            <Typography.Title level={5} style={{ margin: 0 }} > {data?.phone}</Typography.Title>
                            <Divider />
                            <Typography.Title level={4} ><b> Email Id</b></Typography.Title>
                            <Typography.Title level={5} style={{ margin: 0 }} > {data?.email}</Typography.Title>
                            <Divider />
                        </Sider>
                    </Card>
                    <Card hoverable style={{ marginLeft: '20px' }}>
                        <Layout >
                            <Content style={contentStyle}>
                                <Tabs
                                    type="card"
                                    style={{ marginLeft: '20px' }}
                                    onChange={(v) => { setType(v) }}
                                    items={[
                                        {
                                            label: "Account Setting",
                                            key: 'accountSetting',
                                            children: <Profile />,
                                        },
                                        {
                                            label: "Change Password",
                                            key: 'changePassword',
                                            children: <ChangePassword />,
                                        },
                                    ]}
                                />
                            </Content>
                        </Layout>
                    </Card>
                </Layout>
            </Card>
        </>

    )
}

export default AdminProfile;