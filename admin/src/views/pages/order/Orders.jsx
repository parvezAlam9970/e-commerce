import React, { useRef, useState } from "react";
import util from "../../../utils/util";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltLeft } from "react-icons/fa";

import { Col, Row, Typography } from "antd";

const Orders = () => {
  const [ar, setAr] = useState({
    viewAccess: true || util.checkRightAccess(),
    addAccess: true || util.checkRightAccess(),
    editAccess: true || util.checkRightAccess(),
    deleteAccess: true || util.checkRightAccess(),
    viewRightAccess: true || util.checkRightAccess(),
  });

  const navigate = useNavigate();
  const addNewModalRef = useRef();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [qData, setQData] = useState({ page: 1, limit: 20 });

  return <>
   <Row
        align="middle"
        gutter={[16, 0]}
        className="mb10 flex j-center a-center"
      >
<Col flex="auto">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span className="back_arrow c-pointer" onClick={() => navigate(-1)}>
              <FaLongArrowAltLeft size={20} style={{ color: "white" }} />
            </span>
            <Typography.Title
              className="m-0"
              style={{ fontWeight: 700 }}
              level={4}
            >
              List Of Orders
            </Typography.Title>
          </div>
        </Col>

      </Row>
  </>;
};

export default Orders;
