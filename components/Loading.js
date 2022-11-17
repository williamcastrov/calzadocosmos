import React from "react";
import { Row, Col, Spin } from "antd";

export default function Loading() {
    return (
        <div className='flex flex-col h-screen justify-center items-center bg-[url("/bg-3.jpg")]'>
            <Row>
                <Col span={24} style={{ alignItems: "center" }}>
                    <img src="/logo-cosmos.jpg" width={300} style={{ marginBottom: "20px" }} alt="" />
                </Col>
            </Row>
            <Row>
                <Col span={24} style={{ alignItems: "center" }}>
                    <Spin size="large" />
                </Col>
            </Row>
        </div>
    );
}