/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-04-09 16:39:00
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 19:09:13
 */
import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { DatePicker } from 'antd';
import moment from 'moment';
import locale from 'antd/es/date-picker/locale/zh_CN';
import "./versionDetail.scss";
import VersionPlan from "./versionPlan"
const VersionDetail = (props) => {
    const { versionStore, actionPlanId } = props;
    const { findVersion, versionId } = versionStore;
    const [planInfo, setPlanInfo] = useState()
    useEffect(() => {
        if (actionPlanId !== "") {
            findVersion(actionPlanId).then(data => {
                setPlanInfo(data.data)
            })
        }

        return;
    }, [actionPlanId])

    const setStatusName = (value) => {
        let name = ""
        switch (value) {
            case "0":
                name = "未开始"
                break;
            case "1":
                name = "进行中"
                break;
            case "2":
                name = "已结束"
                break;
            default:
                name = "未开始"
                break;
        }
        return name;
    }
    const [fieldName, setFieldName] = useState("")
    const changeStyle = (value) => {
        setFieldName(value)
    }
    const dateFormat = 'YYYY-MM-DD';
    return (
        <div className="plan-detail">
            {
                planInfo && <div className="plan-detail-top">
                    <div className="plan-name">
                        {planInfo.name}
                    </div>
                    <div className="plan-info">
                        <div className="plan-date">
                            <div className="plan-lable">状态：</div>
                            <div className="plan-data" style={{width: "107px"}}>{setStatusName(planInfo.versionState)}</div>
                        </div>
                        <div className="plan-date">
                            <div className="plan-lable">开始日期：</div>
                            {/* <div className="plan-data"> */}
                            <DatePicker
                                locale={locale}
                                format={dateFormat}
                                showTime
                                allowClear={false}
                                className="work-select"
                                bordered={fieldName === "planStartTime" ? true : false}
                                showArrow={fieldName === "planStartTime" ? true : false}
                                onFocus={() => changeStyle("planStartTime")}
                                onBlur={() => setFieldName("")}
                                suffixIcon={false}
                                value={moment(planInfo.startTime, dateFormat)}
                            />
                            {/* {planInfo.publishDate}</div> */}
                        </div>
                        <div className="plan-date">
                            <div className="plan-lable">发布日期：</div>
                            <DatePicker
                                locale={locale}
                                format={dateFormat}
                                showTime
                                allowClear={false}
                                className="work-select"
                                bordered={fieldName === "planPublishTime" ? true : false}
                                showArrow={fieldName === "planPublishTime" ? true : false}
                                onFocus={() => changeStyle("planPublishTime")}
                                onBlur={() => setFieldName("")}
                                suffixIcon={false}
                                value={moment(planInfo.publishDate, dateFormat)}
                            />
                        </div>
                    </div>
                    <VersionPlan actionPlanId= {actionPlanId}/>
                    
                </div>
            }

        </div>
    )

}
export default inject("versionStore")(observer(VersionDetail));