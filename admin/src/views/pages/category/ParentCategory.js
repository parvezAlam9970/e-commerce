import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import util from '../../../utils/util';
import { Avatar, Button, Card, Col, Form, Image, Input, message, Modal, Popconfirm, Row, Select, Space, Spin, Table, Tag, Typography } from 'antd';
import Pagination from '../../components/Pagination';

import { DeleteOutlined, EditOutlined, EyeOutlined,UploadOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import serviceCategory from '../../../services/category';
import UploadImage from '../../../utils/UploadImage'



const ParentCategory = ({selected , setSelected}) => {
    const [ar, setAr] = useState({
        viewAccess: true || util.checkRightAccess(),
        addAccess: true || util.checkRightAccess(),
        editAccess: true || util.checkRightAccess(),
        deleteAccess: true || util.checkRightAccess(),
        viewRightAccess: true || util.checkRightAccess(),
    });

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [qData, setQData] = useState({ page: 1, limit: 20 });

    const addNewModalRef = useRef();
    
    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            render: (picture) => {

                return <Image
                    src={picture}
                    width={100}
                    height={50}
                    style={{objectFit : "contain"}}

                />
            }

        },
        {
            title: 'Category',
            dataIndex: 'name',
            render: (v, row) => <Space>
                <span style={{ fontWeight: 700 }}>

                    {v}
                </span>

            </Space>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: isActive => {
                if (isActive) {
                    return <Tag className="custom-tag" color="#87d068">
                        Active
                    </Tag>
                } else {
                    return <Tag className="custom-tag" color="#f50">
                        InActive
                    </Tag>

                }
            },
        },
        {
            title: 'Actions',
            dataIndex: 'action',
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
    ];
  



    function list() {
        if (ar.viewAccess) {
            setLoading(true);
            serviceCategory.list({...qData,showOnlyParent: 1}).then(res => {
                setData(res.data?.map((v) => ({ ...v, key: v._id })));
                setQData({ ...qData, limit: res.extra.limit, page: res.extra.page, total: res.extra.total });
            }).catch(err => { }).finally(() => {
                setLoading(false);
            });
        }
    }
    const deleteData = (id) => {
        serviceCategory.delete(id).then(res => {
            message.success(res.message);
            list();
        }).catch(err => {
            message.error(err.message);
        });
    }
    const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';

    const tableProps = {
        bordered: true,
        loading,
        size: 'middle',
        // title: () => <Search {...{ addNewModalRef, deleteData, qData, setQData, list, ar }} />,
        showHeader: false,
        footer: () => <Pagination {...{ qData, setQData }} />,
        rowSelection: {
            onChange: (selectedRowKeys) => {
                console.log('onChange: ', selectedRowKeys)
                setSelected({ ...selected, parentCategory: selectedRowKeys?.[0] });
            },
            selectedRowKeys: [selected.parentCategory],
            columnWidth: 0,
        },
        tableLayout: undefined,
    };


    useEffect(() => {
        list();
    }, [qData.page, qData.limit]);

  return (
    <div>

<Card bordered={false} size="small" title={"List of Category"}
                extra={
                    <Row justify="end" gutter={12}>
                        <Col>
                            {
                                ar.addAccess
                                    ? <Button type="primary" icon={<PlusOutlined />} onClick={() => { addNewModalRef.current.openForm({ selected }) }}>Add New</Button>
                                    : null
                            }
                        </Col>
                    </Row>
                }>
                <Table
                    className="table-row-border-none"
                    {...tableProps}
                    pagination={{ position: ['none'], pageSize: qData.limit }}
                    columns={tableColumns}
                    dataSource={data.length ? data : []}
                    scroll={{ y: 'calc(100vh - 340px)', x1: 'calc(100vw - 387px)' }}
                    onRow={(record) => {
                        // console.log(record, "record")
                        return {
                            onClick: (event) => {
                                setSelected({ ...selected, parentCategory: record.key });
                            }
                        };
                    }}
                    style={{ cursor: 'pointer' }}
                />
                <AddForm ref={addNewModalRef} {...{ list, ar, selected }} />
            </Card>


    </div>
  )
}

export default ParentCategory




const AddForm = forwardRef((props, ref) => {
    const { list, ar } = props;
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({});
    const [ajxRequesting, setAjxRequesting] = useState(false);


    useImperativeHandle(ref, () => ({
        openForm(data) {
            console.log(data, "dadadd")
            setOpen(true);
            setData({ ...data });
        }
    }));

    function save() {
        setAjxRequesting(true);
        serviceCategory.save({ ...data }).then(res => {
            message.success(res.message);
            setOpen(false);
            list();
        }).catch(err => {
            message.error(err.message || err.errors?.[0]?.msg);
        }).finally(() => {
            setAjxRequesting(false);
        });
    }

    useEffect(() => {
        if (!data._id) {
            setData({ ...data, slug: util.removeSpecialChars(data.name) });
        }
    }, [data.name]);

    const handleChange = (value) => {
        if (ar.addAccess || ar.editAccess) {
            setData({ ...data, ...value })
        }
    }

    return (
        <>
            <Modal
                title={<Typography.Text>{data?._id ? "Edit Category" : "Add Category"}</Typography.Text>}
                width={500}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting }}
                onCancel={() => { setOpen(false) }}
                open={open}
                destroyOnClose
                footer={[
                    <Button key="cancel" onClick={() => { setOpen(false); }}>Cancel</Button>,
                    <Button key="save" type="primary" onClick={save}>Save</Button>,
                ]}
            >
                <Spin spinning={ajxRequesting}>
                    <Form layout="vertical" disabled={(!ar.addAccess && !ar.editAccess)} >
                        <Row gutter={20} style={{ marginTop: 20 }}>
                            <Col span={24}>
                                <Form.Item label="Category" required>
                                    <Input placeholder="Category Name" onChange={(e) => setData({ ...data, name: e.target.value })} value={data.name} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Slug" required>
                                    <Input placeholder="Slug" onChange={(e) => setData({ ...data, slug: e.target.value })} value={data.slug} />
                                </Form.Item>
                            </Col>
                            {/* <Col span={24}>
                                <Form.Item label="Tag">
                                    <Input placeholder="Tag" onChange={(e) => setData({ ...data, tag: e.target.value })} value={data.tag} />
                                </Form.Item>
                            </Col> */}
                            <Col span={24}>
                                <Form.Item label="Status" required>
                                    <Select value={data?.status} placeholder="Choose" onChange={e => { handleChange({ status: e }) }} >
                                        <Select.Option value={true}>Active</Select.Option>
                                        <Select.Option value={false}>Inactive</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="thumbnail"
                                    label="Thumbnail"
                                    rules={[{ required: true, message: 'Please upload a thumbnail!' }]}
                                >
                                    <UploadImage value={data.image ? [data.image] : []}
                                        onChange={(v) => { setData({ ...data, image: v?.[0] }); }}
                                        listType="picture"
                                        uploadButton={
                                            <Tag style={{ width: "100%", padding: 10 }}>
                                                <Button block size="large" type="link" icon={<UploadOutlined />}>Upload</Button>
                                            </Tag>
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
});