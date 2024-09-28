/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, Form, Row, Col, Popconfirm, Modal, Spin, Input, message, Select, Tag, Typography, Space } from 'antd';
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import Pagination from '../../components/Pagination';
import service from '../../../services/userAddress';
import util from '../../../utils/util';


export default function Address({ userId }) {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [qData, setQData] = useState({ page: 1, limit: 20, userId });
    const addNewModalRef = useRef();

    const columns = [
        {
            title: '#',
            width: 40,
            render: (v, row, i) => <b>{i + 1}</b>
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: v => <Tag color={v === "Home" ? "purple" : (v === "Office" ? "cyan" : "magenta")}>{v}</Tag>,
            width: 100,
        },
        {
            title: 'Receiver Name',
            dataIndex: 'name',
            width: 200
        },
        {
            title: 'Address',
            dataIndex: 'address_line_1',
            render: (v, row) => (
                <Space size="small">
                    <Space.Compact direction="vertical">
                        <Typography.Text>Address Line 1: <Typography.Text type="danger">{v}</Typography.Text> </Typography.Text>
                      

                    </Space.Compact>
                </Space>
            )
        },
        {
            title: 'State',
            dataIndex: 'state',
            width: 150
        },
        {
            title: 'Pin Code',
            dataIndex: 'pinCode',
            width: 80
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
            width: 200,
            render: (v, row) => (
                <Space size="small">
                    <Space.Compact direction="vertical">
                        <Typography.Text>Primary Phone: <Typography.Text type="danger">{v}</Typography.Text> </Typography.Text>
                        {
                            row.optinalPhone
                                ? <Typography.Text>Optional Phone: <Typography.Text type="danger">{row.optinalPhone}</Typography.Text> </Typography.Text>
                                : null
                        }

                    </Space.Compact>
                </Space>
            )
        },
        {
            title: 'Action',
            dataIndex: '_id',
            width: 70,
            render: (v, row) => {
                return <>
                    <Popconfirm
                        title="Are you sure to delete this address?"
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
            setData(res.data?.map((v) => ({ ...v, key: v._id })));
            setQData({ ...qData, limit: res.extra.limit, page: res.extra.page, total: res.extra.total });
        }).catch(err => { }).finally(() => {
            setLoading(false);
        });
    }

    const deleteData = (id) => {
        service.delete(id).then(res => {
            message.success(res.message);
            list();
        }).catch(err => {
            message.error("Address can not be deleted. Reason: " + err?.message);
        });
    }

    const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';

    const tableProps = {
        bordered: true,
        loading,
        size: 'small',
        title: () => <Search {...{ addNewModalRef, deleteData, qData, setQData, list, }} />,
        showHeader: true,
        footer: () => <Pagination {...{ qData, setQData }} />,
        tableLayout: undefined,
    };

    useEffect(() => {
        list();
    }, [qData.page, qData.limit]);

    return (
        <>
            <Table
                {...tableProps}
                pagination={{ position: ['none'], pageSize: qData.limit }}
                columns={tableColumns}
                dataSource={data.length ? data : []}
                scroll={{ y: 'calc(100vh - 340px)', x: 'calc(100vw - 387px)' }}
            />
            <AddForm ref={addNewModalRef} {...{ list, userId }} />
        </>
    );
}

function Search({ addNewModalRef, qData, setQData, list, }) {
    return (
        <Form onSubmitCapture={list} className="search-form1">
            <Row gutter={[12, 12]}>
                <Col span={20}>
                    <Row gutter={[12, 12]}>
                        <Col span={8}>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Input placeholder="Search by receiver name | address1 | pin code | phone" defaultValue={qData.key} onChange={e => (setQData({ ...qData, key: e.target.value }))} allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button type="primary" htmlType="submit">Search</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={4}>
                    <Form.Item style={{ marginBottom: 0, float: 'right' }}>
                        <Button type="primary" icon={<PlusOutlined />} onClick={() => { addNewModalRef.current.openForm() }}>Add New</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

const AddForm = forwardRef((props, ref) => {
    const { list, userId } = props;
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});
    const [ajxRequesting, setAjxRequesting] = useState(false);


    const handleChange = (value) => { setData({ ...data, ...value }); }

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(
                dt
                    ? { ...dt }
                    : { userId }
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
            message.error(err.message);
        }).finally(() => {
            setAjxRequesting(false);
        });
    }

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
                width={800}
                className="app-modal-body"
                footer={[
                    <Button key="cancel" onClick={() => { setOpen(false); }}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={save}>save</Button>,
                ]}
            >
                <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                    <Form layout="vertical">
                        <Row gutter={[12, 2]}>
                            <Col span={6}>
                                <Form.Item label="Address Type" required>
                                    <Select value={data?.type} placeholder="Home/Office/Other" onChange={e => { handleChange({ type: e }) }} >
                                        <Select.Option value="Home">Home</Select.Option>
                                        <Select.Option value="Office">Office</Select.Option>
                                        <Select.Option value="Other">Other</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={18}>
                                <Form.Item label="Receiver Name" required>
                                    <Input placeholder="Ex: Mukesh Yadav" value={data.name} onChange={e => { handleChange({ name: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Phone" required>
                                    <Input placeholder="EX: 8812XXXXXX" prefix="+91 " value={data.phone} onChange={e => { handleChange({ phone: util.handleInteger(e.target.value) }) }} />
                                </Form.Item>
                            </Col>
                      
                            <Col span={6}>
                                <Form.Item label="State" required>
                                    <Input placeholder="EX: Delhi" value={data.state} onChange={e => { handleChange({ state: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="City" required>
                                    <Input placeholder="EX:New Delhi" value={data.city} onChange={e => { handleChange({ city: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="Pin Code" required>
                                    <Input placeholder="EX: 110085" value={data.pinCode} onChange={e => { handleChange({ pinCode: util.handleInteger(e.target.value, 6) }) }} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Address Line 1" required>
                                    <Input.TextArea placeholder="EX: B-25, Sector 58, Noida 201301, UP, India" value={data.address_line_1} onChange={e => { handleChange({ address_line_1: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                      
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
});