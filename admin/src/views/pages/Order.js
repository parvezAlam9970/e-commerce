/* eslint-disable react-hooks/exhaustive-deps */
import {
	DownloadOutlined,
	LoadingOutlined,
	UserOutlined
} from "@ant-design/icons";
import {
	Button,
	Col,
	Descriptions,
	Divider,
	Form,
	Image,
	Input,
	Modal,
	Row,
	Select,
	Space,
	Spin,
	Table,
	Tag,
	Typography,
	message
} from "antd";
import moment from "moment";
import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { useNavigate } from 'react-router-dom';
// import serviceDelivery from "../../services/deliveryBoy";
import service from "../../services/order";
import UserService from "../../services/userlist";
import Pagination from "../components/Pagination";
// import wow from "./Group 10900.png"

export default function Order() {
	const [data, setData] = useState([]);
	const [user, setUser] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate()
	const [qData, setQData] = useState({
		page: 1,
		limit: 20,
		status: "Confirmed",
	});
	const deliveryModalRef = useRef();

	const columns = [
		{
			title: "Order id",
			dataIndex: "orderId",
			width: 100,
		},
		// {
		//   title: "Photos",
		//   dataIndex: "ProductDetails",
		//   // width: 200,
		//   render: v=> <Space>{v?.map((vv, ii) => <Image key={ii} style={{height: 50}} src={vv?.imgs?.[0]?.url} />)}</Space> 
		// },
		{/*{
      title: "Delivery Assign To",
      dataIndex: "deliveryBoyData",
      width: 140,
      render: (v) => <span>{v[0]?.name}</span>,
    }*/},
		{
			title: "Shipping Address",
			dataIndex: "addressDetails",
			width: 400,
			render: (_) => {
				const data = JSON.parse(_);
				return data !== null ? (
					<span>
						{data?.landMark +
							" " +
							data?.address +
							" " +
							data?.city +
							" " +
							data?.pin}
					</span>
				) : (
					<span>Not Mentioned</span>
				);
			},
		},
		{
			title: "Total Amount",
			dataIndex: "priceDetails",
			width: 120,
			render: (_) => {
				return <span>₹{_.finalPrice}</span>;
			},
		},

		{
			title: "OrderedAt",
			dataIndex: "createdAt",
			width: 220,
			render: (v) => {
				return moment(v).format("dddd, MMMM Do YYYY");
			},
		},
		{
			title: "Status",
			dataIndex: "status",
			width: 100,
			render: (_, { status }) => {
				return <Tag color="green">{status}</Tag>;
			},
		},
		{
			title: "Action",
			dataIndex: "_id",
			width: 70,
			render: (v, row) => {
				return (
					<>
						<Button
							type="primary"
							size="small"
							icon={<UserOutlined />}
							onClick={() => {
								deliveryModalRef.current.openForm(row);
							}}
						/>
					</>
				);
			},
		},
		{
			title: "Invoice",
			dataIndex: "_id",
			width: 70,
			render: (v, row) => {
				return (
					<>
						<Button
							onClick={() => navigate(`/preview/${v}`)}
							type="primary"
							size="small"
							icon={<DownloadOutlined />}
						/>
					</>
				);
			},
		},
	].filter((item) => !item.hidden);

	function list() {
		setLoading(true);
		service
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

	function listUser() {
		UserService.list()
			.then((res) => {
				setUser(res.data || []);
			})
			.catch((err) => {
				message.error("User data not loaded");
			});
	}
	const deleteData = (id) => {
		service
			.delete(id)
			.then((res) => {
				message.error(res.message);
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
		bordered: true,
		loading,
		size: "small",
		title: () => (
			<Search {...{ deliveryModalRef, deleteData, qData, setQData, list, user }} />
		),

		showHeader: true,
		footer: () => <Pagination {...{ qData, setQData }} />,
		tableLayout: undefined,
	};

	useEffect(() => {
		list();
		listUser();
	}, [qData.page, qData.limit]);
	return (
		<>
			<Typography.Title level={5}>List of Orders</Typography.Title>

			<Table
				{...tableProps}
				pagination={{ position: ["none"], pageSize: qData.limit }}
				columns={tableColumns}
				dataSource={data.length ? data : []}
				scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
				expandable={{
					expandedRowRender: (record) => (
						<>
							<Typography.Text strong>Receivers Info</Typography.Text>
							<Divider />
							<Row gutter={[50]}>
								<Col span={6}>
									<Image src="./image/Group-0900.png" width={200}></Image>
								</Col>



								<Col span={6} style={{ borderBottom: "1px solid #d4d1d6", borderRight: "1px solid #d4d1d6" }}>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ fontWeight: 500, paddingBottom: "15px", fontSize: "17px" }} >
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="User Name">
											{record?.userDetails
												? record?.userDetails.name
												: "Not Accepted"}
										</Descriptions.Item>
									</Descriptions>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ paddingBottom: "15px", fontSize: "17px" }} style={{ display: "block" }}>
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Email">
											{record?.userDetails ? record?.userDetails.email : "Empty"}
										</Descriptions.Item>
									</Descriptions>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ paddingBottom: "15px", fontSize: "17px" }} style={{ display: "block" }}>
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Phone">
											{record?.userDetails ? record?.userDetails.phone : "Empty"}
										</Descriptions.Item>
									</Descriptions>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ paddingBottom: "15px", fontSize: "17px" }} style={{ display: "block" }}>
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Gender">
											{record?.userDetails ? record?.userDetails.gender : "Empty"}
										</Descriptions.Item>
									</Descriptions>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ paddingBottom: "15px", fontSize: "17px" }} style={{ display: "block" }}>
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Payment Method">
											{record?.paymentMethod ? <Tag color="blue">{record?.paymentMethod}</Tag> : "Empty"}
										</Descriptions.Item>
									</Descriptions>
								</Col>
								<Col span={6} style={{ borderBottom: "1px solid #d4d1d6", borderRight: "1px solid #d4d1d6" }}>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ fontWeight: 500, paddingBottom: "15px", fontSize: "17px" }} >
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Name">
											{record?.addressDetails !== null ? (
												<span>
													{
														JSON.parse(record?.addressDetails)?.name
													}
												</span>
											) : (
												<span>Not Mentioned</span>
											)}
										</Descriptions.Item>
									</Descriptions>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ fontWeight: 500, paddingBottom: "15px", fontSize: "17px" }}>
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Phone">
											{record?.addressDetails !== null ? (
												<span>
													{
														JSON.parse(record?.addressDetails)?.phone
													}
												</span>
											) : (
												<span>Not Mentioned</span>
											)}
										</Descriptions.Item>
									</Descriptions>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ fontWeight: 500, paddingBottom: "15px", fontSize: "17px" }} >
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Address">
											{record?.addressDetails !== null ? (
												<span>
													{
														JSON.parse(record?.addressDetails)?.address
													}
												</span>
											) : (
												<span>Not Mentioned</span>
											)}
										</Descriptions.Item>
									</Descriptions>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ paddingBottom: "15px", fontSize: "17px" }} style={{ display: "block" }}>
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="City">
											{record?.addressDetails !== null ? (
												<span>
													{JSON.parse(record?.addressDetails)?.city}
												</span>
											) : (
												<span>Not Mentioned</span>
											)}
										</Descriptions.Item>
									</Descriptions>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ paddingBottom: "15px", fontSize: "17px" }} style={{ display: "block" }}>
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Address Type">
											{record?.addressDetails !== null ? (
												<span>
													{JSON.parse(record?.addressDetails)?.type}
												</span>
											) : (
												<span>Not Mentioned</span>
											)}
										</Descriptions.Item>
									</Descriptions>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ paddingBottom: "15px", fontSize: "17px" }} style={{ display: "block" }}>
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Gender">
											{record?.userDetails ? record?.userDetails.gender : "Empty"}
										</Descriptions.Item>
									</Descriptions>
								</Col>
								<Col span={6} style={{ borderBottom: "1px solid #d4d1d6", borderRight: "1px solid #d4d1d6" }}>

									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ paddingBottom: "15px", fontSize: "17px" }} >
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Lankmark">
											{record?.addressDetails !== null ? (
												<span>
													{JSON.parse(record?.addressDetails)?.landMark}
												</span>
											) : (
												<span>Not Mentioned</span>
											)}
										</Descriptions.Item>
									</Descriptions>

									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ paddingBottom: "15px", fontSize: "17px" }} >
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="PinCode">
											{record?.addressDetails !== null ? (
												<span>
													{JSON.parse(record?.addressDetails)?.pin}
												</span>
											) : (
												<span>Not Mentioned</span>
											)}
										</Descriptions.Item>
									</Descriptions>
								</Col>

							</Row>

							<Row gutter={[50]} style={{ paddingTop: "20px" }}>
								<Col span={6}>
								</Col>
								<Col span={6}>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ fontWeight: 500, paddingBottom: "15px", fontSize: "17px" }} >
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Delivery Date">
											<b>
												{record?.deliveryDate
													? moment(record?.deliveryDate).format("dddd, MMMM Do YYYY")
													: "Not Accepted"}
											</b>
										</Descriptions.Item>
									</Descriptions>
								</Col>
								<Col span={6}>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ fontWeight: 500, paddingBottom: "15px", fontSize: "17px" }} >
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Delivery Time">
											<b>
												{record?.deliveryDetails?.timings?.find(v => (v._id === record.deliveryTimeId))?.startTime}
												-
												{record?.deliveryDetails?.timings?.find(v => (v._id === record.deliveryTimeId))?.endTime}
											</b>
										</Descriptions.Item>
									</Descriptions>
								</Col>
								<Col span={6}>
									<Descriptions labelStyle={{ color: "gray" }} contentStyle={{ fontWeight: 500, paddingBottom: "15px", fontSize: "17px" }} >
										<Descriptions.Item style={{ paddingBottom: "0px" }} label="Remark">
											{record?.remark
												? record?.remark
												: ""}
										</Descriptions.Item>
									</Descriptions>
								</Col>
							</Row>

							<Descriptions title="Ordered Items"></Descriptions>
							<Table
								// width={300}
								bordered

								pagination={false}
								size="small"
								dataSource={[...record?.orders]}
								columns={[

									{
										dataIndex: "orders",
										title: "Item No.",
										render: (v, y, i) => {
											return <div>
												{i + 1}
											</div>
										}
									},
									{
										dataIndex: "orders",
										title: "Product Image",
										render: (v, y, i) => {
											return <div>
												<Image src={record?.colorDetails[i]?.thumbnailPicture} width={40} height={60} preview={true} />
											</div>
										}
									},
									{
										dataIndex: "orders",
										title: " Product Name",
										render: (v, y, i) => {
											return <div>
												{record?.ProductDetails[i]?.name}
											</div>
										}
									},
									{
										dataIndex: "orders",
										title: "Color",
										render: (v, y, i) => {
											return <div style={{ display: "flex", gap: "10px" }}>
												{record?.colorDetails[i]?.color}
												<Image src={record?.colorDetails[i]?.shadePicture} width={20} height={20} preview={false} />
											</div>
										}
									},
									{
										dataIndex: "orders",
										title: " Quantity",
										render: (v, y, i) => {
											return <div>
												{y?.quantity}
											</div>
										}
									},
									{
										dataIndex: "orders",
										title: " Price",
										render: (v, y, i) => {
											return <div>
												{y?.price}
											</div>
										}
									},
									// {
									//   dataIndex: "orders",
									//   title: "  Offer/Disc.",
									//   render: (v, y, i) => {
									//     return <div>
									//       <Tag color="red">No</Tag>
									//     </div>
									//   }



									// },
									{
										dataIndex: "orders",
										title: "  Extra",
										render: (v, y, i) => {
											return <div>
												{y?.isHeart === true ? "+100" : "0"}
											</div>
										}


									},
								]}>





							</Table>
							<div
								style={{
									display: "flex",
									flexDirection: "row-reverse",

								}}
							>
								<div >
									<div style={{ padding: "6px", border: "1px solid #d4d1d6" }}>
										<span
											style={{
												margin: "0 5px",
												display: "inline-block",

											}}
										>
											<b> Price</b>
										</span>
										<span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
											{" "}
											₹{record?.priceDetails?.price}{" "}
										</span>
									</div>
									<div style={{ padding: "6px", border: "1px solid #d4d1d6" }}>
										<span
											style={{
												margin: "0 5px",
												display: "inline-block",

											}}
										>
											<b>Discount</b>
										</span>
										<span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
											{" "}
											₹{record?.priceDetails?.discountAmount}{" "}
										</span>
									</div>
									<div style={{ padding: "6px", border: "1px solid #d4d1d6" }}>
										<span
											style={{
												margin: "0 5px",
												display: "inline-block",

											}}
										>
											<b>GST</b>
										</span>
										<span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
											{" "}
											₹{record?.priceDetails?.gst}{" "}
										</span>
									</div>


									<div style={{ padding: "6px", border: "1px solid #d4d1d6" }}>
										<span
											style={{
												margin: "0 5px",
												display: "inline-block",

											}}
										>
											<b>Delivery</b>
										</span>
										<span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
											{" "}
											₹{record?.priceDetails?.delivery}{" "}
										</span>
									</div>

									<div style={{ padding: "6px", border: "1px solid #d4d1d6" }}>
										<span
											style={{
												margin: "0 5px",
												display: "inline-block",

											}}
										>
											<b >Wallet Used</b>
										</span>
										<span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
											{" "}
											₹{record?.priceDetails?.usedWalletBalance}{" "}
										</span>
									</div>
									<div style={{ padding: "6px", border: "1px solid #d4d1d6", background: "black", color: "white" }}>
										<span
											style={{
												margin: "0 5px",
												display: "inline-block",
												width: "70px",
											}}
										>
											<b>Total</b>
										</span>
										<span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
											{" "}
											₹{record?.priceDetails?.finalPrice}{" "}
										</span>
									</div>
								</div>
							</div>
						</>
					),
					rowExpandable: (record) => record.userDetails !== "Not Expandable",
				}}
			/>
			<DeliveryForm
				ref={deliveryModalRef}
				{...{
					list,
				}}
			/>
		</>
	);
}

