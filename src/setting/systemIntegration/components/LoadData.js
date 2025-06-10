import {observer} from "mobx-react";
import React, { Fragment, useEffect, useState } from "react";
import {Alert, Button, Col, Collapse, Form, Input, Modal, Row, Panel} from "antd";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import "./LoadData.scss"

import {ImportOutlined} from "@ant-design/icons";
import {withRouter} from "react-router";
const LoadData = (props) => {

    const loadJiraDataDesc = () => (
        <div onClick={(e) => {handlePanelChange(e, "/setting/jiraLoadData")}}>
            <div className="project-info-title">
                <ImportOutlined style={{
                    marginRight: "5px",
                }}/>
                Jira导入
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use></use>
                </svg>
                目前支持的版本为9.4.0、8.4.1，其他版本导入可能会丢失部分数据
            </div>
        </div>
    );
    const loadMantisDataDesc = () => (
        <div onClick={(e) => {handlePanelChange(e, "/setting/mantisLoadData")}}>
            <div className="project-info-title">
                <ImportOutlined style={{
                    marginRight: "5px",
                }}/>
                Mantis导入
            </div>
            <div style={{ fontSize: "12px", color: "#999" }}>
                <svg aria-hidden="true" className="img-icon-right" fill="#fff">
                    <use></use>
                </svg>
                目前支持的版本为2.27.1，其他版本导入可能会丢失部分数据
            </div>
        </div>
    );

    const handlePanelChange = (e, url) => {
        console.log("点击了panel     +  " + url)
        e.stopPropagation();// 阻止展开事件
        props.history.push(url);

    }

  return  (
      <Row>
          <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
              <div className="load-data">
                  <Breadcumb
                      firstText="导入外部数据"
                  />

                  <div className="load-data-box">
                      <div className="load-data-content">
                          {
                              loadJiraDataDesc()
                          }
                      </div>
                      <div className="load-data-content">
                          {
                              loadMantisDataDesc()
                          }
                      </div>
                  </div>

              </div>

          </Col>
      </Row >
  )
}

export default withRouter(observer(LoadData));