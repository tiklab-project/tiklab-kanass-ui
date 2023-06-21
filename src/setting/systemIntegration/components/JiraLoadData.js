/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-10-13 16:54:17
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-21 13:11:30
 */
import React, { Fragment, useEffect, useState } from "react";
import { Upload, message, Button, Row, Col, Progress } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import "./JiraLoadData.scss";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { getUser } from 'tiklab-core-ui';
import { observer } from "mobx-react";
import { base_url } from "../../../../enviroment/enviroment_local";
import UrlDataStore from "../store/UrlDataStore"
const LoadData = (props) => {
    const { findJiraInputSchedule } = UrlDataStore;
    const ticket = getUser().ticket;
    const [currentSchedule, setCurrentSchedule] = useState({ currentNum: 0, project: null, total: 0 })
    const [percent, setPercent] = useState(0);
    const [loading, setLoading] = useState(false)
    let [timer, setTimerS] = useState()
    // let timer;
    useEffect(()=> {
        console.log(timer)
        return () => clearInterval(timer)
    }
    , [])

    const getJiraInputSchedule = () => {
        findJiraInputSchedule().then(res => {
            if (res.code === 0) {
                currentSchedule.project = res.data.project ? res.data.project : null;
                currentSchedule.total = res.data.total ? res.data.total : 0;
                currentSchedule.currentNum = res.data.currentNum ? res.data.currentNum : 0;
                if (res.data.total && res.data.currentNum) {
                    const rr = res.data.currentNum * 100 / res.data.total;
                    setPercent(rr);
                    console.log(res.data.currentNum,res.data.total )
                }
                // setPercent(3 / 10);
                setCurrentSchedule(currentSchedule)
            }
        })
    }
    const domain = window.location.host;
    const upload_url = env === "local" ? JSON.parse(base_url) : `http://${domain}`
    const uploadProps = {
        
        name: 'uploadFile',
        accept: ".zip",
        action: `${upload_url}/importDate/importJireDate`,
        headers: {
            authorization: 'authorization-text'
        },
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
            console.log(info)
            if(info.event){
                clearInterval(timer) 
                // console.log(1, timer)
                setLoading(true)
                timer = setInterval(() => {getJiraInputSchedule()}, 2000)
                setTimerS(timer)
                console.log(2, timer)
            }
            if(info.file.status === "done"){
                console.log(timer)
                clearInterval(timer) 
                setLoading(false)
                setTimerS(null)
                if(info.file.response.code === 0){
                   message.success("导入成功")
                }else{
                    message.error("导入失败")
                }
                
                console.log(timer)
            }

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
                                <Button icon={<UploadOutlined />}>导入jira数据</Button>
                            </Upload>
                        </div>
                        {
                            loading && <div className="load-precess">
                                <Progress percent={percent} showInfo={false} />
                                <div className="load-precess-text"> 当前解析项目：<span className="load-precess-name">{currentSchedule.project?.projectName}</span>  <span>{currentSchedule.currentNum} / {currentSchedule.total}</span></div>
                            </div>
                        }

                    </div>
                    {/* <div onClick={() => setTimer()}>开启</div>

                    <div onClick={() => closeTimer()}>关闭</div> */}
                </div>
            </Col>
        </Row>
    )
}

export default observer(LoadData);