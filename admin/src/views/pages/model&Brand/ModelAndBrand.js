import { Col, Row } from 'antd'
import React from 'react'
import Brand from './Brand'
import Model from './Model'

const ModelAndBrand = () => {
  return (
    <Row gutter={24}>
    <Col span={12}>
        <Model  />
    </Col>
             <Col span={12}>
             <Brand/>
            </Col>
</Row>
  )
}

export default ModelAndBrand