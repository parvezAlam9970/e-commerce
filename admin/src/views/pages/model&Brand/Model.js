"use client"
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import util from '../../../utils/util';
import { Button, Card, Col, Form, Input, message, Modal, Popconfirm, Row, Select, Space, Spin, Table, Tag } from 'antd';
import brandAndModel from '../../../services/brand&Model';
import { DeleteOutlined, EditOutlined, EyeOutlined,UploadOutlined,LoadingOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import Pagination from '../../components/Pagination';



const Model = () => {
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
    const addNewModalRef = useRef()

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (v) => <Space>{v}</Space>

        },

        {
            title: 'Brand',
            dataIndex: 'brandDetails',
            render: (v) => <Space>{v.name}</Space>

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
                  
                </>
            }
        },
    ];

    function list() {
        if (ar.viewAccess) {
            setLoading(true);
            brandAndModel.list({...qData}).then(res => {
                setData(res.data?.map((v) => ({ ...v, key: v._id })));
                setQData({ ...qData, limit: res.extra.limit, page: res.extra.page, total: res.extra.total });
            }).catch(err => { }).finally(() => {
                setLoading(false);
            });
        }
    }

    const deleteData = (id) => {
		brandAndModel
			.delete(id)
			.then((res) => {
				message.success(res.message);
				list();
			})
			.catch((err) => {
				message.error(err.message);
			});
	};


    const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

    tableColumns[0].fixed = true;
    tableColumns[tableColumns.length - 1].fixed = 'right';
    
    const tableProps = {
        bordered: true,
        loading,
        size: 'middle',
        title: () => <Search {...{ addNewModalRef, deleteData, qData, setQData, list, ar }} />,
        showHeader: true,
        footer: () => <Pagination {...{ qData, setQData }} />,
        rowSelection: {
            // onChange: (selectedRowKeys) => {
            //     console.log('onChange: ', selectedRowKeys)
            //     setSelected({ ...selected, parentCategory: selectedRowKeys?.[0] });
            // },
            // selectedRowKeys: [selected.parentCategory],
            columnWidth: 0,
        },
        tableLayout: undefined,
    };




    useEffect(() => {
        list();
    }, [qData.page, qData.limit]);

  return (
    <Card bordered={false} size="small" title={"List of Model"}
                extra={
                    <Row justify="end" gutter={12}>
                        <Col>
                            {
                                ar.addAccess
                                    ? <Button type="primary" icon={<PlusOutlined />} onClick={() => { addNewModalRef.current.openForm() }}>Add New</Button>
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
                    // onRow={(record) => {
                    //     // console.log(record, "record")
                    //     return {
                    //         onClick: (event) => {
                    //             setSelected({ ...selected, parentCategory: record.key });
                    //         }
                    //     };
                    // }}
                    style={{ cursor: 'pointer' }}
                />
                <AddForm ref={addNewModalRef} {...{ list, ar }} />
            </Card>
  )
}

export default Model



function Search({ qData, setQData, list }) {
	return (
		<Form onSubmitCapture={list}>
			<Row gutter={[12, 12]}>
				<Col span={8}>
					<Input
						placeholder="Search by name"
						value={qData.name}
						onChange={(e) => setQData({ ...qData, name: e.target.value })}
						allowClear
					/>
				</Col>
				<Col span={3}>
					<Button type="primary" htmlType="submit">
						Search
					</Button>
				</Col>
			</Row>
		</Form>
	);
}


const AddForm = forwardRef((props, ref) => {
	const { list, ar } = props;
	const [open, setOpen] = useState(false);
	const [data, setData] = useState({});
	const [ajxRequesting, setAjxRequesting] = useState(false);
    const [brandOptions , setBrandOptions] = useState([]);

	const handleChange = (value) => {
		if (ar.addAccess || ar.editAccess) {
			setData({ ...data, ...value });
		}
	};


    async function  fetchBrandList(){
        try {
            let res = await brandAndModel.brandList()
            if(res.success){
                setBrandOptions(res.data)
            }
        } catch (error) {
            
        }
    }

	useImperativeHandle(ref, () => ({
		openForm(dt) {
			setOpen(true);
			setData(dt ? { ...dt } : { status: true });
		},
	}));
console.log(brandOptions)
	const save = () => {
		setAjxRequesting(true);
		brandAndModel
			.save(data)
			.then((res) => {
				message.success(res.message);
				setOpen(false);
				list();
			})
			.catch((err) => {
				message.error(err.message);
			})
			.finally(() => {
				setAjxRequesting(false);
			});
	};

console.log(data)
    useEffect(() => {
		if (!data._id) {
			handleChange({ slug: util.removeSpecialChars(data.name) })
		}
	}, [data.name]);

    useEffect(()=>{
        fetchBrandList()
    } , [])

	return (
		<>
			<Modal
				title={(!data?._id ? "Add" : "Edit") + " Model"}
				style={{ top: 20 }}
				open={open}
				okText="Save"
				onOk={save}
				okButtonProps={{ disabled: ajxRequesting }}
				onCancel={() => { setOpen(false); }}
				destroyOnClose
				maskClosable={false}
				width={500}
				footer={[
					<Button key="cancel" onClick={() => { setOpen(false); }} > Cancel </Button>,
					<Button key="save" type="primary" onClick={save}> Save </Button>,
				]}
			>
				<Spin
					spinning={ajxRequesting}
					indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
				>
					<Form layout="vertical">
						<Row gutter={[12, 0]}>
							<Col span={24}>
								<Form.Item label="Name" required>
									<Input placeholder="Name" value={data?.name} onChange={(e) => { handleChange({ name: e.target.value }); }} />
								</Form.Item>
							</Col>

                            <Col span={24}>
								<Form.Item label="Slug" required>
                                <Input placeholder="Unique slug" value={data.slug} onChange={(e) => { handleChange({ slug: util.removeSpecialChars(e.target.value) }) }} />

								</Form.Item>
							</Col>


                            <Col span={24}>
								<Form.Item label="Brands" required>
									<Select value={data?.brandDetails?.name} placeholder="Choose" onChange={e => { handleChange({ brandId: e }) }} >
                                        {
                                            brandOptions?.map((elm ,i)=>{

                                               return <Select.Option key={i} value={elm?._id}>{elm?.name}</Select.Option>
                                            })
                                        }
									
									</Select>
								</Form.Item>
							</Col>
						
							
							<Col span={24}>
								<Form.Item label="Status" required>
									<Select value={data?.status} placeholder="Choose" onChange={e => { handleChange({ status: e }) }} >
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