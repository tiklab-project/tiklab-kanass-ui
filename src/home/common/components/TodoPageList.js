/*
 * @Descripttion: 待办事项列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-25 14:38:38
 */

import React, { useEffect, useState } from "react";
import { Empty, Select, Row, Col, Pagination, Spin } from "antd";
import { inject, observer } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import { withRouter } from "react-router";
import "./TodoPageList.scss"
import TodoListItem from "../../../common/overviewComponent/TodoListItem";
import Breadcrumb from "../../../common/breadcrumb/Breadcrumb";
import ProjectEmpty from "../../../common/component/ProjectEmpty";
import PaginationCommon from "../../../common/page/Page";
const TodoPageList = (props) => {
    const { homeStore } = props;
    const { findTodopage, todoTaskList, setTodoTaskList, findProjectList,
        findProjectSetProjectList, todoTotal, todoCondition, todoActiveKey, setTodoActiveKey } = homeStore;
    //登录者id
    const userId = getUser().userId;
    // 项目列表
    const [projectList, setProjectList] = useState();
    const [sprintValue, setSprintValue] = useState();
    const [loading, setLoading] = useState(true)
    // 面包屑第一个标题
    const [firstText, setFirstText] = useState();
    const projectId = props.match.params.id;
    const versionId = props.match.params.version;
    const sprintId = props.match.params.sprint;
    const path = props.match?.path;
    // const [todoTaskList, setTodoTaskList] = useState([])
    useEffect(() => {
        getSerchList()
        let params = {
            status: 1,
            assignUserId: userId,
            pageParam: {
                pageSize: 20,
                currentPage: 1
            },
            data: null
        }
        if (todoActiveKey === 3) {
            params = {
                ...params,
                status: 1,
                isExpire: 2,
            }
        } else {
            params = {
                ...params,
                status: todoActiveKey,
                isExpire: 0
            }
        }

        setLoading(true)
        // 根据不同的url 设置不同的面包屑
        if (props.route?.path === "/project/:id/workTodo") {
            const projectId = props.match.params.id;
            setFirstText("项目概况")
            findTodopage({ ...params, data: { projectId: projectId } }).then(res => {
                setLoading(false)
            })
        }
        if (path === "/index/todoList") {
            setFirstText("首页")
            findTodopage(params).then(res => {
                setLoading(false)
            })
        }

        if (props.route?.path === "/projectSet/:projectSetId/workTodo") {
            setFirstText("项目集概况")
            const projectSetId = props.match.params.projectSetId;
            setTodoTaskList([])
            findProjectSetProjectList({ projectSetId: projectSetId }).then(res => {
                if (res.code === 0) {
                    const list = res.data;
                    if (list.length > 0) {
                        let todos = []
                        list.map(item => {
                            findTodopage({ assignUserId: userId, data: { projectId: item.id } }, "projectSet").then(res => {
                                if (res.code === 0) {
                                    todos.push(...res.data.dataList)
                                    setTodoTaskList([...todos])
                                }
                            })
                        })
                       
                    } else {
                        setTodoTaskList([])
                    }
                }
                setLoading(false)
            })
        }

        if (props.route?.path === "/:id/sprint/:sprint/workTodo") {
            setFirstText("迭代概况")
            findTodopage({ ...params, data: { sprintId: sprintId, projectId: projectId } }).then(res => {
                setLoading(false)
            })
        }
        if (props.route?.path === "/:id/version/:version/workTodo") {
            setFirstText("版本概况")
            findTodopage({ ...params, data: { versionId: versionId, projectId: projectId } }).then(res => {
                setLoading(false)
            })
        }
        return;
    }, [])

    const getTodoList = (value) => {
        setTodoActiveKey(value)
        if (value === 3) {
            const params = {
                assignUserId: userId,
                status: 1,
                isExpire: 2,
                pageParam: {
                    pageSize: 10,
                    currentPage: 1
                }
            }
            findTodopage(params, null)
        } else {
            findTodopage({
                assignUserId: userId,
                status: value,
                isExpire: 0,
                pageParam: {
                    pageSize: 10,
                    currentPage: 1
                }
            }, null)

        }

    }
    /**
     * 获取搜索参数的列表
     */
    const getSerchList = () => {
        if (path === "/index/todoList") {
            findProjectList().then(res => {
                if (res.code === 0) {
                    setProjectList(res.data)
                }
            })
        }
        if (path === "/projectSet/:projectSetId/workTodo") {
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
    // const getTodoList = (value) => {
    //     setTodoActiveKey(value)
    //     findTodopage({status: value, pageParam: {
    //             pageSize: 20,
    //             currentPage: 1
    //         }
    //     },)
    // }




    return (<div className="todo-list-page">
        {
            path !== "/index/todoList" && <Breadcrumb
                {...props}
                firstText={firstText}
                secondText="待办事项"
            />
        }

        <div className="todo-list-top">
            <div className="todo-tab">
                <div className={`todo-tab-item ${todoActiveKey === 1 ? 'todo-tab-select' : ''}`} onClick={() => getTodoList(1)}>进行中</div>
                <div className={`todo-tab-item ${todoActiveKey === 2 ? 'todo-tab-select' : ''}`} onClick={() => getTodoList(2)}>完成</div>
                <div className={`todo-tab-item ${todoActiveKey === 3 ? 'todo-tab-select' : ''}`} onClick={() => getTodoList(3)}>逾期</div>
            </div>
            <div className="todo-filter">
                {
                    (path === "/index/todoList" || path === "/projectSet/:projectSetId/workTodo") &&
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
        <Spin spinning={loading} tip="加载中..." >
            <div className="todo-list">
                {
                    todoTaskList && todoTaskList.length > 0 ? todoTaskList.map((item) => {
                        return <>
                            <TodoListItem content={item.data} goTodoDetail={() => goTodoDetail(item.workItemId)} key={item.id} />
                        </>

                    })
                        :
                        <>
                            {
                                loading && <ProjectEmpty description="暂时没有待办~" />
                            }
                        </>
                }
            </div>
        </Spin>
        {
            todoTaskList && todoTaskList.length > 0 && <div className="todo-pagination">

                <PaginationCommon
                    currentPage={todoCondition.pageParam.currentPage}
                    changePage={(currentPage) => onPageChange(currentPage)}
                    totalPage={todoCondition.pageParam.totalPage}
                    total={todoCondition.pageParam.total}
                    showRefer={false}
                />
            </div>
        }

    </div>

    )
}
export default withRouter(inject('homeStore')(observer(TodoPageList)));