function Search({ deleteData, qData, setQData, list, user }) {
	const [userNames, setUserNames] = useState([]);

	const onChange = (v, key) => {
		qData[key] = v;
		if (v === undefined || v === "") {
			qData[key] = "";
			list();
		}
	};
	useEffect(() => {
		const Names = user?.map((item) => ({
			label: item.name ? (
				<>
					<p style={{ padding: "0px", margin: "0px" }}>{item.name}</p>
					<p style={{ fontSize: "12px", margin: "0px" }}>
						<Typography.Text type="danger">@{item.phone}</Typography.Text>
					</p>
				</>
			) : (
				item.phone
			),
			value: item._id,
			searchKey: item.name + item.phone,
		}));
		setUserNames(Names);
	}, [user]);

	return (
		<Form onSubmitCapture={list} className="search-form">
			<Row gutter={[12, 2]}>
				<Col span={4}>
					<Form.Item style={{ marginBottom: 0 }}>
						<Input
							placeholder="Search by order id"
							onChange={(e) => onChange(e.target.value, "orderId")}
							allowClear
						/>
					</Form.Item>
				</Col>
				<Col xs={24} xl={4}>
					<Form.Item style={{ marginBottom: 0 }}>
						<Select
							showSearch
							allowClear
							placeholder="Select by username / phone"
							optionFilterProp="children"
							onChange={(e) => onChange(e, "userId")}
							filterOption={(input, option) =>
								(option?.searchKey ?? "")
									.toLowerCase()
									.includes(input.toLowerCase())
							}
							options={userNames}
						/>
					</Form.Item>
				</Col>

				<Col xs={24} xl={4}>
					<Form.Item>
						<Select
							allowClear
							value={qData.status}
							placeholder="Order Status"
							onChange={(e) => onChange(e, "status")}
						>
							<Select.Option value={"Initiated"}>Initiated</Select.Option>
							<Select.Option value={"Confirmed"}>Confirmed</Select.Option>
							<Select.Option value={"Delivered"}>Delivered</Select.Option>
							<Select.Option value={"Failed"}>Failed</Select.Option>
							<Select.Option value={"Pending"}>Pending</Select.Option>
							<Select.Option value={"Shipped"}>Shipped</Select.Option>
						</Select>
					</Form.Item>
				</Col>
				<Col xs={24} xl={4}>
					<Form.Item style={{ marginBottom: 0 }}>
						<Button type="primary" htmlType="submit">
							Search
						</Button>
					</Form.Item>
				</Col>
				<Col span={3}></Col>
			</Row>
		</Form>
	);
}

