/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, Form, Row, Col, Popconfirm, Modal, Spin, Typography, Select, Input, Tag, DatePicker, message } from 'antd';
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';

import service from '../../services/coupon';
import UserService from '../../services/userlist';
import Pagination from '../components/Pagination';
import dayjs from 'dayjs';
import moment from 'moment';
import util from '../../utils/util';

export default function Coupon() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [qData, setQData] = useState({ page: 1, limit: 20, });
    const [user, setUser] = useState([]);
    const addNewModalRef = useRef();
    const columns = [
        {
            title: '#',
            width: 30,
            render: (v, row, i) => <b>{i + 1}</b>
        },
        {
            title: 'Title',
            dataIndex: 'title',
            width: 150,

        },
        {
            title: "User",
            dataIndex: "userDetails",
            width: 250,
            render: v => v.map(vv => <Tag key={vv._id}>{vv.name || "UNKNOWN"}</Tag>)
        },
        {
            title: 'Code',
            width: 100,
            dataIndex: 'code',
        },
        {
            title: 'EndDate',
            width: 100,
            dataIndex: 'expiryDate',
            render: (v, row) => <span>{moment(v).format('DD MMM YYYY')}</span>
        },
        {
            title: "Discount Value",
            dataIndex: "discountValue",
            width: 120,
            render: (v, row) => row.discountType === 'flat' ? <b>₹ {v}</b> : <b>{v} %</b>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: 60,
            render: isActive => {
                if (isActive) {
                    return <Tag color='green'>Active</Tag>
                } else {
                    return <Tag color='red'>Inactive</Tag>
                }
            },
        },
        {
            title: 'Action',
            dataIndex: '_id',
            width: 70,
            render: (v, row) => {
                return <>
                    <Popconfirm
                        title="Are you sure to delete this coupon?"
                        onConfirm={() => { deleteData(row._id); }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" size='small' danger icon={<DeleteOutlined />} />&nbsp;
                    </Popconfirm>
                    <Button type="primary" size='small' icon={<EditOutlined />} onClick={() => { addNewModalRef.current.openForm(row) }} />
                </>
            }
        },
    ].filter(item => !item.hidden);

    function list() {
        setLoading(true);
        service.list(qData).then(res => {
            setData(res.data?.map((v) => ({ key: v._id, ...v })).reverse());
            setQData({ ...qData, limit: res.extra.limit, page: res.extra.page, total: res.extra.total });
        }).catch(err => { }).finally(() => {
            setLoading(false);
        });
    }

    function listUser() {
        UserService.list({ isAll: 1 })
            .then(res => { setUser(res.data || []); }).catch(err => { message.error('User data not loaded', 'error'); });
    }

    const deleteData = (id) => {
        service.delete(id).then(res => {
            message.error(res.message);
            list();
            setSelected([]);
        }).catch(err => {
            message.error(err.message, 'error');
        })
    }

    const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));
    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';

    const tableProps = {
        bordered: true,
        loading,
        size: 'small',
        title: () => <Search {...{ addNewModalRef, selected, deleteData, qData, setQData, list, user }} />,
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
        listUser()
    }, [qData.page, qData.limit]);

    return (
        <>
            <Typography.Title level={5} style={{ marginTop: 0 }}>List of Coupon</Typography.Title>
            <Table
                {...tableProps}
                pagination={{ position: ['none'], pageSize: qData.limit }}
                columns={tableColumns}
                dataSource={data.length ? data : []}
                scroll={{ y: 'calc(100vh - 340px)', x: 'calc(100vw - 387px)' }}
            />
            <AddForm ref={addNewModalRef} {...{ list, user }} />
        </>
    );
};

