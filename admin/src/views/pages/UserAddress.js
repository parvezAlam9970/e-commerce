/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, Form, Row, Col, Popconfirm, Modal, Spin, message, Input, Card, Space, Select } from 'antd';
import { DeleteOutlined, EditOutlined, LoadingOutlined, EyeOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import serviceRight from '../../services/userAddress';
import Pagination from '../components/Pagination';
import util from '../../utils/util';
import { useNavigate } from 'react-router-dom';
import serviceUser from '../../services/user';

export default function UserAddress() {
    const [ar, setAr] = useState({
        viewAccess: util.checkRightAccess('super-admin-access-list'),
        addAccess: util.checkRightAccess('super-admin-access-add'),
        editAccess: util.checkRightAccess('super-admin-access-edit'),
        deleteAccess: util.checkRightAccess('super-admin-access-delete'),
    });

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [qData, setQData] = useState({ page: 1, limit: 20 });
    const navigate = useNavigate();
    const addNewModalRef = useRef();
    const [rightGrps, setRightGrps] = useState([])
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            // width: 300,
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },
        {
            title: 'Pincode',
            dataIndex: 'pinCode',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },
        {
            title: 'Type',
            dataIndex: 'type',
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
            serviceRight.list(qData).then(res => {
                setData(res.data?.map((v) => ({ ...v, key: v._id })));
                setQData({ ...qData, limit: res.extra.limit, page: res.extra.page, total: res.extra.total });
            }).catch(err => { }).finally(() => {
                setLoading(false);
            });
        }
    }

    const deleteData = (id) => {
        serviceRight.delete(id).then(res => {
            message.success(res.message);
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
        title: () => <Search {...{ addNewModalRef, selected, deleteData, qData, setQData, list, ar }} />,
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
        if (ar.viewAccess) {
            serviceUser.listUser({ isAll: 1 }).then(res => { setRightGrps(res.data || []) }).catch(err => { message.error('User Data Not Loaded') });
        }

    }, [qData.page, qData.limit]);

    return (
        <>
            <Card bordered={false} size="small" title={
                <>
                    <Space>
                        <Button type="dashed" danger icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Back</Button>
                        List of Rights
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
                <Table
                    {...tableProps}
                    pagination={{ position: ['none'], pageSize: qData.limit }}
                    columns={tableColumns}
                    dataSource={data.length ? data : []}
                    scroll={{ y: 'calc(100vh - 340px)', x: 'calc(100vw - 387px)' }}
                />
                <AddForm ref={addNewModalRef} {...{ list, ar, rightGrps }} />
            </Card>
        </>
    );
};

function Search({ qData, setQData, list }) {

    return (
        <Form onSubmitCapture={list}>
            <Row gutter={12}>
                <Col span={6}>
                    <Input placeholder="Search by name or code" value={qData.key} onChange={e => (setQData({ ...qData, key: e.target.value }))} allowClear />
                </Col>
                <Col span={3}>
                    <Button type="primary" htmlType="submit">Search</Button>
                </Col>
            </Row>
        </Form>
    );
};

const AddForm = forwardRef((props, ref) => {
    const { list, ar, rightGrps } = props;
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
                    ? { ...dt }
                    : {}
            );
        }
    }));

    const save = () => {
        setAjxRequesting(true);
        serviceRight.save(data).then((res) => {
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

    useEffect(() => {
        handleChange({ code: util.removeSpecialChars(data.name || '') });
    }, [data.name]);

    return (
        <>
            <Modal
                title={(!data._id ? 'Add' : 'Edit') + ' Address'}
                style={{ top: 20 }}
                open={open}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting }}
                onCancel={() => { setOpen(false); }}
                destroyOnClose
                maskClosable={false}
                width={500}
                //  className="app-modal-body-overflow"
                footer={[
                    <Button key="cancel" onClick={() => { setOpen(false); }}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={save}>Save</Button>
                ]}
            >
                <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <Form layout="vertical">
                        <Row gutter={[12, 0]}>
                            <Col span={24}>
                                <Form.Item label='Choose User'>
                                    <Select placeholder="Choose User" value={data?.userId} onChange={e => { handleChange({ userId: e }); }}
                                        options={
                                            rightGrps?.map(v => (
                                                {
                                                    value: v?._id,
                                                    label: v?.name,
                                                }
                                            ))
                                        }
                                    />

                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Address" required>
                                    <Input placeholder="Wite Your Address" value={data.address} onChange={e => { handleChange({ address: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Pincode" required>
                                    <Input placeholder="Write to City Pincode" value={data.pinCode} onChange={e => { handleChange({ pinCode: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Phone No." required>
                                    <Input placeholder="Write Your Contact No." value={data.phone} onChange={e => { handleChange({ phone: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Type" required>
                                    <Input placeholder="Your Location Type" value={data.type} onChange={e => { handleChange({ type: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
});