const DeliveryForm = forwardRef((props, ref) => {
	const { list, categoryId } = props;

	const [open, setOpen] = useState(false);
	const [data, setData] = useState({ aspect: 1 });
	const [ajxRequesting, setAjxRequesting] = useState(false);
	const [thumbFile, setThumbFile] = useState([]);
	const [file, setFile] = useState([]);
	const [deliveryBoys, setDeliveryBoys] = useState([]);

	const handleChange = (v, k) => {
		let varDt = data;
		let keys = k.split(".");
		for (let i = 0; i < keys.length; i++) {
			if (i + 1 === keys.length) {
				varDt[keys[i]] = v;
			} else {
				if (typeof varDt[keys[i]] === "undefined") {
					if (parseInt(keys[i + 1]) * 1 >= 0) {
						varDt[keys[i]] = [];
					} else {
						varDt[keys[i]] = {};
					}
				}
				varDt = varDt[keys[i]];
			}
		}
		setData({ ...data, ...v });
	};

	useImperativeHandle(ref, () => ({
		openForm(dt) {
			setOpen(true);
			setData(
				dt
					? {
						...dt,
						ocassion: [],
						flavour: [],
						recipient: [],
						relation: [],
						specializationIds: [],
					}
					: {
						isPremium: false,
						isBestSelling: false,
						forBirthday: false,
						forAnniversary: false,
						isBestSellingCombos: false,
						variants: [{}],
						ocassion: [],
						flavour: [],
						recipient: [],
						relation: [],
						specializationIds: [],
						categoryIds: [categoryId],
					}
			);
		},
	}));

	function listDeliveryBoys() {
		setAjxRequesting(false);
		// serviceDelivery
		//   .list({ status: "active" })
		//   .then((res) => {
		//     setDeliveryBoys(res.data);
		//   })
		//   .catch((err) => { })
		//   .finally(() => {
		//     setAjxRequesting(false);
		//   });
	}
	const save = () => {
		setAjxRequesting(true);
		service
			.save(data)
			.then((res) => {
				message.success(res.message);
				list();
				setOpen(false);
			})
			.catch((err) => {
				if (typeof err.message === "object") {
					let dt = err.message[Object.keys(err.message)[0]];
					message.error(dt);
				} else {
					message.error(err.message);
				}
			})
			.finally(() => {
				setAjxRequesting(false);
			});
	};

	useEffect(() => {
		listDeliveryBoys();
	}, [open]);

	return (
		<>
			<Modal
				title={(!data._id ? "Add New" : "Edit") + " Delivery Boy"}
				style={{ top: 20 }}
				open={open}
				okText="Save"
				onOk={save}
				okButtonProps={{ disabled: ajxRequesting }}
				onCancel={() => {
					setOpen(false);
				}}
				destroyOnClose
				maskClosable={false}
				width={700}
				height={500}
				className="app-modal-body"
				footer={[
					<Button
						key="cancel"
						onClick={() => {
							setOpen(false);
						}}
					>
						Cancel
					</Button>,
					<Button key="save" type="primary" onClick={save}>
						Save
					</Button>,
				]}
			>
				<Spin
					spinning={ajxRequesting}
					indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
				>
					<Form layout="vertical">
						<Col span={12}>
							<Form.Item label="Delivery Assigned To" required>
								<Select
									mode="single"
									value={data.deliveryBoyId}
									onChange={(e) => {
										setData({ ...data, deliveryBoyId: e })
									}}
									options={deliveryBoys?.map((v) => ({
										value: v._id,
										label: v.name,
									}))}
								></Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label="Status" required>
								<Select
									mode="single"
									value={data.status}
									onChange={(e) => {
										setData({ ...data, status: e })
									}}
								>
									<Select.Option value={"Confirmed"}>Confirmed</Select.Option>
									<Select.Option value={"Shipped"}>Shipped</Select.Option>
									<Select.Option value={"Delivered"}>Delivered</Select.Option>
								</Select>
							</Form.Item>
						</Col>
					</Form>
				</Spin>
			</Modal>
		</>
	);
});








