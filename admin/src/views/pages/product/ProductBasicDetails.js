import { Button, Cascader, Col, Form, Input, Row, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import UploadImage from "../../../utils/UploadImage";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import brandAndModel from "../../../services/brand&Model";
import serviceCategory from "../../../services/category";
import TinyMce from "../../../utils/TinyMce";
import util from "../../../utils/util";

const { SHOW_CHILD } = Cascader;

const ProductBasicDetails = (props) => {
  const { data, setData, handleChange, ajxRequesting } = props;
  const [model, setModel] = useState([]);
  const [brand, setBrand] = useState([]);
  const [category, setCategory] = useState([]);

  async function modelList(brandId) {
    try {
      let res = await brandAndModel.list({ brandId });
      setModel(res.data);
      console.log(res);
    } catch (error) {}
  }

  async function BrandListAndCategory() {
    try {
      let res = await brandAndModel.brandList();
      let cat = await serviceCategory.listWithChildren({ isAll: 1 });
      setCategory(cat.data || []);
      setBrand(res.data);
    } catch (error) {}
  }
  useEffect(() => {
    if (data?.brandId) {
      modelList(data?.brandId);
    }
  }, [data?.brandId]);

  useEffect(() => {
    if (!data._id) {
      handleChange({ slug: util.removeSpecialChars(data.name) });
    }
  }, [data.name]);

  useEffect(() => {
    BrandListAndCategory();
  }, []);

  return (
    <>
      <Spin
        spinning={ajxRequesting}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
      >
        <Form layout="vertical">
          <Row gutter={[12, 0]}>
            <Col span={12}>
              <Form.Item label="Name" required>
                <Input
                  placeholder="Name"
                  value={data?.name}
                  onChange={(e) => {
                    handleChange({ name: e.target.value });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Slug" required>
                <Input
                  placeholder="Unique slug"
                  value={data.slug}
                  onChange={(e) => {
                    handleChange({
                      slug: util.removeSpecialChars(e.target.value),
                    });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Product Code" required>
                <Input
                  placeholder="Product Code"
                  value={data?.productCode}
                  onChange={(e) => {
                    handleChange({ productCode: e.target.value });
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Brief Description" required>
                <Input
                  placeholder="Brief Description"
                  value={data?.briefDescription}
                  onChange={(e) => {
                    handleChange({ briefDescription: e.target.value });
                  }}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Brand" required>
                <Select
                  value={data?.brandDetails?.name}
                  placeholder="Choose"
                  onChange={(e) => {
                    handleChange({ brandId: e });
                  }}
                >
                  {brand?.map((value, i) => (
                    <Select.Option key={i} value={value?._id}>
                      {value?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Model" required>
                <Select
                  value={data?.modelDetails?.name}
                  placeholder="Choose"
                  onChange={(e) => {
                    handleChange({ modelId: e });
                  }}
                >
                  {model?.map((value, i) => (
                    <Select.Option key={i} value={value?._id}>
                      {value?.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Choose Category" required>
                <Cascader
                  style={{ width: "100%" }}
                  value={data?.categoryIds}
                  options={category}
                  onChange={(e) => {
                    handleChange({ categoryIds: e });
                  }}
                  placeholder="Choose categories"
                  maxTagCount="responsive"
                  showCheckedStrategy={SHOW_CHILD}
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Description" required>
                <TinyMce
                  value={data.description}
                  onChange={(v) => {
                    data.description = v;
                  }}
                />
              </Form.Item>
            </Col>

            {/* <Col span={24}>
              <Form.Item label="Profile Image">
                <UploadImage
                  value={data?.avatar ? [data?.avatar] : []}
                  onChange={(v) => {
                    setData({ ...data, avatar: v?.[0] });
                  }}
                  listType="picture"
                  uploadButton={
                    <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                      Upload Profile Photo
                    </Button>
                  }
                />
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      </Spin>
    </>
  );
};

export default ProductBasicDetails;
