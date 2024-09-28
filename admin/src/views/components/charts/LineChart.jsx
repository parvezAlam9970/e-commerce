import React from 'react';
import { Card, Col, Row, Typography } from 'antd';
import ReactApexChart from "react-apexcharts";
import { MinusOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const LineChart = () => {
  const lineChart = {
    series: [
     
      {
        name: "Orders",
        data: [30, 90, 40, 140, 290, 290, 340, 230, 400],
        offsetY: 0,
      },
    ],

    options: {
      chart: {
        width: "100%",
        height: 350,
        type: "area",
        toolbar: {
          show: false,
        },
      },

      legend: {
        show: false,
      },

      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },

      yaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: ["#8c8c8c"],
          },
        },
      },

      xaxis: {
        labels: {
          style: {
            fontSize: "14px",
            fontWeight: 600,
            colors: [
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
              "#8c8c8c",
            ],
          },
        },
        categories: [
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
        ],
      },

      tooltip: {
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  };

  return (
    <Row gutter={[16, 16]} align="middle">
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <Title level={3} style={{ fontWeight: 'bold', fontSize: '18px', margin: "0px" }}>
              Orders
            </Title>
            <div>
              <Title level={5}>Current Year Orders</Title>
              
            </div>
          </div>

          <div style={{ display: "flex" }}>

            <div className="sales">
              <ul>
                <li><MinusOutlined /> Traffic</li>
                <li><MinusOutlined /> Sales</li>
              </ul>
            </div>
          </div>

        </div>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <ReactApexChart
          options={lineChart.options}
          series={lineChart.series}
          type="area"
          height={350}
          width={"100%"}
        />
      </Col>
    </Row>
  );
}

export default LineChart;
