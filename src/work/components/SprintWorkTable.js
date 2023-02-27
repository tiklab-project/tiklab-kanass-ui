import React from "react";
import "./WorkTable.scss";
import WorkBreadCrumb from "./WorkBreadCrumb";
import WorkTableContent from "./workTableContant";
import WorkTableFilter from "./WorkTableFilter";
import { Row,Col } from "antd";

const SprintWorkTable=(props) => {
    const { form } =props
    return (
        <div className="work-table" style={{background: "#fff"}}>
            <Row style={{height: "100%",overflow: "auto"}}>
                <Col className="work-col" lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                    <WorkBreadCrumb />
                    <WorkTableFilter form = {form}/>
                    <WorkTableContent {...props} form = {form}></WorkTableContent>
                </Col>
            </Row>
            
        </div>
        
    );
}

export default SprintWorkTable