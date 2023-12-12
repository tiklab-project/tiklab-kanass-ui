import React from "react";
import "./DynamicItem.scss"
import { withRouter } from "react-router";
const DynamicListItem = (props) => {
    const { content, model, type } = props;
    const data = JSON.parse(content)
    console.log(data)
    const { createUserIcon, createUser, master, workItemTitle, receiveTime, createTime, workItemId,
        projectId, oldValue, newValue, projectName } = data;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const goDynamicDetail = () => {
        switch (model) {
            case "sprint":
                props.history.push(`/${projectId}/sprintdetail/${sprintId}/work/${workItemId}`);
                break;
            case "version":
                props.history.push(`/${projectId}/versiondetail/${versionId}/work/${workItemId}`);
                break;
            case "projectSet":
                props.history.push(`/projectDetail/${projectId}/work/${workItemId}`);
                break;
            default:
                props.history.push(`/projectDetail/${projectId}/work/${workItemId}`);
                break;
        }
    }
    const setDom = () => {
        let dom = null;
        switch (type) {
            case "KANASS_LOGTYPE_PROJECTADD":
                dom = (
                    <div className="dynamic-list-item" >
                        <div className="dynamic-list-item-left">
                            <div className="dynamic-user-icon">{createUserIcon}</div>
                            <div className="dynamic-content">
                                <div className="dynamic-work-action">{master}添加了项目</div>
                                <div className="dynamic-work-item">
                                    <div class="dynamic-work-title" onClick={() => goDynamicDetail()}>{projectName}</div>
                                </div>
                            </div>
                        </div>
                        <div>{createTime} </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKITEMADD":
                dom = (
                    <div className="dynamic-list-item" >
                        <div className="dynamic-list-item-left">
                            <div className="dynamic-user-icon">{createUserIcon}</div>
                            <div className="dynamic-content">
                                <div className="dynamic-work-action">{master}添加了事项</div>
                                <div className="dynamic-work-item">
                                    <div class="dynamic-work-title" onClick={() => goDynamicDetail()}>{workItemTitle}</div>
                                </div>
                            </div>
                        </div>
                        <div>{createTime} </div>
                    </div>
                )
                break;
            case "KANASS_LOGTYPE_WORKUPDATESTATUS":
                dom = (
                    <div className="dynamic-list-item" >
                        <div className="dynamic-list-item-left">
                            <div className="dynamic-user-icon">{createUserIcon}</div>
                            <div className="dynamic-content">
                                <div className="dynamic-work-action">{master.nickname}修改了事项状态</div>
                                <div className="dynamic-work-item">
                                    <div class="dynamic-work-title" onClick={() => goDynamicDetail()}>{workItemTitle}</div>
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
                        </div>
                        <div className="dynamic-time">{receiveTime} </div>
                    </div >
                )
                break;
            case "KANASS_LOGTYPE_WORKUPDATEMASTER":
                dom = (
                    <div className="dynamic-list-item" >
                        <div className="dynamic-list-item-left">
                            <div className="dynamic-user-icon">{createUserIcon}</div>
                            <div className="dynamic-content">
                                <div className="dynamic-work-action">{master.nickname}修改了事项负责人</div>
                                <div className="dynamic-work-item">
                                    <div class="dynamic-work-title" onClick={() => goDynamicDetail()}>{workItemTitle}</div>
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
                        </div>
                        <div className="dynamic-time">{receiveTime} </div>
                    </div >
                )
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