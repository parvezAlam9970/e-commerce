/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, Form, Row, Col, Popconfirm, Modal, Spin, message, Input, Card, Space, Select } from 'antd';
import { DeleteOutlined, EditOutlined, LoadingOutlined, EyeOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import serviceRight from '../../../services/right';
import Pagination from '../../components/Pagination';
import util from '../../../utils/util';
import { useNavigate } from 'react-router-dom';
import serviceRoleGrp from '../../../services/rightGrp';

export default function Right() {
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
            title: 'Code',
            dataIndex: 'code',
        },
        {
            title: 'Right Group',
            dataIndex: 'rightGrpName',
            width: 300,
            render: v => <span>{v[0]}</span>
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
        serviceRoleGrp.list({ isAll: 1 }).then(res => { setRightGrps(res.data || []) });

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
                message.error(err.message);
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
                title={(!data._id ? 'Add' : 'Edit') + ' Right'}
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
                                <Form.Item label="Name" required>
                                    <Input placeholder="name" value={data.name} onChange={e => { handleChange({ name: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label='Choose Right Group'>
                                    <Select placeholder="Main Group" value={data?.rightGrpId} onChange={e => { handleChange({ rightGrpId: e }); }}
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
                                <Form.Item label="Code" required>
                                    <Input placeholder="Unique code" value={data.code} onChange={e => { handleChange({ code: util.removeSpecialChars(e.target.value) }) }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
});