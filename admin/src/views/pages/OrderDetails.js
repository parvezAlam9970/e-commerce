/* eslint-disable react-hooks/exhaustive-deps */
import { Table, Button, Form, Input, Row, Col, Popconfirm, Modal, Spin, message} from "antd";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from "react";
import service from "../../services/orderDetail";
import Pagination from "../components/Pagination";

export default function OrderDetails({ type, orderId = null }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [qData, setQData] = useState({ page: 1, limit: 20, type, orderId });
    const addNewModalRef = useRef();

    const columns = [
        {
            title: "Cat Id",
            dataIndex: "productVariantDetails",
            width: 250,
            render: (_) => _?.catId
        },
        {
            title: "Product Name",
            dataIndex: "productDetails",
            width: 250,
            render: (_) => {
                return <span>{_?.name}</span>;
            },
        },
        {
            title: "Price",
            dataIndex: "productVariantDetails",
            width: 140,
            render: (_) => {
                return <span>₹{_?.price}</span>;
            },
        },
        {
            title: "With Discount Price",
            dataIndex: "productVariantDetails",
            width: 140,
            render: (_) => {
                return <span>₹{_?.withDiscountPrice || _?.price}</span>;
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

    const deleteData = (id) => {
        service
            .orderDetailDelete(id)
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
                {...{ addNewModalRef, selected, deleteData, qData, setQData, list }}
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
    }, [qData.page, qData.limit]);
    return (
        <>
            <Table
                {...tableProps}
                pagination={{ position: ["none"], pageSize: qData.limit }}
                columns={tableColumns}
                dataSource={data.length ? data : []}
            />
            <AddForm ref={addNewModalRef} {...{ list, type, orderId }} />
        </>
    );
}

function Search({
    addNewModalRef,
    selected,
    deleteData,
    qData,
    setQData,
    list,
}) {
    return (
        <Form onSubmitCapture={list} className="search-form">
            <Row gutter={[12, 2]}>
                <Col span={3}>
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Button type="primary" htmlType="submit">
                            Reload
                        </Button>
                    </Form.Item>
                </Col>
                <Col span={5}>
                    {selected.length ? (
                        <Popconfirm
                            title="Are you sure to delete these selected product attributes ?"
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
            </Row>
        </Form>
    );
}

const AddForm = forwardRef((props, ref) => {
    const { list, orderId } = props;
    const [open, setOpen] = useState(false);
    const [data, setData] = useState({ aspect: 1 });
    const [ajxRequesting, setAjxRequesting] = useState(false);
    const [ln, setLn] = useState("en");
    const [changeForm, setChangeForm] = useState(false);

    const handleChange = (value) => {
        if (changeForm) {
            Object.entries(value).forEach((ent) => {
                let varDt = data;
                const k = ent[0];
                const v = ent[1];
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
            });
            setData({ ...data });
        }
    };

    useImperativeHandle(ref, () => ({
        openForm(dt) {
            setOpen(true);
            setData(dt ? { _id: dt } : { orderId });
            setChangeForm(true);
        },
    }));

    const getDetails = () => {
        setAjxRequesting(true);
        service
            .orderDetailDetails(data._id)
            .then((res) => {
                setData(res.data || {});
            })
            .catch((err) => {
                message.error(err.message);
            })
            .finally(() => {
                setAjxRequesting(false);
            });
    };

    const save = () => {
        if (changeForm) {
            setAjxRequesting(true);
            service
                .orderDetailSave(data, { ln })
                .then((res) => {
                    message.success(res.message);
                    handleChange({ ...res.data });
                    if (ln === "en") {
                        list();
                    }
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
        }
    };

    useEffect(() => {
        if (data._id) {
            getDetails();
        }
    }, [ln, data._id]);

    useEffect(() => {
        if (!open) {
            setData({ _id: null });
        } else {
            setLn("en");
        }
    }, [open]);

    return (
        <>
            <Modal
                title={(!data._id ? "Add" : "Edit") + " Order"}
                style={{ top: 20 }}
                open={open}
                okText="Save"
                onOk={save}
                okButtonProps={{ disabled: ajxRequesting }}
                onCancel={() => {
                    setOpen(false);
                }}
                maskClosable={false}
                width={900}
                className="app-modal-body-overflow"
                footer={[
                    <Button
                        key="cancel"
                        onClick={() => {
                            setOpen(false);
                        }}
                    >
                        Cancel
                    </Button>,
                    changeForm ? (
                        <Button key="save" type="primary" onClick={save}>
                            Save
                        </Button>
                    ) : null,
                ]}
            >
                <Spin
                    spinning={ajxRequesting}
                    indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                >
                    <Form layout="vertical" disabled={!changeForm}>
                        <Row gutter={[12, 2]}>
                            <Col span={12}>
                                <Form.Item label="Product Id" required>
                                    <Input placeholder="Value" value={data?._id} disabled />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Product Name" required>
                                    <Input
                                        placeholder="Value"
                                        value={data?.productId?.name}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Price" required>
                                    <Input
                                        type="number"
                                        placeholder="Price"
                                        value={data.price}
                                        onChange={(e) => {
                                            handleChange({ price: e.target.value });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Heart Shape Cost" required>
                                    <Input
                                        type="number"
                                        placeholder="Heart Shape Cost"
                                        value={data.heartShapeCost}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Quantity" required>
                                    <Input
                                        type="number"
                                        placeholder="Quantity"
                                        value={data.quantity}
                                        onChange={(e) => {
                                            handleChange({ quantity: e.target.value });
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Total " required>
                                    <Input
                                        type="number"
                                        placeholder="Total"
                                        value={data.total}
                                        onChange={(e) => {
                                            handleChange({ total: e.target.value });
                                        }}
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