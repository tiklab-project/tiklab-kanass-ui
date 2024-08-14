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
import Button from "../../../common/button/Button";
import { observer, inject } from "mobx-react";
import "./projectSetGide.scss"
import { withRouter } from "react-router";
const ProjectSetGide = (props) => {
    const [name, setName] = useState("添加项目集")


    return (
        <div className="projectSet-gide">
            <div>
                <img src={GideImge} />
            </div>
            <div className="gide-right">
                <div>您还没有项目集合，请先</div>
                <Button
                    style={{ width: "fit-content" }}
                    type="primary" onClick={() => props.history.push("/index/projectSetAdd")} buttonText={name} >
                </Button>
            </div>

        </div>
    )
}
export default withRouter(observer(ProjectSetGide));