function Search({ addNewModalRef, selected, deleteData, qData, setQData, list, user }) {
    const [userNames, setUserNames] = useState([]);

    const onChange = (v, key) => {
        qData[key] = v;
        if (v === undefined) {
            qData[key] = "";
            list()
        }
    }
    useEffect(() => {
        const Names = user?.map((item) => (
            {
                label: item.name ? <><p style={{ padding: "0px", margin: "0px" }}>{item.name}</p><p style={{ fontSize: "12px", margin: "0px" }}><Typography.Text type="danger">@{item.phone}</Typography.Text></p></> : item.phone,
                value: item._id,
                searchKey: item.name + item.phone
            }
        ))
        setUserNames(Names)
    }, [user])
    return (
        <Form onSubmitCapture={list} className="search-form">
            <Row gutter={[12, 2]}>
                <Col xs={24} xl={4}>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Select
                            showSearch
                            allowClear
                            placeholder="Select by username / phone"
                            optionFilterProp="children"
                            onChange={(e) => onChange(e, "userId")}
                            filterOption={(input, option) =>
                                (option?.searchKey ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={userNames}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} xl={4}>
                    <Form.Item>
                        <Select value={qData.status} allowClear placeholder="Search By Date" onChange={e => onChange(e, "expiryDate")} >
                            <Select.Option value="expired">Expired</Select.Option>
                            <Select.Option value="active">Active</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={11}>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit">Search</Button>
                    </Form.Item>
                </Col>
                <Col span={5}>
                    <Form.Item style={{ marginBottom: 0, float: 'right' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => { addNewModalRef.current.openForm() }}>Add New</Button>
                    </Form.Item>
                    {
                        selected.length
                            ? <Popconfirm
                                title="Are you sure to delete these selected images?. Be sure to delete the image from server."
                                onConfirm={() => { deleteData(selected); }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" danger style={{ float: 'right' }} icon={<DeleteOutlined />}>Delete Selected</Button>
                            </Popconfirm>
                            : null
                    }
                </Col>
            </Row>
        </Form>
    );
};

const AddForm = forwardRef((props, ref) => {
    const { list, user } = props;
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({ aspect: 1 });
    const [ajxRequesting, setAjxRequesting] = useState(false);

    const handleChange = (value) => {

        Object.entries(value).forEach(ent => {
            let varDt = data;
            const k = ent[0];
            const v = ent[1];
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
        });
        setData({ ...data });
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(
                dt
                    ? { ...dt }
                    : { discountType: 'percent', userIds: [], isTypeOnly: false, status: true }
            );
        }
    }));

    const save = () => {
        setAjxRequesting(true);
        service.save(data).then((res) => {
            message.error(res.message);
            handleChange({ ...res.data });
            list();
            setOpen(false);
        }).catch(err => {
            if (typeof err.message === 'object') {
                let dt = err.message[Object.keys(err.message)[0]];
                message.error(dt, 'error');
            } else {
                message.error(err.message, 'error');
            }
        }).finally(() => {
            setAjxRequesting(false);
        });
    }

    useEffect(() => {
        if (!data._id) {
            handleChange({ code: util.removeSpecialChars(data.title)?.toUpperCase() });
        }
    }, [data.title]);

    return (
        <>
            <Modal
                title={(!data._id ? 'Add' : 'Edit') + ' Coupon'}
                style={{ top: 20 }}
                open={open}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting }}
                onCancel={() => { setOpen(false); }}
                destroyOnClose
                maskClosable={false}
                width={800}
                className="app-modal-body"
                footer={[
                    <Button key="cancel" onClick={() => { setOpen(false); }}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={save}>Save</Button>,
                ]}
            >
                <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <Form layout="vertical">
                        <Row gutter={[12, 2]}>

                            <Col span={12}>
                                <Form.Item label="Title" required>
                                    <Input placeholder="Title" value={data.title} onChange={e => { handleChange({ title: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Code" required>
                                    <Input placeholder="Code" value={data.code} onChange={e => { handleChange({ code: util.removeSpecialChars(e.target.value)?.toUpperCase() }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Discount Type" required>
                                    <Select value={data.discountType} onChange={e => { handleChange({ discountType: e }) }} >
                                        <Select.Option value={'Percent'}>Percent</Select.Option>
                                        <Select.Option value={'Flat'}>Flat</Select.Option>
                                        <Select.Option value={'Holiday-and-seasonal-sale'}>Holiday and seasonal sale</Select.Option>
                                        <Select.Option value={'Free-shipping'}>Holiday and seasonal sale</Select.Option>
                                        <Select.Option value={'First-time-purchase'}>First Time Purchase</Select.Option>
                                        <Select.Option value={'Newsletter-subscribe'}>Newsletter subscribe</Select.Option>
                                        <Select.Option value={'Abandoned-cart'}>Abandoned cart</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Discount Value" required>
                                    <Input type='number' placeholder="discountValue" addonBefore={data.discountType === 'percent' ? '%' : '₹'} value={data.discountValue}
                                        onChange={e => {
                                            if (data.discountType === 'flat') {
                                                handleChange({ discountValue: e.target.value, maxDiscountValue: e.target.value })
                                            } else {

                                                handleChange({ discountValue: e.target.value })
                                            }
                                        }} />
                                </Form.Item>
                            </Col>
                            {(data.discountType === "flat") ?
                                <Col span={6}>
                                    <Form.Item label="Max Discount Value" >
                                        <Input type='number' placeholder="Max Discount Price" addonBefore="₹" value={data.maxDiscountValue} onChange={e => { handleChange({ maxDiscountValue: e.target.value }) }} disabled />
                                    </Form.Item>
                                </Col>
                                :
                                <Col span={6}>
                                    <Form.Item label="Max Discount Value" >
                                        <Input type='number' placeholder="Max Discount Price" addonBefore="₹" value={data.maxDiscountValue} onChange={e => { handleChange({ maxDiscountValue: e.target.value }) }} />
                                    </Form.Item>
                                </Col>
                            }
                            <Col span={6}>
                                <Form.Item label="Minimun Order Value">
                                    <Input type='number' placeholder="Minimun Order Price" addonBefore="₹" value={data.minimunOrderPrice} onChange={e => { handleChange({ minimunOrderPrice: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={18}>
                                <Form.Item label="Choose Users (Don't choose any user if coupon is applicable to all users)" >
                                    <Select mode='multiple' value={data.userIds} onChange={v => { handleChange({ userIds: v }) }}
                                        options={
                                            user.map(v => (
                                                {
                                                    value: v._id,
                                                    label: <>
                                                        <p style={{ padding: "0px", margin: "0px" }}>{v?.name}</p><p style={{ fontSize: "12px", margin: "0px" }}><Typography.Text type="danger">@{v?.phone}</Typography.Text></p>
                                                    </>,
                                                }
                                            ))
                                        } >
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Expiry Date" required>
                                    <DatePicker value={data.expiryDate && dayjs(moment(data.expiryDate).format("YYYY-MM-DD"))}
                                        format='DD MMM YYYY'
                                        disabledDate={(current) => current.isBefore(moment(new Date()).subtract(1, "day"))}
                                        onChange={(e) => { handleChange({ expiryDate: new Date(e) }) }} style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Status" required>
                                    <Select value={data.status} onChange={e => { handleChange({ status: e }) }} >
                                        <Select.Option value={true}>Active</Select.Option>
                                        <Select.Option value={false}>Inactive</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Description" required>
                                    <Input.TextArea
                                        rows={1}
                                        placeholder="Coupon Description"
                                        value={data.description}
                                        onChange={(e) => {
                                            handleChange({ description: e.target.value });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
});