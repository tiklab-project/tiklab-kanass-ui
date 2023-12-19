/*
 * @Descripttion: 待办事项列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { useEffect, useState } from "react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { Empty, Select, Row, Col, Pagination } from "antd";
import { inject, observer } from "mobx-react";
import { getUser } from "thoughtware-core-ui";
import { withRouter } from "react-router";
import "./TodoPageList.scss"
import TodoListItem from "../../../common/overviewComponent/TodoListItem";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
const TodoList = (props) => {
    const { homeStore } = props;
    const { findTodopage, todoTaskList,setTodoTaskList, findProjectList,findSprintList, findProjectSetList,
        findProjectSetProjectList, todoTotal, todoCondition } = homeStore;
    //登录者id
    const userId = getUser().userId;
    // 项目列表
    const [projectList, setProjectList] = useState();
    // 迭代列表
    const [sprintList, setSprintList] = useState();
    const [sprintValue, setSprintValue] = useState()
    // 面包屑第一个标题
    const [firstText, setFirstText] = useState();
    const projectId = props.match.params.id;
    const versionId = props.match.params.version;
    const sprintId = props.match.params.sprint;
    console.log(props)
    const path = props.match?.path
    // const [todoTaskList, setTodoTaskList] = useState([])
    useEffect(() => {
        getSerchList()
        const params = {
            status: 1,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            },
            content: null
        }
        // 根据不同的url 设置不同的面包屑
        if (props.route?.path === "/projectDetail/:id/workTodo") {
            const projectId = props.match.params.id;
            setFirstText("项目概况")
            findTodopage({ ...params, data: { projectId: projectId } })
        }
        if (path === "/home/todoList") {
            setFirstText("首页")
            findTodopage(params)
        }

        if (props.route?.path === "/projectSetdetail/:projectSetId/workTodo") {
            setFirstText("项目集概况")
            const projectSetId = props.match.params.projectSetId;
            setTodoTaskList([])
            findProjectSetProjectList({ projectSetId: projectSetId }).then(res => {
                if (res.code === 0) {
                    const list = res.data;
                    if (list.length > 0) {
                        let todos = []
                        list.map(item => {
                            findTodopage({data: {projectId: item.id} }, "projectSet").then(res => {
                                if (res.code === 0) {
                                    console.log(todoTaskList)
                                    todos.push(...res.data.dataList)
                                    setTodoTaskList([...todos])
                                }
                            })
                        })
                    }else {
                        setTodoTaskList([])
                    }
                }
            })
        }

        if (props.route?.path === "/:id/sprintdetail/:sprint/workTodo") {
            setFirstText("迭代概况")
            findTodopage({ ...params, data: { sprintId: sprintId, projectId: projectId } })
        }
        if (props.route?.path === "/:id/versiondetail/:version/workTodo") {
            setFirstText("版本概况")
            findTodopage({ ...params, data: { versionId: versionId, projectId: projectId } })
        }
        return;
    }, [])

    /**
     * 获取搜索参数的列表
     */
    const getSerchList = () => {
        if(path === "/home/todoList") {
            findProjectList().then(res => {
                if (res.code === 0) {
                    setProjectList(res.data)
                }
            })
        }
        if(path === "/projectSetdetail/:projectSetId/workTodo"){
            const projectSetId = props.match.params.projectSetId;
            findProjectSetProjectList({ projectSetId: projectSetId }).then(res => {
                if (res.code === 0) {
                    setProjectList(res.data)
                }
            })
        }
       
    }

    const changeProject = (value) => {
        setSprintValue(null)
        // findSprintList({ projectId: value }).then(res => {
        //     if (res.code === 0) {
        //         setSprintList(res.data)
        //     }
        // })
        searchTodo("projectId", value)
    }

    const changeSprint = (value) => {
        setSprintValue(value)
        searchTodo("sprintId", value)
    }

    /**
     * 筛选待办事项
     * @param {搜索字段} key 
     * @param {搜索值} value 
     */
    const searchTodo = (key, value) => {
        const params = {
            data: {
                [key]: value
            }
        }
        findTodopage(params)
    }

    /**
     * 筛选不同项目集的待办
     * @param {项目集id} value 
     */
    // const searchProjectSet = (value) => {
    //     findProjectSetProjectList({ projectSetId: value }).then(res => {
    //         if(res.code === 0){
    //             setProjectList(res.code)
    //         }
    //     })
    // }

    /**
     * 跳转的待办详情
     * @param {跳转地址} url 
     */
    // const goTodoDetail = (url) => {
    //     window.location.href = url
    // }

    const onPageChange = (page, pageSize) => {
        const params = {
            pageParam: {
                pageSize: 20,
                currentPage: page
            }

        }
        findTodopage(params)
    };
    const getTodoList = (value) => {
        console.log(value)
        setActiveKey(value)
        findTodopage({
            userId: userId, status: value, pageParam: {
                pageSize: 20,
                currentPage: 1
            }
        },)
    }
    const [activeKey, setActiveKey] = useState(1)
    return (<div className="todo-list-page">
        {
            path !== "/home/todoList" && <Breadcrumb
                {...props}
                firstText={firstText}
                secondText="待办事项"
            />
        }

        <div className="todo-list-top">
            <div className="todo-tab">
                <div className={`todo-tab-item ${activeKey === 1 ? 'todo-tab-select' : ''}`} onClick={() => getTodoList(1)}>进行中</div>
                <div className={`todo-tab-item ${activeKey === 2 ? 'todo-tab-select' : ''}`} onClick={() => getTodoList(2)}>完成</div>
                <div className={`todo-tab-item ${activeKey === 3 ? 'todo-tab-select' : ''}`} onClick={() => getTodoList(3)}>逾期</div>
            </div>
            <div className="todo-filter">
                {
                   ( path === "/home/todoList" || path === "/projectSetdetail/:projectSetId/workTodo") &&
                    <Select
                        placeholder="项目"
                        allowClear
                        className="todo-select"
                        key="project"
                        onChange={(value) => changeProject(value)}
                        width={200}
                    >
                        {
                            projectList && projectList.map((item) => {
                                return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                            })
                        }
                    </Select>
                }

            </div>
        </div>

        <div className="todo-list">
            {
                todoTaskList && todoTaskList.length > 0 ? todoTaskList.map((item) => {
                    return <>
                        <TodoListItem content={item.data} goTodoDetail={() => goTodoDetail(item.workItemId)} />
                    </>

                })
                    :
                    <Empty image="/images/nodata.png" description="暂时没有待办~" />
            }
        </div>
        {
            todoTaskList && todoTaskList.length > 0 && <div className="todo-pagination">
                <Pagination
                    onChange={onPageChange}
                    defaultCurrent={1}
                    total={todoTotal}
                    current={todoCondition.pageParam.currentPage}
                    showSizeChanger={false}
                    defaultPageSize={20}
                    pageSize={20}
                />
            </div>
        }

    </div>

    )
}
export default withRouter(inject('homeStore')(observer(TodoList)));