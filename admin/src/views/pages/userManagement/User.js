/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, Form, Row, Col, Popconfirm, Typography, Select, Modal, Spin, Card, message, Input, DatePicker, Avatar, Tag, Space, Image } from "antd";
import { DeleteOutlined, EditOutlined, LoadingOutlined, EyeOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import UploadImage from "../../../utils/UploadImage";
import serviceUser from "../../../services/userlist";
import Pagination from "../../components/Pagination";
import util from "../../../utils/util";
import Address from "./Address";
import dayjs from 'dayjs';
import moment from 'moment';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function User() {
	const [ar, setAr] = useState({
		viewAccess: util.checkRightAccess("super-admin-access-list"),
		addAccess: util.checkRightAccess("super-admin-access-add"),
		editAccess: util.checkRightAccess("super-admin-access-edit"),
		deleteAccess: util.checkRightAccess("super-admin-access-delete"),
	});
	const navigate = useNavigate();


	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [qData, setQData] = useState({ page: 1, limit: 20 });
	const addNewModalRef = useRef();
	const addressModalRef = useRef();
	const cartModalRef = useRef();

	const columns = [
		{
			title: "Profile",
			dataIndex: "profile_picture",
			render: (v, row) => (
				<div className="flex a-center">
					{v ? (
						<Avatar src={v} size={70} />
					) : (
						<Avatar style={{ backgroundColor: 'lightgray', width: 70, height: 70 }} size={70}>
							{row?.name?.charAt(0)}
						</Avatar>
					)}
					<h4 style={{ marginLeft: "10px" }}>{row?.name}</h4>
				</div>
			)

		},
		{
			title: "Email",
			dataIndex: "email",
			width: 300,
			render: (v, row) => (
				<div className=" flex a-center" >
					<h4 >{v}</h4>
				</div>
			)
		},
		{
			title: "Phone No.",
			dataIndex: "mobile_no",
			width: 150,
			render: (v, row) => (
				<div className=" flex a-center" >
					<h4 >{v}</h4>
				</div>
			)
		},
		// {
		// 	title: "Cart Items",
		// 	render: (v, row) => <Button type="primary" size='small'    onClick={() => { cartModalRef.current.openForm({ _id: row._id, name: row.name }) }} >View Cart</Button>

		// },
		{
			title: 'Address',
			dataIndex: '_id',
			width: 100,
			render: (v, row) => <Button type="primary" size='small' onClick={() => { addressModalRef.current.openForm({ _id: row._id, name: row.name }) }} >Address</Button>
		},

		{
			title: 'Verified',
			dataIndex: 'isNumber_verified',
			width: 100,
			render: isActive => {
				if (isActive) {
					return <Tag className="custom-tag" color="#87d068">
						Yes
					</Tag>
				} else {
					return <Tag  className="custom-tag"  color="#f50">
						No
					</Tag>

				}
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			width: 150,
			render: (isActive, row) => (
				<Select
					value={isActive ? 'Active' : 'Inactive'}
					onChange={(value) => handleStatusChange(value, row)} // API call on change
					style={{ width: 100 }}
				>
					<Select.Option value={true}>Active</Select.Option>
					<Select.Option value={false}>Inactive</Select.Option>
				</Select>
			),
		},
		{
			title: "Action",
			dataIndex: "_id",
			width: 70,
			hidden:
				!ar.addAccess && !ar.editAccess && !ar.deleteAccess && !ar.viewAccess,
			render: (v, row) => {
				return (
					<>
						{ar.deleteAccess ? (
							<Popconfirm
								title="Are you sure to delete this User?"
								onConfirm={() => {
									deleteData(row._id);
								}}
								okText="Yes"
								cancelText="No"
							>
								<Button
									type="primary"
									size="small"
									danger
									icon={<DeleteOutlined />}
								/>
								&nbsp;
							</Popconfirm>
						) : null}

						{/* {ar.editAccess ? (
							<Button
								type="primary"
								size="small"
								icon={<EditOutlined />}
								onClick={() => {
									addNewModalRef.current.openForm(row);
								}}
							/>
						) : null} */}
						{/* {!ar.editAccess && ar.viewAccess ? (
							<Button
								type="primary"
								size="small"
								icon={<EyeOutlined />}
								onClick={() => {
									addNewModalRef.current.openForm(row);
								}}
							/>
						) : null} */}
					</>
				);
			},
		},
	].filter((item) => !item.hidden);



const handleStatusChange = (value ,  row) =>{
	setLoading(true);
	serviceUser
			.save({...row , status: value})
			.then((res) => {
				message.success(res.message);
				list();
			})
			.catch((err) => {
				message.error(err.message);
			})
			.finally(() => {
				setLoading(false);
			});

}


	function list() {
		if (ar.viewAccess) {
			setLoading(true);
			serviceUser
				.list(qData)
				.then((res) => {
					setData(res.data?.map((v) => ({ ...v, key: v._id })));
					setQData({
						...qData,
						limit: res.extra.limit,
						page: res.extra.page,
						total: res.extra.total,
					});
				})
				.catch((err) => { })
				.finally(() => {
					setLoading(false);
				});
		}
	}
	console.log(data,"data")

	const deleteData = (id) => {
		serviceUser
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
	tableColumns[tableColumns.length - 1].fixed = "right";

	const tableProps = {
		loading,
		size: "small",
		title: () => <Search {...{ addNewModalRef, deleteData, qData, setQData, list, ar }} />,
		showHeader: true,
		footer: () => <Pagination {...{ qData, setQData }} />,
		tableLayout: undefined,
	};

	useEffect(() => {
		list();
	}, [qData.page, qData.limit]);

	return (
		<>
			<Row align="middle" gutter={[16, 0]} className="mb10 flex j-center a-center">
				<Col flex="auto">
					<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
						<span
							className="back_arrow c-pointer"
							onClick={() => navigate(-1)}
						>
							<FaLongArrowAltLeft size={20} style={{ color: "white" }} />
						</span>
						<Typography.Title className="m-0" style={{ fontWeight: 700 }} level={4}>List Of Users</Typography.Title>
					</div>

				</Col>
				{/* <Col>
					<Button type="primary" icon={<PlusOutlined />} onClick={() => { addNewModalRef.current.openForm(); }}>Add New</Button>
				</Col> */}
			</Row>
			<Card
				size="small"
				style={{ marginTop: '15px' }}
				className="shadow_1 br-10"

			>
				{/* <Table
					{...tableProps}
					pagination={{ position: ["none"], pageSize: qData.limit }}
					columns={tableColumns}
					dataSource={data.length ? data : []}
					scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
				/> */}

				<Table
					pagination={{ position: ["bottom"], pageSize: qData.limit }}

					columns={tableColumns}
					dataSource={data.length ? data : []}
					className="ant-border-space"
					scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}

				/>


				<AddForm ref={addNewModalRef} {...{ list, ar }} />
				<AddressModal ref={addressModalRef} />
				{/* <CartModal ref={cartModalRef} /> */}
			</Card>
		</>
	);
}

function Search({ qData, setQData, list }) {
	return (
		<Form onSubmitCapture={list}>
			<Row gutter={[12, 12]}>
				<Col span={6}>
					<Input
						placeholder="Search by name, email and number"
						value={qData.key}
						onChange={(e) => setQData({ ...qData, key: e.target.value })}
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

	const handleChange = (value) => {
		if (ar.addAccess || ar.editAccess) {
			setData({ ...data, ...value });
		}
	};

	useImperativeHandle(ref, () => ({
		openForm(dt) {
			setOpen(true);
			setData(dt ? { ...dt } : { status: true });
		},
	}));

	const save = () => {
		setAjxRequesting(true);
		serviceUser
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

	return (
		<>
			<Modal
				title={(!data?._id ? "Add" : "Edit") + " User"}
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
								<Form.Item label="Phone Number" required>
									<Input placeholder="8299XXXXXX" value={data?.phone} onChange={(e) => { handleChange({ phone: e.target.value }); }} />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item label="Email" required>
									<Input placeholder="test@arramton.com" value={data?.email} onChange={(e) => { handleChange({ email: e.target.value }); }} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label="Date of Birth">
									<DatePicker value={data?.dob && dayjs(moment(data.dob).format("YYYY-MM-DD"))}
										format='DD MMM YYYY'
										onChange={(e) => { handleChange({ dob: new Date(e) }) }} style={{ width: '100%' }} />
								</Form.Item>
							</Col>
							
							<Col span={24}>
								<Form.Item label="Login Status" required>
									<Select value={data?.status} placeholder="Choose" onChange={e => { handleChange({ status: e }) }} >
										<Select.Option value={true}>Active</Select.Option>
										<Select.Option value={false}>Inactive</Select.Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item label="Profile Image">
									<UploadImage
										value={data?.avatar ? [data?.avatar] : []}
										onChange={(v) => {
											setData({ ...data, avatar: v?.[0] });
										}}
										listType="picture"
										uploadButton={<Button icon={<UploadOutlined />} style={{ width: "100%" }} >Upload Profile Photo</Button>}
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

const AddressModal = forwardRef((props, ref) => {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState({});

	useImperativeHandle(ref, () => ({
		openForm(dt) {
			setOpen(true);
			setData(dt ? { ...dt } : { status: true });
		}
	}));

	return (
		<>
			<Modal
				title={<>Addresses of <Typography.Text type="danger">{data?.name}</Typography.Text></>}
				style={{ top: 20 }}
				open={open}
				onCancel={() => { setOpen(false); }}
				destroyOnClose
				maskClosable={false}
				width={1600}
				className="app-modal-body-overflow"
				footer={[
					<Button key="cancel" onClick={() => { setOpen(false); }}>Cancel</Button>,
				]}
			>
				<Address userId={data._id} />
			</Modal>
		</>
	);
});


