

/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-12-13 13:07:30
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 09:39:29
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { observer, inject } from "mobx-react";
import WorkDetailTask from "./workDetailTask";
import WorkDetailDemand from "./workDetailDemand";
import WorkDetailDefect from "./workDetailDefect";
import WorkDetailNomal from "./workDetailNomal";
import WorkDetailEpic from "./workDetailEpic";

const WorkDetail = (props) => {
    const { workStore } = props;
    const { setWorkId, searchWorkById, workId, workIndex, findFormConfig,
        getWorkType, getModuleList, getsprintlist, priority, getSelectUserList } = workStore;
    const [workInfo, setWorkInfo] = useState();
    const [workType, setWorkType] = useState();
    const projectId = localStorage.getItem("projectId");
    const getWorkDetail = (id, index) => {
        searchWorkById(id, index).then((res) => {
            if (res) {
                setWorkId(res.id)
                setWorkInfo(res)
                setWorkType(res.workType.code)
                // findFormConfig({workTypeId: res.workType.id})
            }
        })
    }

    useEffect(() => {
        // getWorkType()
        // getModuleList(projectId)
        // getsprintlist(projectId)
        // getSelectUserList(projectId);
        // priority()
        
        getWorkDetail(workId, workIndex)
        return
    }, [workId]);

    const deatilType = () => {
        if (workType) {
            switch (workType) {
                case "task":
                    return <WorkDetailTask {...props} getWorkDetail={getWorkDetail} workInfo={workInfo} />;
                case "demand":
                    return <WorkDetailDemand {...props} getWorkDetail={getWorkDetail} workInfo={workInfo} />
                case "defect":
                    return <WorkDetailDefect {...props} getWorkDetail={getWorkDetail} workInfo={workInfo} />
                case "epic":
                    return <WorkDetailEpic {...props} getWorkDetail={getWorkDetail} workInfo={workInfo} />
                default:
                    return <WorkDetailNomal {...props} getWorkDetail={getWorkDetail} workInfo={workInfo} />;
            }
        }
    }
    return (
        <Fragment>
            {workInfo && deatilType()}
        </Fragment>
    )
}

export default inject("workStore")(observer(WorkDetail));