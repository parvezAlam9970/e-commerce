/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, Form, Row, Col, Popconfirm, Modal, Spin, Card, Space, message, Input, Switch, Select, Tag } from 'antd';
import { DeleteOutlined, EditOutlined, LoadingOutlined, EyeOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import serviveSubAdmin from '../../../services/subadmin';
import serviceRole from '../../../services/role';
import serviceCity from '../../../services/city';
import serviceState from '../../../services/state';
import serviceRight from '../../../services/right';
import Pagination from '../../components/Pagination';
import util from '../../../utils/util';
import { useNavigate } from 'react-router-dom';



export default function SubAdmin({ stateId }) {

    const [ar, setAr] = useState({
        viewAccess: util.checkRightAccess('super-admin-access-list'),
        addAccess: util.checkRightAccess('super-admin-access-add'),
        editAccess: util.checkRightAccess('super-admin-access-edit'),
        deleteAccess: util.checkRightAccess('super-admin-access-delete'),
    });
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [qData, setQData] = useState({ page: 1, limit: 20, stateId });
    const [subAdmin, setSubAdmin] = useState([])
    const [rights, setRights] = useState([]);
    const [city, setCity] = useState([]);
    const [state, setState] = useState([]);
    const [role, setRole] = useState([]);
    // const ModelModalStateRef = useRef()
    const addNewModalRef = useRef();
    const columns = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            // width: 300,
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            // width: 300,
        },
        {
            title: 'Contact Number',
            dataIndex: 'phone',
            // width: 300,
        },
        {
            title: 'E-Mail',
            dataIndex: 'email',
            // width: 300,
        },
        // {
        //     title: 'Role',
        //     dataIndex: 'role',
        //     // width: 300,
        // },
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
            hidden: !ar.addAccess && !ar.editAccess && !ar.deleteAccess && !ar.viewAccess,
            render: (v, row) => {
                return <>
                    {
                        ar.deleteAccess
                            ? <Popconfirm
                                title="Are you sure to delete this Sub-Admin?"
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
            serviveSubAdmin.list(qData).then(res => {
                setData(res.data?.map((v) => ({ ...v, key: v._id })));
                setQData({ ...qData, limit: res.extra.limit, page: res.extra.page, total: res.extra.total });
            }).catch(err => { }).finally(() => {
                setLoading(false);
            });
        }
    }

    const deleteData = (id) => {
        serviveSubAdmin.delete(id).then(res => {
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
        title: () => <Search {...{ addNewModalRef, selected, deleteData, qData, setQData, list, ar, city, state, role }} />,
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
        // if (ar.viewAccess) {
        //     serviceState.list({ isAll: 1 }).then(res => { setState(res.data || []); }).catch(err => { message.error('State data not loaded'); });
        // }
        // if (ar.viewAccess) {
        //     serviceCity.list({ isAll: 1, _id: stateId }).then(res => { setCity(res.data || []); }).catch(err => { message.error('City data not loaded'); });
        // }
        if (ar.viewAccess) {
            serviceRole.list({ isAll: 1 }).then(res => { setRole(res.data || []); }).catch(err => { message.error('Role data not loaded'); });
        }
        if (ar.viewAccess) {
            serviceRight.list({ isAll: 1 }).then(res => { setRights(res.data || []); }).catch(err => { message.error('Role data not loaded'); });
        }
    }, [qData.page, qData.limit]);

    return (
        <>
            <Card bordered={false} size="small" title={
                <>
                    <Space>
                    <Button type="dashed" danger icon={<ArrowLeftOutlined />} onClick={()=>navigate(-1)}>Back</Button>
                        List of Sub Admins
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
                <AddForm ref={addNewModalRef} {...{ list, rights, ar, role, state, city, subAdmin }} />
            </Card>
        </>
    );
};

function Search({ qData, setQData, list, city, state, role }) {
    return (
        <Form onSubmitCapture={list}>
            <Row gutter={12}>
                <Col span={6}>
                    <Input placeholder="Search by name / phone / email" value={qData.key} onChange={e => (setQData({ ...qData, key: e.target.value }))} allowClear />
                </Col>
                {/* <Col span={5}>
                    <Select placeholder="Search by State" style={{ width: "100%" }} value={qData.stateId} onChange={e => (setQData({ ...qData, stateId: e, cityId: null }))} allowClear options={state?.map(v => ({ value: v?._id, label: v?.name }))} />
                </Col>
                <Col span={5}>
                    <Select placeholder="Search by City" style={{ width: "100%" }} value={qData.cityId} onChange={e => (setQData({ ...qData, cityId: e }))} allowClear options={city?.filter(v => v.stateId === qData?.stateId)?.map(v => ({ value: v?._id, label: v?.name }))} />
                </Col> */}
                <Col span={5}>
                    <Select placeholder="Search by Role" style={{ width: "100%" }} value={qData.roleId} onChange={e => (setQData({ ...qData, roleId: e }))} allowClear options={role?.map(v => ({ value: v?._id, label: v?.name }))} />
                </Col>
                <Col span={3}>
                    <Button type="primary" htmlType="submit">Search</Button>
                </Col>
            </Row>
        </Form>
    );
};

const AddForm = forwardRef((props, ref) => {
    const { list, rights, ar, state, role, city, stateId, subAdmin } = props;
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
                    ? { adminRights: [], ...dt }
                    : { adminRights: [], stateId }
            );
        }
    }));

    const save = () => {
        setAjxRequesting(true);
        if (!data?._id) {
            if (data?.password) {
                serviveSubAdmin.save(data).then((res) => {
                    message.success(res.message);
                    setOpen(false);
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
            } else {
                message.error("Password is Required");
                setAjxRequesting(false);
            }
        } else {
            serviveSubAdmin.save(data).then((res) => {
                message.success(res.message);
                setOpen(false);
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

    }

    return (
        <>
            <Modal
                title={(!data._id ? 'Add' : 'Edit') + ' Sub-Admin'}
                style={{ top: 20 }}
                open={open}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting }}
                onCancel={() => { setOpen(false); }}
                destroyOnClose
                maskClosable={false}
                width={1000}
            //    className="app-modal-body-overflow"
                footer={[
                    <Button key="cancel" onClick={() => { setOpen(false); }}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={save}>Save</Button>
                ]}
            >
                <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <Form layout="vertical">
                        <Row gutter={[12, 0]}>
                            <Col span={12}>
                                <Form.Item label="First Name" required>
                                    <Input placeholder="Aishwary" value={data.firstName} onChange={e => { handleChange({ firstName: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Last Name" required>
                                    <Input placeholder="Nigam" value={data.lastName} onChange={e => { handleChange({ lastName: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                          
                            <Col span={12}>
                                <Form.Item label="E-Mail" required>
                                    <Input placeholder="aishwary@test.com" value={data.email} onChange={e => { handleChange({ email: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Contact Number" required>
                                    <Input placeholder="+910000000000" value={data.phone} onChange={e => { handleChange({ phone: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            {/* <Col span={12}>
                                <Form.Item label="Select State" required>
                                    <Select value={data?.stateId} onChange={v => { handleChange({ stateId: v, cityId: null }) }}
                                        options={
                                            state?.map(v => (
                                                {
                                                    value: v?._id,
                                                    label: v?.name,
                                                }
                                            ))
                                        }
                                    >
                                    </Select>
                                </Form.Item>
                            </Col> */}
                            {/* <Col span={12}>
                                <Form.Item label="Select City" required>
                                    <Select value={data?.cityId} onChange={v => { handleChange({ cityId: v }) }}
                                        options={
                                            city?.filter(v => v.stateId === data?.stateId)?.map(v => (
                                                {
                                                    value: v?._id,
                                                    label: v?.name,
                                                }
                                            ))
                                        }
                                    >
                                    </Select>
                                </Form.Item>
                            </Col> */}
                            <Col span={12}>
                                <Form.Item label="Select Role" required>
                                    <Select value={data?.roleId} onChange={(v, option) => { handleChange({ roleId: v, adminRights: option.rightCodes }) }}
                                        options={
                                            role?.map(v => (
                                                {
                                                    value: v?._id,
                                                    label: v?.name,
                                                    rightCodes: v.rightCodes
                                                }
                                            ))
                                        }
                                    >
                                    </Select>
                                </Form.Item>
                            </Col>
                            {/* <Col span={6}> */}
                                {

                                    rights.map(v => (
                                        <Col style={{ marginLeft: '20px' }} span={4}>
                                            <Form.Item label={v.name}>
                                                <Switch checkedChildren={"Yes"} unCheckedChildren={"No"} checked={data.adminRights?.includes(v.code)} onChange={checked => {
                                                    handleChange({
                                                        adminRights: checked ? [...new Set([...data.adminRights, v.code])] : [...new Set(data.adminRights.filter(right => right !== v.code))]
                                                    })
                                                }} />
                                            </Form.Item>
                                        </Col>
                                    ))

                                }
                            {/* </Col> */}
                            {
                                !data._id ?
                                    <Col span={12}>
                                        <Form.Item label="Set Password" required>
                                            <Input placeholder="*********" type='password' value={data.password} onChange={e => { handleChange({ password: e.target.value }) }} />
                                        </Form.Item>
                                    </Col>
                                    :
                                    <Col span={12}>
                                        <Form.Item label="Update Password" required>
                                            <Input placeholder="*********" type='password' value={data.password} onChange={e => { handleChange({ password: e.target.value }) }} />
                                        </Form.Item>
                                    </Col>
                            }
                            <Col span={12}>
                                <Form.Item label="Status" required>
                                    <Select value={data.status} onChange={e => { handleChange({ status: e }) }} >
                                        <Select.Option value={true} >Active</Select.Option>
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