/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-08 11:02:27
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-11-09 10:02:15
 */
import React,{Fragment} from "react";
import GideImge from "../../../assets/images/projectGide.png";
import Button from "../../../common/button/Button";
import { observer, inject } from "mobx-react"
import { withRouter } from "react-router";
const ProjectGide =(props) => {
    const { projectStore } = props;
    return (
        <div className="project-gide">
            <div>
                <img src = {GideImge}/>
            </div>
            <div className= "gide-right">
                <div>您还没有项目，请先</div>
                <Button type="primary" onClick={() => props.history.push("/index/projectAdd")} buttonText={"添加项目"} >
                </Button>
            </div>
        </div>
    )
}
export default withRouter(inject('projectStore')(observer(ProjectGide)));