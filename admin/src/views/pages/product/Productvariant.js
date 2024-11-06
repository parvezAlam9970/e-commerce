import { Button, Col, Form, Image, Input, message, Modal, Popconfirm, Row, Select, Spin, Table, Tag } from 'antd';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { DeleteOutlined, EditOutlined, LoadingOutlined, PlusOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';

import Pagination from '../../components/Pagination';
import UploadImage from '../../../utils/UploadImage';
import util from '../../../utils/util';
import axiosInstance from '../../../utils/axios';
import ProductService from '../../../services/product';


const Productvariant = ({productDetails}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qData, setQData] = useState({ page: 1, limit: 20, productId: productDetails._id });
  const addNewModalRef = useRef();

  const columns = [
    {
        title: '#',
        width: 40,
        render: (v, row, i) => <b>{i + 1}</b>
    },
    {
        title: 'Thumbnail Img',
        dataIndex: "thumbImage",
        width: 120,
        render: (v, row) => <Image src={v} style={{ width: "80px" }} />
    },
    // {
    //     title: "Size",
    //     width: 150,
    //     dataIndex: "sizeDetail",
    //     render: (v, row) => v.length + " X " + v.breadth + " " + v.dimension

    // },
    {
        title: "Color",
        width: 80,
        dataIndex: "colourCode",
    },
    {
        title: "Inventory",
        width: 80,
        dataIndex: "inventory",
    },
    {
        title: 'Price',
        dataIndex: 'price',
        width: 80,
        render: v => "₹ " + parseFloat(v)?.toLocaleString('en-IN')
    },
    {
        title: 'Discount Price',
        dataIndex: 'discountPrice',
        width: 100,
        render: v => "₹ " + parseFloat(v)?.toLocaleString('en-IN')
    },
    {
        title: 'Default',
        dataIndex: 'isDefault',
        width: 50,
        render: isDefault => isDefault ? <Tag color='green'>Yes</Tag> : <Tag color='red'>No</Tag>
    },
    {
        title: 'Action',
        dataIndex: '_id',
        width: 70,
        render: (v, row) => {
            return <>
                <Popconfirm
                    title="Are you sure to delete this data?"
                    // onConfirm={() => { deleteData(row._id); }}
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

const tableColumns = columns.map((item) => ({ ...item, ellipsis: false }));

tableColumns[0].fixed = true;
tableColumns[tableColumns.length - 1].fixed = 'right';

const tableProps = {
  bordered: true,
  loading,
  size: 'small',
  title: () => <Search {...{ addNewModalRef, qData, setQData,  }} />,
  showHeader: true,
  footer: () => <Pagination {...{ qData, setQData }} />,
  tableLayout: undefined,
};


const list = async () => {
    setLoading(true);
    try {
        const response = await ProductService.vatiantList(qData) ;
        setData(response.data);
        setLoading(false);
    } catch (error) {
        console.error(error);
        setLoading(false);
    }
}
useEffect(()=>{


    list()
} , [])

console.log(data)


  return (
    <>
       <Table
                {...tableProps}
                pagination={{ position: ['none'], pageSize: qData.limit }}
                columns={tableColumns}
                dataSource={data.length ? data : []}
            // scroll={{ y: 'calc(100vh - 340px)', x: 'calc(100vw - 387px)' }}
            />
                        <AddForm ref={addNewModalRef} {...{ list, productDetails }} />

    </>
  )
}

export default Productvariant



function Search({ addNewModalRef, qData, setQData, }) {

  return (
      <Form onSubmitCapture={[]} className="search-form">
          <Row gutter={[12, 2]}>
              <Col span={18}>
                  <Row gutter={[12, 2]}>
                      <Col span={16}>
                          <Form.Item style={{ marginBottom: 0 }}>
                              <Input placeholder="Search by Color | Code" defaultValue={qData.key} onChange={e => (setQData({ ...qData, key: e.target.value }))} allowClear />
                          </Form.Item>
                      </Col>
                      <Col span={3}>
                          <Form.Item style={{ marginBottom: 0 }}>
                              <Button type="primary" htmlType="submit">Search</Button>
                          </Form.Item>
                      </Col>
                  </Row>
              </Col>
              <Col span={6}>
                  <Form.Item style={{ marginBottom: 0, float: 'right' }}>
                      <Button type="primary" icon={<PlusOutlined />} onClick={() => { addNewModalRef.current.openForm() }}>Add New</Button>
                  </Form.Item>
              </Col>
          </Row>
      </Form>
  );
};


const AddForm = forwardRef((props, ref) => {
  const { list, productDetails, color, size } = props;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [ajxRequesting, setAjxRequesting] = useState(false);


  const handleChange = (value) => {
      Object.entries(value).forEach(ent => {
          let varDt = data;
          const k = ent[0];
          const v = ent[1];
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
      });
      setData({ ...data });
  }

  useImperativeHandle(ref, () => ({
      openForm(dt) {
          setOpen(true);
          setData(dt
              ? {
                  ...dt, productId: productDetails._id
              }
              : { status: true, productId: productDetails._id, isDefault: false }
          );
      }
  }));


  const save = () => {
      setAjxRequesting(true);
      ProductService.vatiantSave({ ...data }).then((res) => {
          message.success(res.message);
          setData({ ...res.data })
          list();
          setOpen(false);
      }
      ).catch(err => {
          message.error(err.message);
      }).finally(() => {
          setAjxRequesting(false);
      });
  }

  return (
      <>
          <Modal
              title={(!data._id ? 'Create a New' : 'Edit') + ' Varient'}
              style={{ top: 20 }}
              open={open}
              okText="Save"
              onOk={save}
              okButtonProps={{ disabled: ajxRequesting }}
              onCancel={() => { setOpen(false); }}
              destroyOnClose
              maskClosable={false}
              width={1200}
              footer={[
                  <Button key="cancel" onClick={() => { setOpen(false); }}>Cancel</Button>,
                  <Button key="save" type="primary" onClick={save}>save</Button>,
              ]}
          >
              <Spin spinning={ajxRequesting} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}>
                  <Form layout="vertical">
                      <Row gutter={[12, 2]}>
                         <Col span={6}>
                              <Form.Item label="Choose Color" required>
                                  <Select value={data.colourCode} onChange={v => { handleChange({ colourCode: v }) }}
                                      filterOption={(input, option) => {
                                          return (
                                              option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                          );
                                      }}
                                      options={
                                        ColorOptions?.map(v => (
                                              {
                                                  value: v.value,
                                                  label: v.label,
                                              }
                                          ))
                                      } >
                                  </Select>
                              </Form.Item>
                          </Col>
                         
                         

                          <Col span={6}>
                              <Form.Item label="Price" required>
                                  <Input prefix="₹ " placeholder="xxx" value={parseFloat(data.price)?.toLocaleString('en-IN') || 0} onChange={e => { handleChange({ price: util.handleFloat(e.target.value) }) }} />
                              </Form.Item>
                          </Col>
                          <Col span={6}>
                              <Form.Item label="Discount Price" required>
                                  <Input prefix="₹ " placeholder="xxx" value={parseFloat(data.discountPrice)?.toLocaleString('en-IN') || 0} onChange={e => { handleChange({ discountPrice: util.handleFloat(e.target.value) }) }} />
                              </Form.Item>
                          </Col>
                          <Col span={6}>
                              <Form.Item label="Inventory" required>
                                  <Input placeholder="xxx" value={parseFloat(data.inventory)?.toLocaleString('en-IN') || 0} onChange={e => { handleChange({ inventory: util.handleFloat(e.target.value) }) }} />
                              </Form.Item>
                          </Col>

                          <Col span={6}>
                              <Form.Item label="Is Default" required>
                                  <Select value={data?.isDefault} placeholder="Set Default Product" onChange={e => { handleChange({ isDefault: e }) }} >
                                      <Select.Option value={true}>Yes</Select.Option>
                                      <Select.Option value={false}>No</Select.Option>
                                  </Select>
                              </Form.Item>
                          </Col>
                          <Col span={6}>
                              <Form.Item label="Status" required>
                                  <Select value={data?.status} placeholder="Status" onChange={e => { handleChange({ status: e }) }} >
                                      <Select.Option value={true}>Yes</Select.Option>
                                      <Select.Option value={false}>No</Select.Option>
                                  </Select>
                              </Form.Item>
                          </Col>


                          <Col span={24}>
                              <Row gutter={[12, 0]}>
                                  <Col span={4}>
                                      <Form.Item label="ThumbNail Image" required>
                                          <UploadImage
                                              value={data.thumbImage?.length ? data.thumbImage : []}
                                              count={1}
                                              onChange={(v, i) => {
                                                  setData({ ...data, thumbImage: v?.[0] })
                                              }}
                                              listType="picture-card"
                                          />
                                      </Form.Item>
                                  </Col>
                                  <Col span={18}>
                                      <Form.Item label="Product Picture" required>
                                          <UploadImage
                                              value={data.pictures?.length ? data.pictures : []}
                                              count={8}
                                              onChange={(v, i) => {
                                                  setData({ ...data, pictures: v })
                                              }}
                                              listType="picture-card"
                                          />
                                      </Form.Item>
                                  </Col>
                              </Row>
                          </Col>

                      </Row>
                  </Form>
              </Spin>
          </Modal>
      </>
  );
});


const ColorOptions = [
    {
      "label": "Red",
      "value": "#FF0000",
      "displayColor": "#FF0000"
    },
    {
      "label": "Green",
      "value": "#00FF00",
      "displayColor": "#00FF00"
    },
    {
      "label": "Blue",
      "value": "#0000FF",
      "displayColor": "#0000FF"
    },
    {
      "label": "Yellow",
      "value": "#FFFF00",
      "displayColor": "#FFFF00"
    },
    {
      "label": "Orange",
      "value": "#FFA500",
      "displayColor": "#FFA500"
    },
    {
      "label": "Purple",
      "value": "#800080",
      "displayColor": "#800080"
    },
    {
      "label": "Black",
      "value": "#000000",
      "displayColor": "#000000"
    },
    {
      "label": "White",
      "value": "#FFFFFF",
      "displayColor": "#FFFFFF"
    }
  ]
  