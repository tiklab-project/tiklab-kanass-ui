import React, { useEffect, useState } from 'react';
import "./ProjectTodoStatistics.scss";
import { withRouter } from 'react-router';
import { inject, observer } from 'mobx-react';
import HomeStore from '../../../home/common/store/HomeStore';
import ProjectSurveyStore from "../store/ProjectSurveyStore";

const ProjectTodoStatistics = (props) => {
    const { projectId } = props;
    const { setTodoActiveKey } = HomeStore;
    const {statisticsProjectTodoWorkByStatus} = ProjectSurveyStore;
    const [todoCount, setTodoCount] = useState();
    


    useEffect(()=> {
        statisticsProjectTodoWorkByStatus({projectId: projectId}).then(res => {
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
        // props.history.push(`/index/todoList`)
        props.history.push(`/project/${projectId}/workTodo`) 
        // setActiveKey("todoList")
        setTodoActiveKey(tabNum)
    }
    return (
        <div className="project-statistics-todotask">
            <div className="statistics-todotask-title">
                待办统计
            </div>
            <div className="statistics-todotask-content">
                {
                    data.map(item => {
                        return <div 
                            id = {item.id}
                            className="statistics-todotask-box" 
                            onClick={() => goTodoTaskPage(item.tab)}
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
export default withRouter(observer(ProjectTodoStatistics));