// <Table
//   // width={300}
//   bordered
//   style={{ width: '100%' }}
//   pagination={false}
//   size="small"
//   dataSource={[record]}
//   columns={[

//     {
//       dataIndex: "orders",
//       width: 1400,
//       render: (v, index) => (
//         <>
//           <div style={{ background: "black", color: "white", display: "flex", justifyContent: "space-between", paddingBottom: "10px", paddingTop: "10px" }}>
//             <span style={{ width: "10%", paddingLeft: "5px" }} >Item No.</span>
//             <span style={{ width: "10%" }}>
//               Product Name
//             </span>
//             <span style={{ width: "10%" }}>
//               Variant Name
//             </span>
//             <span style={{ width: "10%" }}>Quantity</span>
//             <span style={{ width: "10%" }}>Price</span>
//             <span style={{ width: "10%" }}>
//               Offer/Disc.
//             </span>
//             <span style={{ width: "10%" }}>
//               Cake Message
//             </span>
//             <span style={{ width: "10%" }}>
//               Heart Shape
//             </span>
//             <span style={{ width: "10%" }}>
//               Extra
//             </span>
//             <span style={{ width: "10%" }}>
//               Cake Photo
//             </span>
//           </div>
//           {v?.map((vv, i) => (
//             <div>
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <span
//                   style={{ width: "10%", paddingLeft: "5px" }}
//                 >
//                   {i + 1}.
//                 </span>
//                 <span
//                   style={{ width: "10%" }}
//                 >
//                   {record?.ProductDetails?.map((prod) => {
//                     return prod?.variants?.map((vari) => {
//                       if (vari?._id === vv?.productVariantId) {
//                         return prod?.name;
//                       }
//                     });
//                   })}
//                 </span>
//                 <span
//                   style={{ width: "10%" }}
//                 >
//                   {record?.ProductDetails?.map((prod) => {
//                     return prod?.variants?.map((vari) => {
//                       if (vari?._id === vv?.productVariantId) {
//                         return (
//                           <Tag color="green">
//                             {vari?.weight}
//                           </Tag>
//                         );
//                       }
//                     });
//                   })}
//                 </span>
//                 <span
//                   style={{ width: "10%" }}
//                 >
//                   {vv?.quantity}
//                 </span>
//                 <span style={{ width: "10%" }} >
//                   ₹{vv?.price}
//                 </span>
//                 <span style={{ width: "10%" }}>
//                   <Tag color="red">No</Tag>
//                 </span>
//                 <span style={{ width: "10%" }}>
//                   <span>{vv?.cakeMessage || "No Message"}</span>
//                 </span>
//                 <span style={{ width: "10%" }} >
//                   <Tag color={vv?.isHeart === true ? "green" : "red"}>{vv?.isHeart === true ? "Yes" : "No"}</Tag>
//                 </span>
//                 <span style={{ width: "10%" }}>
//                   {vv?.isHeart === true ? "+100" : "0"}
//                 </span>
//                 <span style={{ width: "10%" }} >
//                   {vv?.photoURL?.url ? <Image src={vv?.photoURL?.url} height={30} /> : "No Image"}
//                 </span>
//               </div>
//               <hr />
//             </div>
//           ))}
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row-reverse",

