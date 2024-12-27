/*
 * @Descripttion: 概况待办事项统计
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:54:41
 */
import React, { useEffect, useState } from 'react';
import "./TodoStatistics.scss";
import { withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import HomeStore from '../store/HomeStore';


const TodoStatistics = (props) => {
    const {isHome} = props;
    const { statisticsTodoWorkByStatus,setActiveKey,  setTodoActiveKey } = HomeStore;
    const [todoCount, setTodoCount] = useState();
    const projectId = props.match.params.id;
    const versionId = props.match.params.version;
    const sprintId = props.match.params.sprint;
    const projectSetId = props.match.params.projectSetId;
    const path = props.match?.path;

    useEffect(()=> {
        let params = {}
        if (path === "/project/:id/overview") {
            params = {
                projectId: projectId
            }
        }
        if (path === "/projectSet/:projectSetId/overview") {
            params = {
                projectSetId: projectSetId
            }
        }

        if (path === "/:id/sprint/:sprint/overview") {
            params = {
                sprintId: sprintId
            }
        }
        if (path === "/:id/version/:version/overview") {
            params = {
                versionId: versionId
            }
        }
        statisticsTodoWorkByStatus(params).then(res => {
            if(res.code === 0){
                console.log(res.data)
                setTodoCount(res.data)
            }
        })
        return null;
    }, [])

    const data = [
        {
            id: "total",
            name: "全部待办",
            icon: "allwork",
            code: "pending",
            tab: 1
        },
        {
            id: "progress",
            name: "进行中",
            icon: "progress",
            code: "progress",
            tab: 1
        },
        {
            id: "end",
            name: "已完成",
            icon: "endwork",
            code: "todo",
            tab: 2
        },
        {
            id: "overdue",
            name: "逾期",
            icon: "overdue",
            code: "overdue",
            tab: 3
        }
    ]

    const goTodoTaskPage = (tabNum) => {
        
        setActiveKey("todoList")
        setTodoActiveKey(tabNum)
        if(path === "/index/overview"){
            props.history.push(`/index/todoList`)
        }
        if (path === "/project/:id/overview") {
            props.history.push(`/project/${projectId}/workTodo`)
        }
        if (path === "/projectSet/:projectSetId/overview") {
            props.history.push(`/projectSet/${projectSetId}/workTodo`)
        }

        if (path === "/:id/sprint/:sprint/overview") {
            props.history.push(`/${projectId}/sprint/${sprintId}/workTodo`)
        }
        if (path === "/:id/version/:version/overview") {
            props.history.push(`/${projectId}/version/${versionId}/workTodo`)
        }
    }
    return (
        <div className="statistics-todotask">
            <div className="statistics-todotask-title">
                我的待办
            </div>
            <div className={`statistics-todotask-content ${isHome ? "statistics-home-todotask-content" : "statistics-project-todotask-content"}`}>
                {
                    data.map(item => {
                        return <div 
                            id = {item.id}
                            className={`statistics-todotask-box ${isHome ? "statistics-home-todotask-box" : "statistics-project-todotask-box"}` }
                            onClick={() => goTodoTaskPage(item.tab)}
                            key = {item.id}
                        >
                            <svg className="icon-40" aria-hidden="true">
                                <use xlinkHref={`#icon-${item.icon}`}></use>
                            </svg>
                            <div className="statistics-todotask-box-right">
                                <div className="statistics-todotask-box-num">{todoCount && todoCount[item.id]}</div>
                                <div className="statistics-todotask-box-name">{item.name}</div>
                            </div>

                        </div>
                    })
                }

            </div>

        </div>
    )
}
export default withRouter(observer(TodoStatistics));