import React from "react";
import "./TodoListItem.scss"
import { withRouter } from "react-router";
const TodoListItem = (props) => {
    const { content, model } = props;
    const data = JSON.parse(content)
    const { createUserIcon, createUser, workItemTitle, receiveTime, workItemId, projectId } = data;
    const sprintId = props.match.params.sprint ? props.match.params.sprint : null;
    const versionId = props.match.params.version ? props.match.params.version : null;
    const goTodoDetail = () => {
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
    return (
        <div className="todo-list-item" >
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