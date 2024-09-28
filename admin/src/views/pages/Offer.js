/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, Form, Row, Col, Popconfirm, Modal, Spin, Typography, Select, Input, DatePicker, Tag, message, Card } from 'antd';
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import service from '../../services/offer';
import ProductService from '../../services/product';
import Pagination from '../components/Pagination';
import dayjs from 'dayjs';
import moment from 'moment';
import util from '../../utils/util';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



export default function Offer() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [qData, setQData] = useState({ page: 1, limit: 20, });
    const [product, setProduct] = useState([]);
    const addNewModalRef = useRef();
    const navigate = useNavigate();


    const columns = [
        {
            title: '#',
            width: 30,
            render: (v, row, i) => <b>{i + 1}</b>
        },
        {
            title: 'Title',
            dataIndex: 'title',
            width: 200
        },
        {
            title: 'Products',
            dataIndex: 'productDetails',
            render: v => v.map(vv => <Tag className="custom-tag" style={{ margin: "2px 0px" }} color="#108ee9" key={vv._id}>{vv.name}</Tag>)
        },
        {
            title: 'Discount Percent',
            dataIndex: 'discountPercent',
            width: 150,
            render: v => v + " %"
        },
        {
            title: 'Duration',
            dataIndex: 'startDate',
            width: 250,
            render: (v, row) => <span className='flex'>
                <Tag className="custom-tag" color="#87d068" >{moment(v).format('DD MMM YYYY')}</Tag> To

                <Tag className="custom-tag" color="#f50" >{moment(row.endDate).format('DD MMM YYYY')}</Tag>

            </span>
        },
        {
            title: 'Action',
            dataIndex: '_id',
            width: 70,
            render: (v, row) => {
                return <>
                    <Popconfirm
                        title="Are you sure to delete this offer?"
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

    function listProduct() {
        ProductService.list({ isAll: 1 }).then(res => {
            setProduct(res.data || []);
        }).catch(err => {
            message.error('Product data not loaded');
        });
    }

    const deleteData = (id) => {
        service.delete(id).then(res => {
            message.success(res.message);
            list();
        }).catch(err => {
            message.error(err.message);
        })
    }

    const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';

    const tableProps = {
        bordered: true,
        loading,
        size: 'small',
        title: () => <Search {...{ addNewModalRef, qData, setQData, list, }} />,
        showHeader: true,
        footer: () => <Pagination {...{ qData, setQData }} />,
        tableLayout: undefined,
    };

    useEffect(() => {
        list();
    }, [qData.page, qData.limit,]);

    useEffect(() => {
        listProduct();
    }, []);

    return (
        <>
            <Row align="middle" gutter={[16, 0]} className="mb10 flex j-center a-center">
                <Col flex="auto">
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span
                            className="back_arrow c-pointer"
                            onClick={() => navigate(-1)}
                        >
                            <FaLongArrowAltLeft size={20} style={{ color: "white" }} />
                        </span>
                        <Typography.Title className="m-0" style={{ fontWeight: 700 }} level={4}>List Of Offers</Typography.Title>
                    </div>

                </Col>
                <Col>
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => { addNewModalRef.current.openForm(); }}>Add New</Button>
                </Col>
            </Row>
            <Card
                style={{ marginTop: '15px' }}
                size="small"
                bordered={false}
                className="shadow_1 br-10"
            >

                <Table
                    {...tableProps}
                    pagination={{ position: ['none'], pageSize: qData.limit }}
                    columns={tableColumns}
                    style={{ fontWeight: 600 }}
                    dataSource={data.length ? data : []}
                    scroll={{ y: 'calc(100vh - 340px)', x: 'calc(100vw - 387px)' }}
                />
            </Card>

            <AddForm ref={addNewModalRef} {...{ list, product }} />
        </>
    );
};

function Search({ addNewModalRef, qData, list }) {
    const onChange = (v, key) => {
        qData[key] = v;
        if (v === undefined || v === "") {
            delete qData[key];
            list();
        }
    };
    return (
        <Form onSubmitCapture={list} className="search-form">
            <Row gutter={[12, 2]}>
                <Col xs={24} xl={4}>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Input placeholder="Search by title" defaultValue={qData.key} onChange={e => onChange(e.target.value, "key")} allowClear />
                    </Form.Item>
                </Col>
                <Col span={15}>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit">Search</Button>
                    </Form.Item>
                </Col>

            </Row>
        </Form>
    );
};

const AddForm = forwardRef((props, ref) => {
    const { list, product, } = props;
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({ aspect: 1 });
    const [ajxRequesting, setAjxRequesting] = useState(false);

    const handleChange = (value) => {
        setData({ ...data, ...value });
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(dt ? { ...dt } : { status: true });
        }
    }));

    const save = () => {
        setAjxRequesting(true);
        service.save(data).then((res) => {
            message.success(res.message);
            handleChange({ ...res.data });
            list();
            setOpen(false);
        }).catch(err => {
            message.error(err.message);
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
                title={(!data._id ? 'Add' : 'Edit') + ' Offer'}
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
                                    <Input placeholder="Ex:- Holi Offer 20 % Off" value={data.title} onChange={e => { handleChange({ title: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Code" required>
                                    <Input placeholder="Ex:- HOLI-OFFER-20-OFF" value={data.code} onChange={e => { handleChange({ code: util.removeSpecialChars(e.target.value)?.toUpperCase() }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Discount Percentage" required>
                                    <Input placeholder="Ex:- 40%" value={data.discountPercent} onChange={e => { handleChange({ discountPercent: util.handleFloat(e.target.value) }) }} addonAfter="%" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Duration" required>
                                    <DatePicker.RangePicker
                                        format='DD MMM YYYY'
                                        value={data.startDate && data.endDate && [dayjs(data.startDate), dayjs(data.endDate)]}
                                        onChange={(e) => { handleChange({ startDate: e?.[0] ? new Date(e?.[0]) : null, endDate: e?.[1] ? new Date(e?.[1]) : null }) }}
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Status" required>
                                    <Select defaultValue={true} value={data.status} onChange={e => { handleChange({ status: e }) }} >
                                        <Select.Option value={true}>Active</Select.Option>
                                        <Select.Option value={false}>Inactive</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Product" required>
                                    <Select mode="multiple" value={data.productIds} onChange={v => { handleChange({ productIds: v }) }}
                                        filterOption={(input, option) => {
                                            return (
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            );
                                        }}
                                        options={
                                            product.map(v => (
                                                {
                                                    value: v._id,
                                                    label: v.name,
                                                }
                                            ))
                                        } >
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
});