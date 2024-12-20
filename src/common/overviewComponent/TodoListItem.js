/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 14:10:35
 * @Description: 待办项
 */

import React from "react";
import "./TodoListItem.scss"
import { withRouter } from "react-router";
const TodoListItem = (props) => {
    const { content, model, key } = props;
    
    const data = JSON.parse(content)
    const { createUserIcon, createUser, workItemTitle, receiveTime, workItemId, projectId } = data;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const path = props.match.path;
    const goTodoDetail = () => {
        if(path.indexOf("sprint") > -1){
            props.history.push(`/${projectId}/sprint/${sprintId}/work/${workItemId}`);
        }
        if(path.indexOf("index") > -1){
            props.history.push(`/project/${projectId}/work/${workItemId}`);
        }
        if(path.indexOf("project") > -1){
            props.history.push(`/project/${projectId}/work/${workItemId}`);
        }
        if(path.indexOf("version") > -1){
            props.history.push(`/${projectId}/version/${versionId}/work/${workItemId}`);
        }
        if(path.indexOf("projectSet") > -1){
            props.history.push(`/project/${projectId}/work/${workItemId}`);
        }
    }
    
    return (
        <div className="todo-list-item" key = {key}>
            <div className="todo-list-item-left">
                <div className="todo-user-icon">{createUserIcon}</div>
                <div className="todo-content">
                    <div>{createUser.nickname}向你分配了事项 </div>
                    <div className="todo-work-item">
                        <div className="todo-work-title" onClick={() => goTodoDetail()}>{workItemTitle}</div>
                    </div>
                </div>
            </div>
            <div>{receiveTime} </div>
        </div>
    )
}

export default withRouter(TodoListItem);