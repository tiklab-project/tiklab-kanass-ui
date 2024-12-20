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
const DynamicListItem = (props) => {
    const { content, type } = props;
    const data = JSON.parse(content)
    const { master, workItemTitle, workItemId, projectId, oldValue, newValue, projectName } = data;
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
                        <div className="dynamic-work-action">{master}添加了项目</div>
                        <div className="dynamic-work-item">
                            <div className="dynamic-work-title" onClick={() => goDynamicDetail()}>{projectName}</div>
                        </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKITEMADD":
                dom = (
                    <div className="dynamic-content">
                        <div className="dynamic-work-action">{master}添加了事项</div>
                        <div className="dynamic-work-item">
                            <div className="dynamic-work-title" onClick={() => goDynamicDetail()}>{workItemTitle}</div>
                        </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKUPDATESTATUS":
                dom = (
                    <div className="dynamic-content">
                        <div className="dynamic-work-action">{master.nickname}修改了事项状态</div>
                        <div className="dynamic-work-item">
                            <div className="dynamic-work-title" onClick={() => goDynamicDetail()}>{workItemTitle}</div>
                            <div
                                className="dynamic-work-oldvalue"
                            >
                                {oldValue.name}
                            </div>
                            ———
                            <div
                                className="dynamic-work-newValue">
                                {newValue.name}
                            </div>
                        </div>

                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKUPDATEMASTER":
                dom = (
                    <div className="dynamic-content">
                        <div className="dynamic-work-action">{master.nickname}修改了事项负责人</div>
                        <div className="dynamic-work-item">
                            <div className="dynamic-work-title" onClick={() => goDynamicDetail()}>{workItemTitle}</div>
                            <div
                                className="dynamic-work-oldvalue"
                            >
                                {oldValue.nickname}
                            </div>
                            ———
                            <div
                                className="dynamic-work-newValue">
                                {newValue.nickname}
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