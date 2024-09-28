/* eslint-disable react-hooks/exhaustive-deps */
import {
	Table,
	Button,
	Form,
	Row,
	Col,
	Popconfirm,
	Descriptions,
	Spin,
	Card,
	message,
	Input,
	Divider,
	Space,
	Switch,
	Drawer,
	Tag,
	Select,
} from "antd";
import {
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlusOutlined,
	ArrowLeftOutlined,
} from "@ant-design/icons";
import React, {
	useEffect,
	useState,
	forwardRef,
	useImperativeHandle,
	useRef,
} from "react";
import serviceRight from "../../../services/right";
import serviceRole from "../../../services/role";
import Pagination from "../../components/Pagination";
import util from "../../../utils/util";
import { useNavigate } from "react-router-dom";
import serviceRoleGrp from "../../../services/rightGrp";
import serviceRightGrp from "../../../services/rightGrp";

export default function Role() {
	const [ar, setAr] = useState({
		viewAccess: util.checkRightAccess("super-admin-access-list"),
		addAccess: util.checkRightAccess("super-admin-access-add"),
		editAccess: util.checkRightAccess("super-admin-access-edit"),
		deleteAccess: util.checkRightAccess("super-admin-access-delete"),
	});
	const navigate = useNavigate();

	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState([]);
	const [qData, setQData] = useState({ page: 1, limit: 20 });
	const [rights, setRights] = useState([]);
	const [rightsGrps, setRightsGrps] = useState([]);

	const addNewModalRef = useRef();
	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			width: 300,
		},
		{
			title: "Rights",
			dataIndex: "rightCodeTitles",
			render: (v) => v.map((vv, ii) => <Tag key={ii}>{vv}</Tag>),
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
								title="Are you sure to delete this right?"
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

						{ar.editAccess ? (
							<Button
								type="primary"
								size="small"
								icon={<EditOutlined />}
								onClick={() => {
									addNewModalRef.current.openForm(row);
								}}
							/>
						) : null}
						{!ar.editAccess && ar.viewAccess ? (
							<Button
								type="primary"
								size="small"
								icon={<EyeOutlined />}
								onClick={() => {
									addNewModalRef.current.openForm(row);
								}}
							/>
						) : null}
					</>
				);
			},
		},
	].filter((item) => !item.hidden);

	function list() {
		if (ar.viewAccess) {
			setLoading(true);
			serviceRole
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

	const deleteData = (id) => {
		serviceRole
			.delete(id)
			.then((res) => {
				message.success(res.message);
				list();
				setSelected([]);
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
			<Search
				{...{ addNewModalRef, selected, deleteData, qData, setQData, list, ar }}
			/>
		),
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
			serviceRight.list({ isAll: 1 }).then((res) => {
				setRights(res.data || []);
			});
			serviceRightGrp.listWithRights({ isAll: 1 }).then((res) => {
				setRightsGrps(res.data);
			});
		}
	}, [qData.page, qData.limit]);

	return (
		<>
			<Card
				bordered={false}
				size="small"
				title={
					<>
						<Space>
							<Button
								type="dashed"
								danger
								icon={<ArrowLeftOutlined />}
								onClick={() => navigate(-1)}
							>
								Back
							</Button>
							List of Roles
						</Space>
					</>
				}
				extra={
					<>
						<Row justify="end" gutter={12}>
							<Col>
								{selected.length && ar.deleteAccess ? (
									<Popconfirm
										title="Are you sure to delete these selected images?"
										onConfirm={() => {
											deleteData(selected);
										}}
										okText="Yes"
										cancelText="No"
									>
										<Button
											type="primary"
											danger
											style={{ float: "right" }}
											icon={<DeleteOutlined />}
										>
											Delete Selected
										</Button>
									</Popconfirm>
								) : null}
							</Col>
							<Col>
								{ar.addAccess ? (
									<Button
										type="primary"
										icon={<PlusOutlined />}
										onClick={() => {
											addNewModalRef.current.openForm();
										}}
									>
										Add New
									</Button>
								) : null}
							</Col>
						</Row>
					</>
				}
			>
				<Table
					{...tableProps}
					pagination={{ position: ["none"], pageSize: qData.limit }}
					columns={tableColumns}
					dataSource={data.length ? data : []}
					scroll={{ y: "calc(100vh - 340px)", x: "calc(100vw - 387px)" }}
				/>
				<AddForm ref={addNewModalRef} {...{ list, rights, ar, rightsGrps }} />
			</Card>
		</>
	);
}

function Search({ qData, setQData, list }) {
	return (
		<Form onSubmitCapture={list}>
			<Row gutter={12}>
				<Col span={6}>
					<Input
						placeholder="Search by name or code"
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
	const { list, rights, ar, rightsGrps } = props;
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
			setData(dt ? { rightCodes: [], ...dt } : { rightCodes: [] });
		},
	}));

	const save = () => {
		setAjxRequesting(true);
		serviceRole
			.save(data)
			.then((res) => {
				message.success(res.message);
				setOpen(false);
				list();
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

	return (
		<>
			<Drawer
				title={data._id ? "Edit role" : "Create a new role"}
				width={1000}
				onClose={() => {
					setOpen(false);
				}}
				open={open}
				bodyStyle={{
					paddingBottom: 80,
				}}
				extra={
					<Space>
						<Button
							onClick={() => {
								setOpen(false);
							}}
						>
							Cancel
						</Button>
						<Button onClick={save} type="primary" disabled={ajxRequesting}>
							Save
						</Button>
					</Space>
				}
				destroyOnClose
			>
				<Spin spinning={ajxRequesting}>
					<Form layout="vertical" onSubmitCapture={save}>
						<Row gutter={16}>
							<Col span={24}>
								<Form.Item label="Name" required>
									<Input
										placeholder1="Accountant"
										value={data.name || ""}
										onChange={(e) => {
											handleChange({ name: e.target.value });
										}}
									/>
								</Form.Item>
							</Col>
							<Col span={24}>
								<Divider />
							</Col>
							<Col span={24}>
								{rightsGrps.map((v, i) => (
									<>
										<p style={{ fontSize: "20px", fontWeight: "semibold" }}>
											{v.rightGrp}
										</p>
										{v.rights?.map((vv, i) => (
											<Card
												bordered={true}
												size="small"
												style={{ display: "flex" }}
												title={
													<>
														<p key={i} style={{ width: "minContent" }}>
															{vv.name}
															<Switch
																checkedChildren={"Yes"}
																unCheckedChildren={"No"}
																checked={data.rightCodes?.includes(vv.code)}
																onChange={(checked) => {
																	handleChange({
																		rightCodes: checked
																			? [
																				...new Set([
																					...data.rightCodes,
																					vv.code,
																				]),
																			]
																			: [
																				...new Set(
																					data.rightCodes.filter(
																						(right) => right !== vv.code
																					)
																				),
																			],
																	});
																}}
															/>
														</p>
													</>
												}
											/>
										))}
									</>
								))}
							</Col>
						</Row>
					</Form>
				</Spin>
			</Drawer>
		</>
	);
});
