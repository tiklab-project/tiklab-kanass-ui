import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./ProjectFilterQuick.scss"
import { getUser } from "thoughtware-core-ui";

const ProjectFilterQuick = (props) => {
    const { projectStore } = props;
    const { projectQuickFilter, setProjectQuickFilter, findJoinProjectList } = projectStore;
    console.log(projectQuickFilter)
    const userId = getUser().userId;

    const quickFilterList = [
        // {
        //     value: "total",
        //     label: "全部"
        // },
        {
            value: "progress",
            label: "进行中"
        },
        {
            value: "noend",
            label: "未结束"
        },
        // {
        //     value: "creat",
        //     label: "我创建的"
        // },
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
                        overdue: false
                    }
                    break;
                case "progress":
                    params = {
                        projectStates: ["2"],
                        overdue: false
                    }
                    // setProjectPageParams(params);
                    break;
                case "noend":
                    params = {
                        projectStates: ["1", "2"],
                        overdue: false
                    }
                    break;
                case "overdue":
                    params = {
                        projectStates: ["1", "2"],
                        overdue: true
                    }
                    break;
                default:
                    break;
            }
        }
       
        findJoinProjectList(params)
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