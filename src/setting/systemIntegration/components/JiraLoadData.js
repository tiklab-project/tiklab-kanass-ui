/*
 * @Descripttion: JIAR 导入
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-10-13 16:54:17
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 16:29:07
 */
import React, { Fragment, useEffect, useState } from "react";
import {Upload, message, Button, Row, Col, Progress, Steps} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import "./JiraLoadData.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { getUser } from 'tiklab-core-ui';
import { observer } from "mobx-react";
import UrlDataStore from "../store/UrlDataStore"
const LoadData = (props) => {
    const { findJiraInputSchedule } = UrlDataStore;
    const ticket = getUser().ticket;
    const [currentSchedule, setCurrentSchedule] = useState({ currentNum: 0, project: null, total: 0 })
    const [percent, setPercent] = useState(0);
    const [loading, setLoading] = useState(false)
    let [timer, setTimerS] = useState()
    // 节点状态 finish结束、error失败、wait等待、process进行中
    const [step0, setStep0] = useState({
        key: "0",
        title: "上传文件",
        status: "process"
    })
    const [step1, setStep1] = useState({
        key: "1",
        title: "校验版本",
        status: "wait"
    })
    const [step2, setStep2] = useState({
        key: "2",
        title: "解析数据",
        status: "wait"
    })
    const [step3, setStep3] = useState({
        key: "3",
        title: "开始导入",
        status: "wait"
    })

    // let timer;
    useEffect(() => {
        return () => clearInterval(timer)
    }, [])

    const getJiraInputSchedule = () => {
        findJiraInputSchedule().then(res => {
            if (res.code === 0) {
                currentSchedule.project = res.data.project ? res.data.project : null;
                currentSchedule.total = res.data.total ? res.data.total : 0;
                currentSchedule.currentNum = res.data.currentNum ? res.data.currentNum : 0;
                if (res.data.total && res.data.currentNum) {
                    const rr = res.data.currentNum * 100 / res.data.total;
                    setPercent(rr);
                    
                }

                setStep0({...step0, status: res.data.step.step0});
                setStep1({...step1, status: res.data.step.step1});
                setStep2({...step2, status: res.data.step.step2});
                setStep3({...step3, status: res.data.step.step3});

                if (res.data.status === 1) {
                    clearInterval(timer);
                    setLoading(false)
                    message.success("导入成功")
                } 
                if(res.data.status === 2){
                    clearInterval(timer);
                    setLoading(false)
                    message.error("导入失败")
                    // setStep0({...step0, status: res.data.step.step0});
                    setStep1({...step1, status: "wait"});
                    setStep2({...step2, status: "wait"});
                    setStep3({...step3, status: "wait"});
                }
                // setPercent(3 / 10);
                setCurrentSchedule(currentSchedule)
            }
        })
    }
    // 上传附件的信息
    const upload_url = env === "local" ? base_url : "";
    const domain = window.location.host;
    const uploadProps = {
        name: 'uploadFile',
        action: `${upload_url}/importDate/importJiraDate`,
        headers: {
            ticket: ticket,
            tenant: getUser().tenant && version === "cloud" ? getUser().tenant : null
        },
        progress: {
            strokeWidth: 0,
            showInfo: false
        },
        showUploadList: false,
        maxCount: 1,
        onChange(info) {
            if (info.event) {
                clearInterval(timer)
                setLoading(true)
                timer = setInterval(() => getJiraInputSchedule(), 2000)
                setTimerS(timer)
            }
            if (info.file.status === "done") {
                
                setTimerS(null)
               
            }

        },
    };

    return (
        // <Row >
        //     <Col sm={24} md={24} lg={{ span: 24 }} xl={{ span: "18", offset: "3" }} xxl={{ span: "18", offset: "3" }}>
        <div className="load">
            <Breadcumb
                firstText="导入外部数据"
                firstUrl="/setting/loadData"
                secondText="Jira导入"
            />
            <div className="load-step">
                <Steps>
                    <Steps.Step key={step0.key} title={step0.title} status={step0.status} />
                    <Steps.Step key={step1.key} title={step1.title} status={step1.status} />
                    <Steps.Step key={step2.key} title={step2.title} status={step2.status} />
                    <Steps.Step key={step3.key} title={step3.title} status={step3.status} />
                </Steps>
            </div>
            <div className="load-jira">
                <div>从本地文件导入Jira数据</div>
                <div className="load-box">
                    上传Jira zip包：
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>导入Jira数据</Button>
                    </Upload>
                </div>
                <div>
                    目前支持的版本为9.4.0、8.4.1，其他版本导入可能会丢失部分数据
                </div>
                <div>
                    注意：附件的导入需要手动将/var/atlassian/application-data/jira/data下的/attachment文件夹添加到zip包中
                </div>
                {
                    step2.status === "process" && loading && <div className="load-precess">
                        <Progress percent={percent} showInfo={false} />
                        <div className="load-precess-text"> 当前导入项目：<span className="load-precess-name">{currentSchedule.project?.projectName}</span>  <span>{currentSchedule.currentNum} / {currentSchedule.total}</span></div>
                    </div>
                }
            </div>
        </div>
        //     </Col>
        // </Row>
    )
}

export default observer(LoadData);