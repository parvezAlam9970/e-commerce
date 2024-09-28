import { Image, Row, Typography } from 'antd'
import React from 'react'
import dummyprofile from '../../../assets/images/dummyProfile.jpg'

const ProfileDetails = ({ data }) => {
    return (
        <div >
            <Typography.Title level={2}>
                My Profile
            </Typography.Title>
            <Row >
                <div className='flex'>
                    <Image width={200} height={200} style={{ borderRadius: "50%", objectFit: "contain" }} src={data?.avatar || dummyprofile} />
                </div>
                <div style={{ marginLeft: '20px' }}>
                    <Typography.Title level={2}>{data?.firstName} {data?.lastName}</Typography.Title>
                    <Typography.Paragraph>Email: {data?.email}</Typography.Paragraph>
                    <Typography.Paragraph>Phone: {data?.phone}</Typography.Paragraph>
                    <Typography.Paragraph>PinCode: {data?.pinCode}</Typography.Paragraph>
                    {/* Add more details as needed */}
                </div>
            </Row>

        </div>
    )
}

export default ProfileDetails