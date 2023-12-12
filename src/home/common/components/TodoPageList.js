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
const TodoList = (props) => {
    const { homeStore } = props;
    const { findTodopage, todoTaskList, findProjectList, findSprintList, findProjectSetList,
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

    useEffect(() => {
        getSerchList()
        const params = {
            userId: userId,
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
            findTodopage({ ...params, content: { projectId: projectId } })
        }
        console.log(props.match?.path)
        if (props.match?.path === "/home/todoList") {
            setFirstText("首页")
            findTodopage(params)
        }

        if (props.route?.path === "/projectSetdetail/:projectSetId/workTodo") {
            setFirstText("项目集概况")
            findTodopage(params)
        }

        if (props.route?.path === "/:id/sprintdetail/:sprint/workTodo") {
            setFirstText("迭代概况")
        }
        return;
    }, [])

    /**
     * 获取搜索参数的列表
     */
    const getSerchList = () => {
        findProjectList().then(res => {
            if (res.code === 0) {
                setProjectList(res.data)
            }
        })
        findSprintList({}).then(res => {
            if (res.code === 0) {
                setSprintList(res.data)
            }
        })
    }

    const changeProject = (value) => {
        setSprintValue(null)
        findSprintList({ projectId: value }).then(res => {
            if (res.code === 0) {
                setSprintList(res.data)
            }
        })
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
            content: {
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

    return (<div className="todo-list-page">
        {/* <Breadcumb
            {...props}
            firstText={firstText}
            secondText="待办事项"
        /> */}
        <div className="todo-filter">
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

            <Select
                placeholder="迭代"
                allowClear
                className="todo-select"
                key="sprint"
                width={200}
                onChange={(value) => changeSprint(value)}
                value={sprintValue}
            >
                {
                    sprintList && sprintList.map((item) => {
                        return <Select.Option value={item.id} key={item.id}>{item.sprintName}</Select.Option>
                    })
                }
            </Select>
        </div>
        <div className="todo-list">
            {
                todoTaskList && todoTaskList.length > 0 ? todoTaskList.map((item) => {
                    return <TodoListItem content = {item.data} goTodoDetail = {()=>goTodoDetail(item.workItemId)}/>
                })
                    :
                    <Empty image="/images/nodata.png" description="暂时没有待办~" />
            }
        </div>
        <div className="todo-pagination">
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

    </div>

    )
}
export default withRouter(inject('homeStore')(observer(TodoList)));