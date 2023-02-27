/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-08 11:02:27
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-11-09 10:02:15
 */
import React, { useState, useEffect } from "react";
import GideImge from "../../../assets/images/projectGide.png"
import ProjectSetAdd from "./ProjectSetAdd"
import { observer, inject } from "mobx-react";
import "./projectSetGide.scss"
const ProjectSetGide = (props) => {
    const { projectSetStore } = props;
    const { getUseList, visible, setVisible, type, setType } = projectSetStore;
    const [name, setName] = useState("添加项目集")
    /**
     * 添加项目集
     */
    const addProjectSet = () => {
        setVisible(true)
        setType("add")
    }
    useEffect(() => {
        getUseList()
    })
    return (
        <div className="projectSet-gide">
            <div>
                <img src={GideImge} />
            </div>
            <div className="gide-right">
                <div>您还没有项目集合，请先</div>
                {/* <Button type="primary" onClick={() => addProjectSet()}>添加项目集</Button> */}
                <ProjectSetAdd
                    name={name}
                />
            </div>
            {/* <ProjectSetAdd
                visible = {visible}
                setVisible = {setVisible}
                name= {"项目集"}
                type={type}
                setType = {setType}
            /> */}
           
        </div>
    )
}
export default inject('projectSetStore')(observer(ProjectSetGide));