import { Col, Row } from "antd";
import { useState, useEffect } from "react";
import ParentCategory from "./ParentCategory";
import SubCategory from "./SubCategory";



export default function Category() {
    const [selected, setSelected] = useState({
        parentCategory: '',
        subCategory: '',
    });


    useEffect(() => {
        setSelected({ parentCategory: selected.parentCategory, subCategory: '' });
    }, [selected.parentCategory]);

    return (
        <Row gutter={24}>
            <Col span={12}>
                <ParentCategory {...{ selected, setSelected }} />
            </Col>
            {
                selected.parentCategory.length
                    ? <Col span={12}>
                        <SubCategory {...{ selected, setSelected }} />
                    </Col>
                    : null
            }
        </Row>
    );
}