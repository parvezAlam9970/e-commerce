import { Button, Card, Col, Input, Row, Spin, message } from "antd";
import React, { useEffect, useState } from "react";
import service from "../../../services/setting"
import { LoadingOutlined } from '@ant-design/icons';
const initDataMap = [
    {
        type: 'phone',
        title: 'Phone Number (Support)',
        dataInput: 'input',
        default: 'XXXXXXXXXX',
        iseditable: false
    },
    {
        type: 'email',
        title: 'Email (Support)',
        dataInput: 'input',
        default: 'xxx....@test.com',
        iseditable: false
    },
    {
        type: 'whatsapp',
        title: 'Whatsapp (Support)',
        dataInput: 'input',
        default: 'XXXXXXXXXX',
        iseditable: false
    }
];
const ContactUs = () => {
    const [data, setData] = useState(initDataMap.map(v => ({ type: v.type })));
    const [dataMap, setDataMap] = useState(initDataMap);
    const [ajxRequesting, setAjxRequesting] = useState(false);

    const list = () => {
        setAjxRequesting(true);
        service.listContactus().then((res) => {
            setData(
                initDataMap?.map(v =>
                    res?.data?.find(vv => vv.type === v.type) || { type: v.type, value: v.default }
                )
            )
        }).catch(err => { }).finally(() => {
            setAjxRequesting(false);
        });
    }
    useEffect(() => {
        list();
    }, [])

    const handleSave = (data) => {
        setAjxRequesting(true);
        service.saveContactus(data).then((res) => {
            message.success(res.message);
            setDataMap(dataMap.map((vv, ii) => (data.type !== vv.type ? { ...vv } : { ...vv, iseditable: false })))
            list();
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

    return (
        <>
            <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                <Row gutter={[12, 12]}>
                    {
                        dataMap?.map((val, i) => (
                            <Col span={6} key={i}>
                                <Card
                                    title={val.title}
                                    size="small"
                                    extra={
                                        !val.iseditable ?
                                            <Button type="primary" size="small" onClick={() => setDataMap(dataMap.map((vv, ii) => (i !== ii ? { ...vv } : { ...vv, iseditable: true })))} > Edit </Button> :
                                            <Row gutter={6}>
                                                <Col>
                                                    <Button type="primary" size="small" danger
                                                        onClick={() => {
                                                            setDataMap(dataMap.map((vv, ii) => (i !== ii ? { ...vv } : { ...vv, iseditable: false })));
                                                            list();
                                                        }}
                                                    > Cancel </Button>
                                                </Col>
                                                <Col>
                                                    <Button type="primary" size="small" onClick={() => {
                                                        handleSave(data?.find((vv, ii) => vv.type === val.type))
                                                    }} > Save </Button>
                                                </Col>
                                            </Row>
                                    }
                                >
                                    {
                                        val.dataInput === 'input'
                                            ? <Input value={(data?.find((vv, ii) => vv.type === val.type))?.value} onChange={e => {
                                                setData(data.map((vv, ii) => (vv.type === val.type ? { ...vv, value: e.target.value } : { ...vv })))
                                            }} disabled={!val.iseditable} />
                                            : null
                                    }
                                </Card>
                            </Col>
                        ))
                    }
                </Row>
            </Spin>
        </>
    );
};
export default ContactUs;