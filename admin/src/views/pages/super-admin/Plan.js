import { Table, Button, Form, Row, Col, Popconfirm, Spin, Card, message, Input, Space, Drawer, Tag, Select, Typography, Divider, List, Avatar } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, ArrowLeftOutlined, SettingOutlined, CloseOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import servicePlane from '../../../services/subscription';
import serviceRight from '../../../services/right';
import Pagination from '../../components/Pagination';
import util from '../../../utils/util';
import { useNavigate } from 'react-router-dom';

/* eslint-disable no-unused-vars */
export default function Subscription() {

    const [ar, setAr] = useState({
        viewAccess: util.checkRightAccess('super-admin-access-list'),
        addAccess: util.checkRightAccess('super-admin-access-add'),
        editAccess: util.checkRightAccess('super-admin-access-edit'),
        deleteAccess: util.checkRightAccess('super-admin-access-delete'),
    });

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [qData, setQData] = useState({ page: 1, limit: 3 });
    const [rights, setRights] = useState([]);
    const navigate = useNavigate();

    const addNewModalRef = useRef();
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            // width: 40,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            // width: 40,
        },
        {
            title: 'MRP',
            dataIndex: 'mrp',
            // width: 40,
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            // width: 40,
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            // width: 40,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: 80,
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
            hidden: !ar.addAccess && !ar.editAccess && !ar.deleteAccess && !ar.viewAccess,
            render: (v, row) => {
                return <>
                    {
                        ar.deleteAccess
                            ? <Popconfirm
                                title="Are you sure to delete this right?"
                                onConfirm={() => { deleteData(row._id); }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="primary" size='small' danger icon={<DeleteOutlined />} />&nbsp;
                            </Popconfirm>
                            : null
                    }

                    {
                        ar.editAccess
                            ? <Button type="primary" size='small' icon={<EditOutlined />} onClick={() => { addNewModalRef.current.openForm(row) }} />
                            : null
                    }
                    {
                        !ar.editAccess && ar.viewAccess
                            ? <Button type="primary" size='small' icon={<EyeOutlined />} onClick={() => { addNewModalRef.current.openForm(row) }} />
                            : null
                    }
                </>
            }
        },
    ].filter(item => !item.hidden);

    function list() {
        if (ar.viewAccess) {
            setLoading(true);
            servicePlane.list(qData).then(res => {
                setData(res.data?.map((v) => ({ ...v, key: v._id })));
                setQData({ ...qData, limit: res.extra.limit, page: res.extra.page, total: res.extra.total });
            }).catch(err => { }).finally(() => {
                setLoading(false);
            });
        }
    }

    const deleteData = (id) => {
        servicePlane.delete(id).then(res => {
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

    useEffect(() => {
        list();
        if (ar.viewRightAccess) {
            serviceRight.list({ isAll: 1 }).then(res => { setRights(res.data || []) });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qData.page, qData.limit]);

    return (
        <>

            <Card bordered={false} size="small" title={
                <>
                    <Space>
                        <Button type="dashed" danger icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Back</Button>
                        List of Plans
                    </Space>

                </>
            }
                extra={
                    <>
                        <Row justify="end" gutter={12}>
                            <Col>
                                {
                                    selected.length && ar.deleteAccess
                                        ? <Popconfirm
                                            title="Are you sure to delete these selected images?"
                                            onConfirm={() => { deleteData(selected); }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button type="primary" danger style={{ float: 'right' }} icon={<DeleteOutlined />}>Delete Selected</Button>
                                        </Popconfirm>
                                        : null
                                }
                            </Col>
                            <Col>

                                {
                                    ar.addAccess
                                        ? <Button type="primary" icon={<PlusOutlined />} onClick={() => { addNewModalRef.current.openForm() }}>Add New</Button>
                                        : null
                                }
                            </Col>
                        </Row>
                    </>
                }>
                <Search {...{ addNewModalRef, selected, deleteData, qData, setQData, list, ar }} />
                <AddForm ref={addNewModalRef} {...{ list, rights, ar }} />
            </Card>
            <Divider />
            <Row gutter={[12, 12]}>
                {data?.map((v) => {
                    return <Col span={6}>
                        <Card bordered={true} className="app-gradient-hyp1" title={
                            <Row>
                                <Col span={6}>
                                    <Typography.Title style={{ margin: 0 }}>{v?.duration}</Typography.Title>
                                    <Typography.Title level={4} style={{ margin: 0 }}>Days</Typography.Title>
                                </Col>
                                <Col span={1}>
                                    <Divider type="vertical" style={{ height: '-webkit-fill-available' }} />
                                </Col>
                                <Col span={17}>
                                    <Typography.Title level={2} style={{ margin: 0, textAlign: 'center' }}>₹ {(v?.amount).toLocaleString('en-IN')}</Typography.Title>
                                    <Row align="center" style={{}}>
                                        <Col>
                                            <Typography.Title delete type="secondary" level={4} style={{ margin: 0, textAlign: 'center' }}>₹ {(v?.mrp).toLocaleString('en-IN')}</Typography.Title>
                                        </Col>
                                        <Col span={4}>
                                            <Typography.Title level={4} style={{ margin: 0, textAlign: 'center' }}>-</Typography.Title>
                                        </Col>
                                        {/* <Col>
                                        <Typography.Title level={4} style={{ margin: 0, textAlign: 'center' }}>₹ {(28000).toLocaleString('en-IN')}/mo</Typography.Title>
                                    </Col> */}
                                    </Row>
                                </Col>
                            </Row>
                        }
                            hoverable
                            style1={{ borderRadius: 10 }}
                            actions={[


                                ar.deleteAccess
                                    ? <Popconfirm
                                        title="Are you sure to delete this right?"
                                        onConfirm={() => { deleteData(v?._id); }}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button type="primary" size='small' danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                    : null,


                                ar.editAccess
                                    ? <Button type="primary" size='small' icon={<EditOutlined />} onClick={() => { addNewModalRef.current.openForm(v) }} />
                                    : null
                            ]}
                        >
                            <li>
                                <Typography.Title level={5} style={{ margin: 0 }}>Benefits</Typography.Title>
                                <ol>
                                    {v?.benefits?.map((v) => {
                                        return <>
                                            <li>{v}</li>
                                        </>
                                    })}


                                </ol>
                            </li>
                        </Card>
                    </Col>
                })}


                <Col span={24}>
                    <Card>
                        <Pagination {...{ qData, setQData }} />
                    </Card>
                </Col>

            </Row>
        </>
    );
};

function Search({ qData, setQData, list }) {
    return (
        <Form onSubmitCapture={list}>
            <Row gutter={12}>
                <Col span={6}>
                    <Input placeholder="Search by name" value={qData.key} onChange={e => (setQData({ ...qData, key: e.target.value }))} allowClear />
                </Col>
                <Col span={3}>
                    <Button type="primary" htmlType="submit">Search</Button>
                </Col>
            </Row>
        </Form>
    );
};

const AddForm = forwardRef((props, ref) => {
    const { list, rights, ar } = props;
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});
    const [ajxRequesting, setAjxRequesting] = useState(false);


    const handleChange = (value) => {
        if (ar.addAccess || ar.editAccess) {
            setData({ ...data, ...value });
        }
    }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(
                dt
                    ? { rightCodes: [], ...dt }
                    : { rightCodes: [] }
            );
        }
    }));

    const save = () => {
        setAjxRequesting(true);
        servicePlane.save(data).then((res) => {
            message.success(res.message);
            setOpen(false);
            list();
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

    return (
        <>
            <Drawer
                title={data._id ? "Edit Plan" : "Create a New Plan"}
                width={1000}
                onClose={() => { setOpen(false) }}
                open={open}
                bodyStyle={{
                    paddingBottom: 80,
                }}
                extra={
                    <Space>
                        <Button onClick={() => { setOpen(false) }}>Cancel</Button>
                        <Button onClick={save} type="primary" disabled={ajxRequesting}>Save</Button>
                    </Space>
                }
                destroyOnClose
            >
                <Spin spinning={ajxRequesting}>
                    <Form layout="vertical" onSubmitCapture={save}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <Form.Item label="Name" required>
                                    <Input placeholder="Name" value={data.name || ''} onChange={e => { handleChange({ name: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Amount" required>
                                    <Input placeholder="Amount" value={data.amount || ''} onChange={e => { handleChange({ amount: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Mrp" required>
                                    <Input placeholder="Mrp" value={data.mrp || ''} onChange={e => { handleChange({ mrp: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Discount" required>
                                    <Input placeholder="Discount" value={data.discount || ''} onChange={e => { handleChange({ discount: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Duration" required>
                                    <Input suffix="Days" placeholder="Duration" value={data.duration || ''} onChange={e => { handleChange({ duration: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Number Of Uses" required>
                                    <Input placeholder="Number Of Uses" value={data.numberOfUses || ''} onChange={e => { handleChange({ numberOfUses: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Status" required>
                                    <Select placeholder="Status" value={data.status} onChange={e => { handleChange({ status: e }) }} >
                                        <Select.Option value={true}>Active</Select.Option>
                                        <Select.Option value={false}>Inactive</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Delete Status" required>
                                    <Select placeholder="Delete Status" value={data.isDeleted} onChange={e => { handleChange({ isDeleted: e }) }} >
                                        <Select.Option value={true}>Active</Select.Option>
                                        <Select.Option value={false}>Inactive</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Benefits">
                                    {
                                        data?.benefits?.length > 0 ?
                                            <Col span={24}>
                                                <Variant {...{ variantDetails: data?.benefits, parentKay: 'benefits', handleChange }} />
                                            </Col>
                                            :
                                            <Col span={24}>
                                                <Input placeholder="Benefits" onChange={(e) => { handleChange({ benefits: [e.target.value] }, `benefits.${0}`) }} />
                                            </Col>
                                    }
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Drawer>
        </>
    );
});

function Variant({ variantDetails: data, parentKay, handleChange }) {
    return (
        <>
            <Table
                {...{
                    bordered: true,
                    size: 'small',
                    showHeader: true,
                    footer: null,
                    tableLayout: undefined,
                }}
                pagination={{ position: ['none'] }}
                columns={
                    [
                        {
                            // width: 300,
                            render: (v, row, i) => {
                                return <>

                                    <Input placeholder="Benefits" value={v} onChange={(e) => { data[i] = (e.target.value); handleChange([...data,], `${parentKay}.${i}`) }} />

                                </>
                            }
                        },
                        {
                            width: 100,
                            render: (v, row, i) => {
                                return <Row gutter={[12, 12]}>
                                    {
                                        i !== 0
                                            ? <Col span={12}><Button icon={<CloseOutlined />} shape="circle" type="dashed" className="mx-2" danger onClick={() => { data.splice(i, 1); handleChange([...data], parentKay); }} /></Col>
                                            : null
                                    }
                                    {
                                        i + 1 === data?.length
                                            ? <Col span={12}><Button icon={<PlusOutlined />} shape="circle" type="dashed" onClick={() => { data.push(""); handleChange([...data], parentKay); }} /></Col>
                                            : null
                                    }
                                </Row>
                            }
                        }
                    ]
                }

                dataSource={data?.length ? data?.map((v, i) => (v)) : []}
            />
        </>
    );
}