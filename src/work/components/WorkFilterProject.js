import React, { useEffect, useState, useRef } from "react";
import { SelectSimple, SelectItem } from "../../common/select";
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
import "./WorkFilterProject.scss";
import setImageUrl from "../../common/utils/setImageUrl";
import { searchWorkList } from "./WorkSearch";

const WorkFilterProject = (props) => {
    const { workStore, heightFilter } = props;
    const { findProjectList, projectList } = workStore;


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
        searchWorkList(workStore, values)
    }



    return (<div className="work-project-filter">
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