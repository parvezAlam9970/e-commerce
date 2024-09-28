/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, Form, Row, Col, Popconfirm, Modal, Spin, Typography, Input, message, Select, TreeSelect, Image } from 'antd';
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import Pagination from '../../components/Pagination';
// import { Antd } from '../../../utils/Antd';
import util from '../../../utils/util';
import service from '../../../services/cart';
import ProductService from '../../../services/product'


export default function Cart({ userId, }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState([])
    const [selected, setSelected] = useState([]);
    const [qData, setQData] = useState({ page: 1, limit: 20, userId, });
    const [varient, setVarient] = useState()
    const addNewModalRef = useRef();
    const addNewLabelRef = useRef();

    const columns = [
        {
            title: '#',
            width: 40,
            render: (v, row, i) => <b>{i + 1}</b>
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'Image',
            dataIndex: 'photoURL',
            width: 300,
            render: (v) => {
                return v?.url ? <Image src={v?.url} height={80} /> : <span>No Image</span>
            }
        },
        {
            title: 'Action',
            dataIndex: '_id',
            width: 70,
            render: (v, row) => {
                return <>
                    <Popconfirm
                        title="Are you sure to delete this data?"
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

    console.log(data)
    function list() {
        setLoading(true);
        service.list(qData).then(res => {
            setVarient(res?.data?.productVariantId)
            setData(res.data?.map((v) => ({ ...v, key: v._id })));
            setQData({ ...qData, limit: res.extra.limit, page: res.extra.page, total: res.extra.total });
        }).catch(err => { }).finally(() => {
            setLoading(false);
        });
    }
    useEffect(() => {
        ProductService.list({ isAll: 1 }).then(res => {
            setProduct(res.data || []);
        }).catch(err => {
            message.error('Category data not loaded');
        });
    }, []);

    const deleteData = (id) => {
        service.delete(id).then(res => {
            message.success(res.message);
            list();
            setSelected([]);
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
        title: () => <Search {...{ addNewModalRef, selected, deleteData, qData, setQData, list, }} />,
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
    }, [qData.page, qData.limit]);

    return (
        <>
            {
                !userId
                    ? <Typography.Title level={5} style={{ marginTop: 0 }}>List of Users</Typography.Title>
                    : null
            }

            <Table
                {...tableProps}
                pagination={{ position: ['none'], pageSize: qData.limit }}
                columns={tableColumns}
                dataSource={data.length ? data : []}
                scroll={{ y: 'calc(100vh - 340px)', x: 'calc(100vw - 387px)' }}
            />
            <AddForm ref={addNewModalRef} {...{ list, userId, varient, product }} />
            <AddLabel ref={addNewLabelRef} {...{ list }} />
        </>
    );
}

function Search({ addNewModalRef, selected, deleteData, qData, setQData, list, }) {

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
                <Col span={4}>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Input placeholder="Search by name or code" defaultValue={qData.key} onChange={e => onChange(e.target.value, "key")} allowClear />
                    </Form.Item>
                </Col>
                <Col xs={24} xl={4}>
                    <Form.Item>
                        <Select value={qData.type} allowClear placeholder="Search By Type" onChange={e => onChange(e, "type")} >
                            <Select.Option value="true">AddOn</Select.Option>
                            <Select.Option value="false">Normal</Select.Option>
                            {/* <Select.Option value="blocked">Blocked</Select.Option> */}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={3}>
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
                                title="Are you sure to delete these selected datas?"
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
    const { list, userId, varient, product } = props;
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});
    const [ajxRequesting, setAjxRequesting] = useState(false);


    const handleChange = (value) => {
        setData({ ...data, ...value });
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(
                dt
                    ? { ...dt }
                    : { userId, varient }
            );
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
            if (typeof err.message === 'object') {
                let dt = err.message[Object.keys(err.message)[0]];
                message.error(dt, 'error');
            } else {
                message.error(err.message);
            }
        }).finally(() => {
            setAjxRequesting(false);
        });
    }

    useEffect(() => {
        if (!open) {
            setData({ _id: null });
        }
    }, [open]);

    useEffect(() => {
        if (!data._id) {
            handleChange({ slug: util.removeSpecialChars(data.name || '') });
        }
    }, [data.name]);

    return (
        <>

            <Modal
                title={(!data._id ? 'Add' : 'Edit') + ' Cart'}
                style={{ top: 20 }}
                open={open}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting }}
                onCancel={() => { setOpen(false); }}
                destroyOnClose
                maskClosable={false}
                width={500}
                className="app-modal-body"
                footer={[
                    <Button key="cancel" onClick={() => { setOpen(false); }}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={save}>save</Button>,
                ]}
            >
                <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <Form layout="vertical">
                        <Row gutter={[12, 2]}>
                            {!data._id ?
                                <Col span={24}>
                                    <Form.Item label="Product Name" required>
                                        {/* <Input placeholder="Product Name" value={data.productName} onChange={e => { handleChange({ productName: e.target.value }) }} /> */}
                                        <TreeSelect mode="multiple" value={data.productVariantId} onChange={v => { handleChange(v, "productVariantId") }} //treeData={product}
                                            treeData={product.map(v => ({
                                                value: v._id,
                                                label: v.name,
                                                children: v?.variants?.map(vv => ({
                                                    value: vv._id,
                                                    label: vv.weight + " @₹" + vv.price,
                                                }))
                                            }))}
                                        >
                                        </TreeSelect>
                                    </Form.Item>
                                </Col>
                                :
                                <Col span={24}>
                                    <Form.Item label="Product Name" required>
                                        <Input placeholder="Product Name" value={data.productName} onChange={e => { handleChange({ productName: e.target.value }) }} disabled />
                                    </Form.Item>
                                </Col>}
                            <Col span={24}>
                                <Form.Item label="Quantity" required>
                                    <Input placeholder="Quantity" value={data.quantity} onChange={e => { handleChange({ quantity: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            {/* {!data._id ?
                                <Col span={24}>
                                    <Form.Item label="Weight" required>
                                        <Input placeholder="Weight" value={data.weight} onChange={e => { handleChange({ weight: e.target.value }) }} />
                                    </Form.Item>
                                </Col>
                                :
                                <Col span={24}>
                                    <Form.Item label="Weight" required>
                                        <Input placeholder="Weight" value={data.weight} onChange={e => { handleChange({ weight: e.target.value }) }} disabled />
                                    </Form.Item>
                                </Col>}
                            {!data._id ?
                                <Col span={24}>
                                    <Form.Item label="Price" required>
                                        <Input placeholder="Price" value={data.price} onChange={e => { handleChange({ price: e.target.value }) }} />
                                    </Form.Item>
                                </Col>
                                :
                                <Col span={24}>
                                    <Form.Item label="Price" required>
                                        <Input placeholder="Price" value={data.price} onChange={e => { handleChange({ price: e.target.value }) }} disabled />
                                    </Form.Item>
                                </Col>} */}
                            {/* <Col span={24}>
                                <Form.Item label="State" required>
                                    <Input placeholder="State" value={data.state} onChange={e => { handleChange({ state: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Street 1" required>
                                    <Input placeholder="Street 1" value={data.street1} onChange={e => { handleChange({ street1: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Street 2" required>
                                    <Input placeholder="Street 2" value={data.street2} onChange={e => { handleChange({ street2: e.target.value }) }} />
                                </Form.Item>
                            </Col> */}
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
});

const AddLabel = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({ aspect: 1 });

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData({ ...dt });
        }
    }));

    return (
        <>
            <Modal
                title={(!data._id ? 'Add User' : 'List of Varient')}
                style={{ top: 20 }}
                open={open}
                okText="Save"
                onCancel={() => { setOpen(false); }}
                destroyOnClose
                maskClosable={false}
                width={1200}
                className="app-modal-body"
            >
                <Cart productId={data._id} />
            </Modal>
        </>
    );
});