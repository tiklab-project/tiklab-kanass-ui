import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./WorkFilterQuick.scss";
import setImageUrl from "../../common/utils/setImageUrl";

const WorkFilterProject = (props) => {
    const { workStore, heightFilter } = props;
    const { findProjectList, projectList, viewType, getWorkConditionPage, getWorkConditionPageTree,
          workShowType, setWorkIndex, setWorkId  } = workStore;


    useEffect(() => {
        findProjectList()
        return;
    }, [])

    const selectChange = (value) => {
        if(value){
            search({
                projectId: value.value,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            })
        }else {
            search({
                projectId: null,
                pageParam: {
                    pageSize: 20,
                    currentPage: 1
                }
            })
        }
        
    }

    const search = values => {
        if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
            getWorkConditionPageTree(values).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }

                }
            })
        }
        if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
            getWorkConditionPage(values).then((res) => {
                if (workShowType === "list") {
                    if (res.dataList.length > 0) {
                        setWorkId(res.dataList[0].id)
                        setWorkIndex(1)
                    }
                }
            })
        }
        if (workShowType === "bodar") {
            getWorkBoardList(values)
        }
        if (workShowType === "time") {
            getWorkGanttListTree(values)
        }
    }



    return (<div className="work-quick-filter">
        <SelectSimple name="projectId"
            onChange={(value) => selectChange(value)}
            title={"项目"}
            ismult={false}
            suffixIcon = {true}
        >
            {
                projectList.map(item => {
                    return <SelectItem
                        value={item.id}
                        label={item.projectName}
                        key={item.id}
                        imgUrl={setImageUrl(item.iconUrl)}
                    />
                })
            }
        </SelectSimple>

    </div>

    )
}
export default withRouter(inject("workStore")(observer(WorkFilterProject)));