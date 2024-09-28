/* eslint-disable no-unused-vars */
import { Table, Button, Form, Row, Col, Popconfirm, Card, Spin, message, Input, Space, Modal, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
// import Pagination from '../../components/Pagination';
import serviceMetadata from '../../../services/metadata';
import util from '../../../utils/util';
import ReportProblem from './ReportProblems';

export default function Metadata() {
    const enums = [
        {
            name: "Dealership Registration Certificate",
            type: "dealership-registration-certificate"
        },
        {
            name: "Report Problem",
            type: "report-problem"
        }
    ];

    return (
        <Row gutter={[12, 12]}>
            {enums.map(v => (
                <Col span={8} key={v.type}>
                    <List {...{ ...v }} />
                </Col>
            ))}
        </Row>
    );
}


function List(metadata) {

    const [ar, setAr] = useState({
        viewAccess: util.checkRightAccess('list-dealer'),
        addAccess: util.checkRightAccess('add-dealer'),
        editAccess: util.checkRightAccess('edit-dealer'),
        deleteAccess: util.checkRightAccess('delete-dealer'),
        viewRightAccess: util.checkRightAccess('list-dealer'),
    });

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [qData, setQData] = useState({ page: 1, limit: 20, isAll: 1, type: metadata.type });

    const addNewModalRef = useRef();
    const reportProblemModalRef = useRef();
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            onCell: (record, rowIndex) => {
                if (qData.type === "report-problem") {
                    return {
                        onClick: (ev) => {
                            reportProblemModalRef.current.openForm(record)
                        },
                    };
                } else {
                    return <></>;
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
                                title="Are you sure to delete this metadata?"
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
            serviceMetadata.list(qData).then(res => {
                setData(res.data?.map((v) => ({ ...v, key: v._id })));
                setQData({ ...qData, limit: res.extra.limit, page: res.extra.page, total: res.extra.total });
            }).catch(err => { }).finally(() => {
                setLoading(false);
            });
        }
    }

    const deleteData = (id) => {
        serviceMetadata.delete(id).then(res => {
            message.success(res.message);
            list();
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
        title: () => <Search {...{ addNewModalRef, deleteData, qData, setQData, list, ar }} />,
        showHeader: true,
        // footer: () => <Pagination {...{ qData, setQData }} />,
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
                        <Typography.Text>List of</Typography.Text>
                        <Typography.Text type="danger">{metadata.name}</Typography.Text>
                    </Space>

                </>
            }
                extra={
                    <>
                        <Row justify="end" gutter={12}>
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
                // scroll={{ y: 'calc(100vh - 340px)', x: 'calc(100vw - 387px)' }}
                />
                <AddForm ref={addNewModalRef} {...{ list, ar, metadata }} />
                <ReportProblemModal ref={reportProblemModalRef} {...{ list, ar, metadata }} />
            </Card>
        </>
    );
};

function Search({ qData, setQData, list }) {
    return (
        <Form onSubmitCapture={list}>
            <Row gutter={12}>
                <Col span={20}>
                    <Input placeholder="Search by name" value={qData.key} onChange={e => (setQData({ ...qData, key: e.target.value }))} allowClear />
                </Col>
                <Col span={4}>
                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />} block />
                </Col>
            </Row>
        </Form>
    );
};

const AddForm = forwardRef((props, ref) => {
    const { list, metadata } = props;
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});
    const [ajxRequesting, setAjxRequesting] = useState(false);


    const handleChange = (v, k) => {
        let varDt = data;
        if (k) {
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
        }
        setData({ ...data, ...v });
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
        serviceMetadata.save({ ...data, type: metadata.type }).then((res) => {
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



    return (
        <>
            <Modal
                title=<Typography.Text>{(!data._id ? 'Add' : 'Edit')} Metadata of <Typography.Text type="danger">{metadata.name}</Typography.Text> </Typography.Text>
                style={{ top: 20 }}
                open={open}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting }}
                onCancel={() => { setOpen(false); }}
                destroyOnClose
                maskClosable={false}
                width={400}
                footer={[
                    <Button key="cancel" onClick={() => { setOpen(false); }}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={save}>Save</Button>,
                ]}
            >
                <Spin spinning={ajxRequesting}>
                    <Form layout="vertical">
                        <Row gutter={10}>
                            <Col span={24}>
                                <Form.Item label="Name" required>
                                    <Input placeholder="Name" value={data.name || ''} onChange={e => { handleChange({ name: e.target.value }) }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
});


const ReportProblemModal = forwardRef((props, ref) => {
    const { list, metadata } = props;
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});
    const [ajxRequesting, setAjxRequesting] = useState(false);


    const handleChange = (v, k) => {
        let varDt = data;
        if (k) {
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
        }
        setData({ ...data, ...v });
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



    return (
        <>
            <Modal
                title=<Typography.Text>{(!data._id ? 'Add' : 'Edit')} Metadata of <Typography.Text type="danger">{metadata.name}</Typography.Text> </Typography.Text>
                style={{ top: 20 }}
                open={open}
                okText="Save"
                okButtonProps={{ disabled: ajxRequesting }}
                onCancel={() => { setOpen(false); }}
                destroyOnClose
                maskClosable={false}
                width={1400}
            >
                <ReportProblem name={data.name} />
            </Modal>
        </>
    );
});