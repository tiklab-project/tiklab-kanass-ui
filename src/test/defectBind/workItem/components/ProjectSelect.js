import React, {useEffect, useState} from "react";
import {Select} from "antd";
import {inject, observer} from "mobx-react";
const {Option} = Select

const ProjectSelect = (props)=>{
    const {workItemStore,clickProject} = props
    const {findProjectList} = workItemStore;

    const [projectList, setProjectList] = useState([]);
    const repositoryId = sessionStorage.getItem("repositoryId")

    const showOption = (list) =>{
        return list&&list.map((item,index)=>(
            <Option
                key={index}
                value={item.id}
            >
                {item.name}
            </Option>
        ))
    }

    const onSearch =()=>{
        findProjectList({repositoryId:repositoryId}).then(list=>{
            setProjectList(list)
        })
    }

    return(
        <Select
            placeholder="项目"
            onSelect={clickProject}
            onFocus={onSearch}
            style={{width:"100%"}}
        >
            <Option
                key={"null"}
                value={null}
            >
                所有
            </Option>
            {
                showOption(projectList)
            }
        </Select>
    )
}

export default  inject("workItemStore")(observer(ProjectSelect));