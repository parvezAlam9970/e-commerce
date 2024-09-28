/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Row, Col, Spin, Card, message, } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import service from "../../../services/setting";
import TinyMce from "../../../utils/TinyMce";

const initDataMap = [
	{
		type: 'aboutus',
		title: 'About Us',
		dataInput: 'input',
		default: 'Please enter data..',
		iseditable: false
	},
	{
		type: 'termcondition',
		title: 'Terms & Condition',
		dataInput: 'input',
		default: 'Please enter data..',
		iseditable: false
	},
	{
		type: 'privacy-policy',
		title: 'Privacy Policy',
		dataInput: 'input',
		default: 'Please enter data..',
		iseditable: false
	}
];

export default function Application() {
	const [data, setData] = useState(initDataMap.map(v => ({ type: v.type })));
	const [dataMap, setDataMap] = useState(initDataMap);
	const [ajxRequesting, setAjxRequesting] = useState(false);

	const list = () => {
		setAjxRequesting(true);
		service.listApplication().then((res) => {
			setData(
				initDataMap?.map(v =>
					res?.data?.find(vv => vv.type === v.type) || { type: v.type, data: v.default }
				)
			)
		}).catch(err => { }).finally(() => {
			setAjxRequesting(false);
		});
	}
	useEffect(() => {
		list();
	}, [])

	const handleSave = (data) => {
		setAjxRequesting(true);
		service.saveApplication(data).then((res) => {
			message.success(res.message);
			setDataMap(dataMap.map((vv, ii) => (data.type !== vv.type ? { ...vv } : { ...vv, iseditable: false })))
			list();
		}).catch(err => {
			if (typeof err.message === 'object') {
				let dt = err.message[Object.keys(err.message)[0]];
				message.error(dt)
			} else {
				message.error(err.message)
			}
		}).finally(() => {
			setAjxRequesting(false);
		});
	}

	return (

		<Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
			<Row gutter={[12, 12]}>
				{
					dataMap?.map((val, i) => (
						<Col span={8} key={i}>
							<Card
								title={val.title}
								size="small"
								extra={
									!val.iseditable ?
										<Button type="primary" size="small" onClick={() => setDataMap(dataMap.map((vv, ii) => (i !== ii ? { ...vv } : { ...vv, iseditable: true })))} > Edit </Button> :
										<Row gutter={6}>
											<Col>
												<Button type="primary" size="small" danger onClick={() => {
													list();
													setDataMap(dataMap.map((vv, ii) => (i !== ii ? { ...vv } : { ...vv, iseditable: false })));
												}}> Cancel </Button>
											</Col>
											<Col>
												<Button type="primary" size="small" onClick={() => {
													handleSave(data?.find((vv, ii) => vv.type === val.type))
												}} > Save </Button>
											</Col>
										</Row>
								}
							>
								<TinyMce
									disable={!val.iseditable}
									value={(data?.find((vv, ii) => vv.type === val.type))?.data}
									onChange={(v) => { data[i].data = v; }}
								/>
							</Card>
						</Col>
					))
				}
			</Row>
		</Spin>
	);
}
