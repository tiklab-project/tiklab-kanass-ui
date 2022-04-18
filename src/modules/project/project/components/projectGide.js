/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-08 11:02:27
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-11-09 10:02:15
 */
import React,{Fragment} from "react";
import GideImge from "../../../../assets/images/projectGide.png"
import {Button} from "antd"
import ProjectAddmodal from "./projectAdd"
import { observer, inject } from "mobx-react"
const ProjectGide =(props) => {
    const { proStore } = props;
    const { addProlist, searchpro, projectTypelist, getProjectTypeList, getUseList, uselist } = proStore;
    return (
        <div className="Project-gide">
            <div>
                <img src = {GideImge}/>
            </div>
            <div className= "gide-right">
                <div>您还没有项目，请先</div>
                <ProjectAddmodal
                    name="创建项目"
                    type="add"
                    addProlist={addProlist}
                    searchpro={searchpro}
                    projectTypelist={projectTypelist}
                    getProjectTypeList={getProjectTypeList}
                    getUseList={getUseList}
                    uselist={uselist}
                />
            </div>
        </div>
    )
}
export default inject('proStore')(observer(ProjectGide));