/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-08 11:02:27
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-11-09 10:02:15
 */
import React,{Fragment} from "react";
import GideImge from "../../../assets/images/projectGide.png"
import {Button} from "antd"
import ProgramAdd from "./programAdd"
import { observer, inject } from "mobx-react"
const ProjectGide =(props) => {
    const { visible,setVisible,type,setType } = props;
    /**
     * 添加项目集
     */
     const addProgram = () => {
        setVisible(true)
        setType("项目集")
    }
    return (
        <div className="Project-gide">
            <div>
                <img src = {GideImge}/>
            </div>
            <div className= "gide-right">
                <div>您还没有项目集合，请先</div>
                <Button type="primary" onClick={()=>addProgram()}>+添加项目集</Button>
                
            </div>
            <ProgramAdd
                    visible = {visible}
                    setVisible = {setVisible}
                    name= {"项目集"}
                    type={type}
                    setType = {setType}
                />
        </div>
    )
}
export default inject('proStore')(observer(ProjectGide));