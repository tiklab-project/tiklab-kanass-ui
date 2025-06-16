/*
 * @Descripttion: 项目快捷筛选
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:05:35
 */
import React from "react";
import { SelectSimple, SelectItem } from "../../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./ProjectFilterQuick.scss";

const ProjectFilterQuick = (props) => {
    const { projectStore } = props;
    const { projectQuickFilter, setProjectQuickFilter, findProjectPage } = projectStore;

    const quickFilterList = [
        {
            value: "progress",
            label: "进行中"
        },
        {
            value: "noend",
            label: "未结束"
        },
        {
            value: "overdue",
            label: "已逾期"
        }
    ]

    const selectMenu = (item) => {
        setProjectQuickFilter(item)
        
        let params = {
            projectStates: null,
            overdue: false
        }
        if(item){
            const value = item.value;
            switch (value) {
                case "total":
                    params = {
                        projectStates: null,
                        overdue: false,
                        pageParam: {
                            pageSize: 5,
                            currentPage: 1,
                        }
                    }
                    break;
                case "progress":
                    params = {
                        projectStates: ["2"],
                        overdue: false,
                        pageParam: {
                            pageSize: 5,
                            currentPage: 1,
                        }
                    }
                    // setProjectPageParams(params);
                    break;
                case "noend":
                    params = {
                        projectStates: ["1", "2"],
                        overdue: false,
                        pageParam: {
                            pageSize: 5,
                            currentPage: 1,
                        }
                    }
                    break;
                case "overdue":
                    params = {
                        projectStates: ["1", "2"],
                        overdue: true,
                        pageParam: {
                            pageSize: 5,
                            currentPage: 1,
                        }
                    }
                    break;
                default:
                    break;
            }
        }
       
        findProjectPage(params)
    }




    return (<div className="project-quick-filter">
        <SelectSimple name="quickFilter"
            onChange={(value) => selectMenu(value)}
            title={`全部`}
            ismult={false}
            value={projectQuickFilter}
            suffixIcon={true}
        >
            {
                quickFilterList.map(item => {
                    return <SelectItem
                        value={item.value}
                        label={`${item.label}`}
                        key={item.value}

                    />
                })
            }
        </SelectSimple>

    </div>

    )
}
export default withRouter(inject("projectStore")(observer(ProjectFilterQuick)));