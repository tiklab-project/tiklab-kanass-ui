/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-10-13 16:54:17
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:11:30
 */
import React, { Fragment, useState } from "react";
import { Upload, message, Button, Row, Col, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import "./JiraLoadData.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { getUser } from 'tiklab-core-ui';
import { observer, inject } from "mobx-react";
const LoadData = (props) => {
    const { urlDataStore } = props;
    const { findJiraInputSchedule } = urlDataStore;
    const ticket = getUser().ticket;
    const [currentSchedule, setCurrentSchedule] = useState({ currentNum: 0, project: null, total: 0 })
    const [percent, setPercent] = useState(0);
    const [loading, setLoading] = useState(false)
    let getImportLog;
    let timer;
    const getJiraInputSchedule = () => {
        findJiraInputSchedule().then(res => {
            if (res.code === 0) {
                currentSchedule.project = res.data.project ? res.data.project : null;
                currentSchedule.total = res.data.total ? res.data.total : 0;
                currentSchedule.currentNum = res.data.currentNum ? res.data.currentNum : 0;
                if (res.data.total && res.data.currentNum) {
                    const rr = res.data.currentNum / res.data.total;
                    setPercent(rr);
                }

                setCurrentSchedule(currentSchedule)
            }
        })
    }

    const timeTask = (params) => {
        console.log(params)
        timer = setInterval(() => {
            getJiraInputSchedule()
            // clearInterval(timer)
            switch (params.status) {
                case "done":
                    console.log("done",params)
                    if (params.response.code === 0) {
                        message.info("数据导入成功")
                    } else {
                        message.error("数据失败")
                    }
                    clearInterval(timer)  
                    console.log(timer)
                    clearInterval(timer)
                    console.log(timer)
                    timer = null
                    setLoading(false)

                    break
                case "error":
                    clearInterval(timer)  
                    console.log(timer)
                    clearInterval(timer)
                    console.log(timer)
                    timer = null
                    setLoading(false)
                    message.error("数据失败")
                    break
                default:
                    break;
            }
        }, 2000)
    }

    const uploadProps = {
        name: 'uploadFile',
        action: `${base_url}/importDate/importJireDate`,
        headers: {
            authorization: 'authorization-text',
        },
        headers: {
            ticket: ticket
        },
        maxCount: 1,
        onChange(info) {
            console.log("sddd")
            setLoading(true)
            timeTask(info.file)

        },
    };

    return (
        <Row >
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="load">
                    <Breadcumb
                        firstText="系统集成"
                        secondText="jira集成"
                    />
                    <div className="load-jira">
                        <div>从本地文件导入Jira数据</div>
                        <div className="load-box">
                            上传Jira zip包：
                            <Upload {...uploadProps}>
                                <Button icon={<UploadOutlined />}>导入外部数据</Button>
                            </Upload>
                        </div>
                        {
                            loading && <div className="load-precess">
                                <Progress percent={percent} showInfo={false} />
                                <div className="load-precess-text"> 当前解析项目： {currentSchedule.project?.projectName} <span>{currentSchedule.currentNum}/ {currentSchedule.total}</span></div>
                            </div>
                        }

                    </div>

                </div>
            </Col>
        </Row>
    )
}

export default inject("urlDataStore")(observer(LoadData));