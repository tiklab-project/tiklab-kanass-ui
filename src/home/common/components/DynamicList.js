/*
 * @Descripttion: 动态列表
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 13:36:22
 */

import React, { useEffect, useState } from "react";
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import { inject, observer } from "mobx-react";
import { getUser } from "tiklab-core-ui";
import { Select } from "antd";
import "./DynamicList.scss";

const DynamicList = (props) => {
    const { homeStore } = props;
    const { findLogpage, findProjectList, opLogList } = homeStore;
    const userId = getUser().userId;
    const [projectList, setProjectList] = useState()
    const [firstText, setFirstText] = useState();
    
    useEffect(() => {
        if(props.route.path === "/index/projectDetail/:id/dynamic"){
            setFirstText("项目概况")
            const projectId = props.match.params.id;
            findLogpage({ userId: userId, projectId:  projectId})
            findProjectList().then(res => {
                if (res.code === 0) {
                    setProjectList(res.data)
                }
            })
        }  
        if(props.route.path === "/index/dynamic"){
            setFirstText("首页")
        }

        if(props.route.path === "/index/projectSetdetail/:id/dynamic"){
            setFirstText("项目集概况")
        }
        if(props.route.path === "/index/projectDetail/:id/sprintdetail/:sprint/dynamic"){
            setFirstText("迭代概况")
        }
        return;
    }, [])

    const selectProject = (option) => {
        // getModuleList(option)
        // getsprintlist(option)
        // getSelectUserList(option);
    }

    return (
        <div className="dynamic-list-page">
            <div className="dynamic-list-top">
            <Breadcumb
                {...props}
                firstText={firstText}
                secondText="日志列表"
                // firstUrl="/index/home"
            />
            <div className="dynamic-filter">
                <Select
                    placeholder="项目集"
                    allowClear
                    className="dynamic-select"
                    key="selectProject"
                    onSelect={selectProject}
                    width={100}
                >
                    {
                        projectList && projectList.map((item) => {
                            return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                        })
                    }
                </Select>

                <Select
                    placeholder="项目"
                    allowClear
                    className="dynamic-select"
                    key="selectProject2"
                    onSelect={selectProject}
                    width={100}
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
                    className="dynamic-select"
                    key="selectProject3"
                    onSelect={selectProject}
                    width={100}
                >
                    {
                        projectList && projectList.map((item) => {
                            return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                        })
                    }
                </Select>
                <Select
                    placeholder="事项"
                    allowClear
                    className="dynamic-select"
                    key="selectProject4"
                    onSelect={selectProject}
                    width={100}
                >
                    {
                        projectList && projectList.map((item) => {
                            return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                        })
                    }
                </Select>
            </div>
            </div>
          
            <div className="dynamic-list">
                {
                    opLogList && opLogList.map((item) => {
                        return <div
                            dangerouslySetInnerHTML={{ __html: item.data }}
                            className="dynamic-list-item"
                        />
                    })
                }
            </div>
        </div>
    )
}
export default inject('homeStore')(observer(DynamicList));