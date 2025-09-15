/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 13:53:09
 * @Description: 动态列表项
 */

import React from "react";
import "./DynamicItem.scss"
import { withRouter } from "react-router";
import {Space} from "antd";
const DynamicListItem = (props) => {
    const { content, type, time } = props;
    const data = JSON.parse(content)
    const { master, workItemTitle, workItemId, projectId, oldValue, newValue, projectName, details } = data;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const path = props.match.path;
    const goDynamicDetail = () => {
        if (path.indexOf("sprint") > -1) {
            props.history.push(`/${projectId}/sprint/${sprintId}/work/${workItemId}`);
        }
        if (path.indexOf("home") > -1) {
            props.history.push(`/project/${projectId}/work/${workItemId}`);
        }
        if (path.indexOf("project") > -1) {
            props.history.push(`/project/${projectId}/work/${workItemId}`);
        }
        if (path.indexOf("version") > -1) {
            props.history.push(`/${projectId}/version/${versionId}/work/${workItemId}`);
        }
        if (path.indexOf("projectSet") > -1) {
            props.history.push(`/project/${projectId}/work/${workItemId}`);
        }
    }
    const setDom = () => {
        let dom = null;
        switch (type) {
            case "KANASS_LOGTYPE_PROJECTADD":
                dom = (
                    <div className="dynamic-content">
                        <div>
                            <div className="dynamic-work-action">
                                {master} 添加项目
                            </div>
                            <div className="dynamic-work-item">
                                <div className="dynamic-work-title">{projectName}</div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKITEMADD":
                dom = (
                    <div className="dynamic-content">
                        <div>
                            <div className="dynamic-work-action">
                                {master} 添加事项
                            </div>
                            <div className="dynamic-work-item">
                                <div className="dynamic-work-title">{workItemTitle}</div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKUPDATESTATUS":
                dom = (
                    <div className="dynamic-content">
                        <div>
                            <div className="dynamic-work-action">
                                {master.nickname}   修改  {workItemTitle}  事项状态
                            </div>
                            <div className="dynamic-work-item">
                                <div style={{display: "flex"}}>
                                    <div
                                        className="dynamic-work-oldvalue"
                                    >
                                        {oldValue.name}
                                    </div>
                                    修改为
                                    <div
                                        className="dynamic-work-newValue">
                                        {newValue.name}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKUPDATEMASTER":
                dom = (
                    <div className="dynamic-content">
                        <div>
                            <div className="dynamic-work-action">
                                {master.nickname}  修改  {workItemTitle}  事项负责人
                            </div>
                            <div className="dynamic-work-item">
                                <div style={{display: "flex"}}>
                                    <Space>
                                        <div className="dynamic-work-oldvalue">
                                            {oldValue.nickname}
                                        </div>
                                        修改为
                                        <div className="dynamic-work-newValue">
                                            {newValue.nickname}
                                        </div>
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKITEMCOMMENTADD":
                dom = (
                    <div className="dynamic-content">
                        <div>
                            <div className="dynamic-work-action">
                                {master}  为 {workItemTitle} 添加评论
                            </div>
                            <div className="dynamic-work-item">
                                <div className="dynamic-work-newValue">
                                    {details.length > 10 ? details.substring(0, 10) + "..." : details}
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKITEMTAKEUPTIMEADD":
                dom = (
                    <div className="dynamic-content">
                        <div>
                            <div className="dynamic-work-action">
                                {master.nickname}  为 {workItemTitle} 新增登记工时
                            </div>
                            <div className="dynamic-work-item">
                                <div style={{display: "flex"}}>
                                    <Space>
                                        <div className="dynamic-work-oldvalue">
                                            {oldValue}
                                        </div>
                                        修改为
                                        <div className="dynamic-work-newValue">
                                            {newValue}
                                        </div>
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKUPDATETAKEUPTIME":
                dom = (
                    <div className="dynamic-content">
                        <div>
                            <div className="dynamic-work-action">
                                {master.nickname}  修改 {workItemTitle} 登记工时
                            </div>
                            <div className="dynamic-work-item">
                                <div style={{display: "flex"}}>
                                    <Space>
                                        <div className="dynamic-work-oldvalue">
                                            {oldValue}
                                        </div>
                                        修改为
                                        <div className="dynamic-work-newValue">
                                            {newValue}
                                        </div>
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKUPDATESURPLUSTIME":
                dom = (
                    <div className="dynamic-content">
                        <div>
                            <div className="dynamic-work-action">
                                {master.nickname}  修改 {workItemTitle} 剩余工时
                            </div>
                            <div className="dynamic-work-item">
                                <div style={{display: "flex"}}>
                                    <Space>
                                        <div className="dynamic-work-oldvalue">
                                            {oldValue}
                                        </div>
                                        修改为
                                        <div className="dynamic-work-newValue">
                                            {newValue}
                                        </div>
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKUPDATEMESTIMATETIME":
                dom = (
                    <div className="dynamic-content">
                        <div>
                            <div className="dynamic-work-action">
                                {master.nickname} 修改 {workItemTitle} 预估工时
                            </div>
                            <div className="dynamic-work-item">
                                <div style={{display: "flex"}}>
                                    <Space>
                                        <div className="dynamic-work-oldvalue">
                                            {oldValue}
                                        </div>
                                        修改为
                                        <div className="dynamic-work-newValue">
                                            {newValue}
                                        </div>
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                break;
            default:
                break;
        }
        return dom;
    }
    return (<>
        {
            setDom()
        }

    </>

    )
}

export default withRouter(DynamicListItem);