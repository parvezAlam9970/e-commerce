/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, Form, Row, Col, Popconfirm, Modal, Spin, Typography, Select, Input, DatePicker, Tag, message, InputNumber } from 'antd';
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import service from '../../services/deliveryArea';
import ProductService from '../../services/product';
import Pagination from '../components/Pagination';
import dayjs from 'dayjs';
import moment from 'moment';
import util from '../../utils/util';


export default function DeliveryArea() {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [qData, setQData] = useState({ page: 1, limit: 20, });
    const [product, setProduct] = useState([]);
    const addNewModalRef = useRef();

    const columns = [
        {
            title: '#',
            width: 30,
            render: (v, row, i) => <b>{i + 1}</b>
        },
        {
            title: 'Pincode',
            dataIndex: 'code',
            width: 200
        },
        {
            title: 'Days to Deliver',
            dataIndex: 'daysToDeliver',
            width: 220,
            // render: (v, row) => <span>{moment(v).format('DD MMM YYYY')} To {moment(row.endDate).format('DD MMM YYYY')} </span>
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
            <Typography.Title level={5} style={{ marginTop: 0 }}>List of Offer</Typography.Title>
            <Table
                {...tableProps}
                pagination={{ position: ['none'], pageSize: qData.limit }}
                columns={tableColumns}
                dataSource={data.length ? data : []}
                scroll={{ y: 'calc(100vh - 340px)', x: 'calc(100vw - 387px)' }}
            />
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
                <Col span={5}>
                    <Form.Item style={{ marginBottom: 0, float: 'right' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => { addNewModalRef.current.openForm() }}>Add New</Button>
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
                                <Form.Item label="Area Pincode" required>
                                    <Input placeholder="Ex:- 110084" value={data.code} onChange={e => { handleChange({ code: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Total Days to Deliver" required>
                                    <InputNumber placeholder="Ex:- 5" value={data.daysToDeliver} onChange={e => { handleChange({ daysToDeliver: e }) }} addonAfter={"days"}/>
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

                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
});