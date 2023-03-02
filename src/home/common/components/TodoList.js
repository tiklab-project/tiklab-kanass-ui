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
import { Empty, Select } from "antd";
import { inject, observer } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import "./TodoList.scss"
import { withRouter } from "react-router";
const TodoList = (props) => {
    const { homeStore } = props;
    const { findTodopage, todoTaskList, findProjectList, findSprintList, findProjectSetList, findProjectSetProjectList } = homeStore;
    //登录者id
    const userId = getUser().userId;
    // 项目集列表
    const [projectSetList, setProjectSetList] = useState()
    // 项目列表
    const [projectList, setProjectList] = useState();
    // 迭代列表
    const [sprintList, setSprintList] = useState()
    // 面包屑第一个标题
    const [firstText, setFirstText] = useState();

    useEffect(() => {
        getSerchList()

        // 根据不同的url 设置不同的面包屑
        if(props.route?.path === "/index/projectScrumDetail/:id/workTodo" || props.route?.path === "/index/projectNomalDetail/:id/workTodo"){
            const projectId = props.match.params.id;
            setFirstText("项目概况")
            findTodopage({ userId: userId, projectId:  projectId })
        }  
        if(props.match?.path === "/index/home/todoList"){
            setFirstText(null)
            findTodopage({ userId: userId})
        }

        if(props.route?.path === "/index/projectSetdetail/:id/workTodo"){
            setFirstText("项目集概况")
        }

        if(props.route?.path === "/index/:id/sprintdetail/:sprint/workTodo"){
            setFirstText("迭代概况")
        }
        return;
    }, [])

    /**
     * 获取搜索参数的列表
     */
    const getSerchList = () => {
        findProjectSetList({}).then(res => {
            if(res.code === 0){
                setProjectSetList(res.data)
            }
        })
        findProjectList().then(res => {
            if(res.code === 0){
                setProjectList(res.data)
            }
        })
        findSprintList({}).then(res => {
            if(res.code === 0){
                setSprintList(res.data)
            }
        })
    }

    /**
     * 筛选待办事项
     * @param {搜索字段} key 
     * @param {搜索值} value 
     */
    const searchTodo = (key,value) => {
        const params = {
            [key]: value
        }
        findTodopage({}, params)
    }

    /**
     * 筛选不同项目集的待办
     * @param {项目集id} value 
     */
    const searchProjectSet = (value) => {
        findProjectSetProjectList({projectSetId: value})
    }

    /**
     * 跳转的待办详情
     * @param {跳转地址} url 
     */
    const goTodoDetail = (url) => {
        window.location.href = url
    }

    return (
        <div className="todo-list-page">
            {
                firstText &&  <Breadcumb
                    {...props}
                    firstText={firstText}
                    secondText="待办列表"
                    // firstUrl = "/index/home"
                />
            }
           
            <div className="todo-filter">
                <Select
                    placeholder="项目集"
                    allowClear
                    className="todo-select"
                    key="projectSet"
                    onSelect={(value) => searchProjectSet(value)}
                    width = {100}
                >
                    {
                        projectSetList && projectSetList.map((item) => {
                            return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                        })
                    }
                </Select>

                <Select
                    placeholder="项目"
                    allowClear
                    className="todo-select"
                    key="project"
                    onSelect={(value) => searchTodo("projectId", value)}
                    width = {100}
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
                    width = {100}
                    onSelect={(value) => searchTodo("sprintId", value)}
                    // bordered={fieldName === "project" ? true : false}
                    // showArrow={fieldName === "project" ? true : false}
                    // onMouseEnter={() => changeStyle("project")}
                    // onMouseLeave={() => setFieldName("")}
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
                        return <div
                            dangerouslySetInnerHTML={{ __html: item.data }}
                            className="todo-item"
                            onClick={() => goTodoDetail(item.link)}
                        />
                    })
                    :
                    <Empty image="/images/nodata.png" description="暂时没有待办~" />
                }
            </div>
        </div>
    )
}
export default withRouter(inject('homeStore')(observer(TodoList)));