//             }}
//           >
//             <div >
//               <div style={{ padding: "6px", border: "1px solid #d4d1d6" }}>
//                 <span
//                   style={{
//                     margin: "0 5px",
//                     display: "inline-block",

//                   }}
//                 >
//                   <b> Price</b>
//                 </span>
//                 <span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
//                   {" "}
//                   ₹{record?.priceDetails?.price}{" "}
//                 </span>
//               </div>
//               <div style={{ padding: "6px", border: "1px solid #d4d1d6" }}>
//                 <span
//                   style={{
//                     margin: "0 5px",
//                     display: "inline-block",

//                   }}
//                 >
//                   <b>Discount</b>
//                 </span>
//                 <span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
//                   {" "}
//                   ₹{record?.priceDetails?.discountAmount}{" "}
//                 </span>
//               </div>
//               <div style={{ padding: "6px", border: "1px solid #d4d1d6" }}>
//                 <span
//                   style={{
//                     margin: "0 5px",
//                     display: "inline-block",

//                   }}
//                 >
//                   <b>GST</b>
//                 </span>
//                 <span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
//                   {" "}
//                   ₹{record?.priceDetails?.gst}{" "}
//                 </span>
//               </div>


//               <div style={{ padding: "6px", border: "1px solid #d4d1d6" }}>
//                 <span
//                   style={{
//                     margin: "0 5px",
//                     display: "inline-block",

//                   }}
//                 >
//                   <b>Delivery</b>
//                 </span>
//                 <span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
//                   {" "}
//                   ₹{record?.priceDetails?.delivery}{" "}
//                 </span>
//               </div>

//               <div style={{ padding: "6px", border: "1px solid #d4d1d6" }}>
//                 <span
//                   style={{
//                     margin: "0 5px",
//                     display: "inline-block",

//                   }}
//                 >
//                   <b >Wallet Used</b>
//                 </span>
//                 <span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
//                   {" "}
//                   ₹{record?.priceDetails?.usedWalletBalance}{" "}
//                 </span>
//               </div>
//               <div style={{ padding: "6px", border: "1px solid #d4d1d6", background: "black", color: "white" }}>
//                 <span
//                   style={{
//                     margin: "0 5px",
//                     display: "inline-block",
//                     width: "70px",
//                   }}
//                 >
//                   <b>Total</b>
//                 </span>
//                 <span style={{ margin: "0 30px", marginRight: "60px", float: "right" }}>
//                   {" "}
//                   ₹{record?.priceDetails?.finalPrice}{" "}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </>
//       ),
//     },
//   ]}
// />
// </div> 