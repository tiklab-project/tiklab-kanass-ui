import React, { Fragment } from "react";
import moment from "moment";
import "./dynamic.scss"
import { inject, observer } from "mobx-react";

const WorkItemDynamic = (props) => {
    const { dynamicData } = props;
   
    const goToWorkItem = (id, project,type) => {
        if(type === "workItem"){
            localStorage.setItem("projectId", project.id)
            localStorage.setItem("projectTypeId", project.projectType.id)
            // setWorkId(id)
            // setWorkIndex(1)
            props.history.push(`/index/prodetail/workone/${id}`)
        }
    }
    //区分动态类型
    const dynamicList = (dynamicData) =>{
        let itemHtml = ""
        switch(dynamicData.dynamicType){
            case "add":
                itemHtml = (
                    <div className="dynamic-item" key={dynamicData.id}>
                        <div className="dynamic-item-title">
                            <div className="dynamic-item-title-left">
                                <span className="dynamic-user">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-icontouxiang1"></use>
                                    </svg>
                                    <span className = "dynamic-user-name">{dynamicData.user.name}</span>
                                </span> 创建了 
                                <span className="dynamic-title" onClick={() => goToWorkItem(dynamicData.modelId, dynamicData.project, dynamicData.model)}>{dynamicData.name}</span>
                            </div>
                            <div>
                                {dynamicData.dynamicTime}
                            </div>
                        </div>
                        <div className="dynamic-type">事项</div>
                    </div>
                    
                )
                break;
            case "delete":
                itemHtml = (
                    <div className="dynamic-item" key={dynamicData.id}>
                        <div className="dynamic-item-title">
                            <div className="dynamic-item-title-left">
                                <span className="dynamic-user">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-icontouxiang1"></use>
                                    </svg>
                                    <span className = "dynamic-user-name">{dynamicData.user.name}</span>
                                </span>  删除了 
                                <span>{dynamicData.name}</span>
                            </div>
                            <div>
                                {dynamicData.dynamicTime}
                            </div>
                        </div>
                        <div className="dynamic-type">事项</div>
                    </div>
                    
                )
                break;
            case "update":
                itemHtml = updateField(dynamicData)
                break;
        }
        return itemHtml;
    }

        //区分更新字段表现方式
    const updateField = (dynamicData) => {
        const dynamicContent = JSON.parse(dynamicData.data);
        let content = "";
        switch(dynamicContent.key){
            case "title":
                content = (
                    <div className="dynamic-item" key={dynamicData.id}>
                        <div className="dynamic-item-title">
                            <div className="dynamic-item-title-left">
                                <span className="dynamic-user">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-icontouxiang1"></use>
                                    </svg>
                                    <span className = "dynamic-user-name">{dynamicData.user.name}</span>
                                </span> 更新了 
                                <span className="dynamic-title" onClick={() => goToWorkItem(dynamicData.modelId, dynamicData.project, dynamicData.model)}>{dynamicData.name}</span> 名称
                            </div>
                            <div>
                                {dynamicData.dynamicTime}
                            </div>
                        </div>
                        <div className="update-content">{dynamicContent.oldValue ? dynamicContent.oldValue : "无"} --- {dynamicContent.newValue}</div>
                    </div>
                )
                break;
            case "workPriority":
                content = (
                    <div className="dynamic-item" key={dynamicData.id}>
                        <div className="dynamic-item-title">
                            <div className="dynamic-item-title-left">
                                <span className="dynamic-user">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-icontouxiang1"></use>
                                    </svg>
                                    <span className = "dynamic-user-name">{dynamicData.user.name}</span>
                                </span> 更新了 
                                <span className="dynamic-title" onClick={() => goToWorkItem(dynamicData.modelId, dynamicData.project, dynamicData.model)}>{dynamicData.name}</span> 优先级
                            </div>
                            <div>
                                {dynamicData.dynamicTime}
                            </div>
                        </div>
                        <div className="update-content">{dynamicContent.oldValue ? dynamicContent.oldValue.name : "无"} --- {dynamicContent.newValue.name}</div>
                    </div>
                    
                )
                break;
            case "workStatus":
                content = (
                    <div className="dynamic-item" key={dynamicData.id}>
                        <div className="dynamic-item-title">
                            <div className="dynamic-item-title-left">
                                <span className="dynamic-user">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-icontouxiang1"></use>
                                    </svg>
                                    <span className = "dynamic-user-name">{dynamicData.user.name}</span>
                                </span> 更新了 
                                <span className="dynamic-title" onClick={() => goToWorkItem(dynamicData.modelId, dynamicData.project, dynamicData.model)} >{dynamicData.name}</span> 状态
                            </div>
                            <div>
                                {dynamicData.dynamicTime}
                            </div>
                        </div>
                        
                        <div className="update-content">{dynamicContent.oldValue ? dynamicContent.oldValue.name : "无"} --- {dynamicContent.newValue.name}</div>
                    </div>
                )
                break;
            case "module":
                content = (
                    <div className="dynamic-item" key={dynamicData.id}>
                        <div className="dynamic-item-title">
                            <div className="dynamic-item-title-left">
                                <span className="dynamic-user">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-icontouxiang1"></use>
                                    </svg>
                                    <span className = "dynamic-user-name">{dynamicData.user.name}</span>
                                </span> 更新了 
                                <span className="dynamic-title" onClick={() => goToWorkItem(dynamicData.modelId, dynamicData.project, dynamicData.model)}>{dynamicData.name}</span> 模块
                            </div>
                            <div>
                                {dynamicData.dynamicTime}
                            </div>
                        </div>
                        
                        <div className="update-content">{dynamicContent.oldValue ? dynamicContent.oldValue.moduleName : "无"} --- {dynamicContent.newValue.moduleName}</div>
                    </div>
                )
                break;
            case "sprint":
                content = (
                    <div className="dynamic-item" key={dynamicData.id}>
                        <div className="dynamic-item-title">
                            <div className="dynamic-item-title-left">
                                <span className="dynamic-user">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-icontouxiang1"></use>
                                    </svg>
                                    <span className = "dynamic-user-name">{dynamicData.user.name}</span>
                                </span> 更新了 
                                <span className="dynamic-title" onClick={() => goToWorkItem(dynamicData.modelId, dynamicData.project, dynamicData.model)}>{dynamicData.name}</span>  迭代
                            </div>
                            
                            <div>
                                {dynamicData.dynamicTime}
                            </div>
                        </div>
                        
                        <div className="update-content">{dynamicContent.oldValue ? dynamicContent.oldValue.sprintName : "无"} --- {dynamicContent.newValue.sprintName}</div>
                    </div>
                )
                break;
            case "percent":
                content = (
                    <div className="dynamic-item" key={dynamicData.id}>
                        <div className="dynamic-item-title">
                            <div className="dynamic-item-title-left">
                                <span className="dynamic-user">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-icontouxiang1"></use>
                                    </svg>
                                    <span className = "dynamic-user-name">{dynamicData.user.name}</span>
                                </span> 更新了 
                                <span className="dynamic-title" onClick={() => goToWorkItem(dynamicData.modelId, dynamicData.project, dynamicData.model)}>{dynamicData.name}</span> 进度</div>
                            <div>
                                {dynamicData.dynamicTime}
                            </div>
                        </div>
                        
                        <div className="update-content">{dynamicContent.oldValue ? dynamicContent.oldValue : "无"} --- {dynamicContent.newValue}</div>
                    </div>
                )
                break;
            case "planTakeupTime":
                content = (
                    <div className="dynamic-item" key={dynamicData.id}>
                        <div className="dynamic-item-title">
                            <div className="dynamic-item-title-left">
                                <span className="dynamic-user">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-icontouxiang1"></use>
                                    </svg>
                                    <span className = "dynamic-user-name">{dynamicData.user.name}</span>
                                </span> 更新了 
                                <span className="dynamic-title" onClick={() => goToWorkItem(dynamicData.modelId, dynamicData.project, dynamicData.model)}>{dynamicData.name}</span> 计划用时</div>
                            <div>
                                {dynamicData.dynamicTime}
                            </div>
                        </div>
                        
                        <div className="update-content">{dynamicContent.oldValue ? dynamicContent.oldValue : "无"} --- {dynamicContent.newValue}</div>
                    </div>
                )
                break;
            case "reporter":
                content = (
                    <div className="dynamic-item" key={dynamicData.id}>
                        <div className="dynamic-item-title">
                            <div className="dynamic-item-title-left">
                                <span className="dynamic-user">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-icontouxiang1"></use>
                                    </svg>
                                    <span className = "dynamic-user-name">{dynamicData.user.name}</span>
                                </span> 更新了 
                                <span className="dynamic-title" onClick={() => goToWorkItem(dynamicData.modelId, dynamicData.project, dynamicData.model)}>{dynamicData.name}</span> 报告人
                            </div>
                            <div>
                                {dynamicData.dynamicTime}
                            </div>
                        </div>
                        
                        <div className="update-content">{dynamicContent.oldValue ? dynamicContent.oldValue.name : "无"} --- {dynamicContent.newValue.name}</div>
                    </div>
                )
                break;
            case "planEndTime":
                content = (
                    <div className="dynamic-item" key={dynamicData.id}>
                        <div className="dynamic-item-title">
                            <div className="dynamic-item-title-left">
                                <span className="dynamic-user">
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref="#icon-icontouxiang1"></use>
                                    </svg>
                                    <span className = "dynamic-user-name">{dynamicData.user.name}</span>
                                </span> 更新了 
                                <span className="dynamic-title" onClick={() => goToWorkItem(dynamicData.modelId, dynamicData.project, dynamicData.model)}>{dynamicData.name}</span>  结束时间
                            </div>
                            <div>
                                {dynamicData.dynamicTime}
                            </div>
                        </div>
                        <div className="update-content">{dynamicContent.oldValue ? moment(dynamicContent.oldValue).format('YYYY-MM-DD') : "无"} --- {moment(dynamicContent.newValue).format('YYYY-MM-DD')}</div>
                    </div>
                )
                break;
        }
        return content;
    }
    return(
        <Fragment>
            {
                dynamicList(dynamicData)
            }
        </Fragment>
        
    )
}

export default WorkItemDynamic;