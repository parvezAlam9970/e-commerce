/* eslint-disable no-unused-vars */
import { Table, Button, Form, Row, Col, Popconfirm, Card, Spin, Typography, message, Input, Divider, Space, Tag, Select, Modal } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import Pagination from '../../components/Pagination';
import service from '../../../services/report-problem';
import serviceEnums from '../../../services/metadata';
import util from '../../../utils/util';
import { useNavigate } from 'react-router-dom';

export default function ReportProblem({ name = null }) {

    const [ar, setAr] = useState({
        viewAccess: util.checkRightAccess('list-dealer'),
        addAccess: util.checkRightAccess('add-dealer'),
        editAccess: util.checkRightAccess('edit-dealer'),
        deleteAccess: util.checkRightAccess('delete-dealer'),
        viewRightAccess: util.checkRightAccess('list-dealer'),
    });

    service.list({}).then(res => {
    }).catch(err => { }).finally(() => {
        setLoading(false);
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [state, setState] = useState([]);
    const [qData, setQData] = useState({ page: 1, limit: 20, type: name });
    const [rights, setRights] = useState([]);
    const navigate = useNavigate();

    const addNewModalRef = useRef();
    const columns = [
        {
            title: 'DealerName',
            dataIndex: 'dealerName',
            // width: 40,
            render: (v) => <span>{v?.name || '-'}</span>
        },
        {
            title: 'Type',
            dataIndex: 'type',
            // width: 40,
        },
        {
            title: 'Information',
            dataIndex: 'information',
            // width: 40,
        },
        {
            title: 'Action',
            dataIndex: '_id',
            width: 70,
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
                </>
            }
        },
    ].filter(item => !item.hidden);

    function list() {
        if (ar.viewAccess) {
            setLoading(true);
            service.list(qData).then(res => {
                setData(res.data?.map((v) => ({ ...v, key: v._id })));
                setQData({ ...qData, limit: res.extra.limit, page: res.extra.page, total: res.extra.total });
            }).catch(err => { }).finally(() => {
                setLoading(false);
            });
        }
    }

    const deleteData = (id) => {
        service.delete(id).then(res => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qData.page, qData.limit]);

    return (
        <>
            <Card bordered={false} size="small" title={
                <>
                    <Space>
                        <Button type="dashed" danger icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>Back</Button>
                        List of Dealer
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
            </Card>
        </>
    );
};

function Search({ qData, setQData, list }) {
    const [options, setOptions] = useState([])

    useEffect(() => {
        serviceEnums.list({ type: "report-problem" })
            .then(res => {
                setOptions(res.data);
            })
            .catch(err => {
            })
    }, [])


    const onChange = (v, key) => {
        qData[key] = v;
        if (v === undefined || v === "") {
            qData[key] = "";
            list();
        }
    };
    return (
        <Form onSubmitCapture={list}>
            <Row gutter={12}>
                <Col span={6}>
                    <Form.Item required >
                        <Select value={qData.type} onChange={(e) => onChange(e, "type")} placeholder="Search by report type" allowClear={true}>
                            {options.map(v => (
                                <Select.Option value={v?.name} key={v?._id}>{v?.name}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Button type="primary" htmlType="submit">Search</Button>
                </Col>
            </Row>
        </Form>
    );
};

