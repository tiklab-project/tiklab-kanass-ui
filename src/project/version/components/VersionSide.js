/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-04-09 15:01:33
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-09 18:11:36
 */
import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import { Input } from 'antd';
import "./versionSide.scss";
import VersionAddmodal from "./versionAdd";
const { Search } = Input;
// console.log(test)
const VersionSide = (props) => {
    const { versionStore, versionList, actionPlanId, setActionPlanId,findVersionlist} = props
    const { addVersion } = versionStore;

    return (
        <div className="plan-aside">
            <div className="plan-title">
                <div className="plan-name">版本</div> 
                <VersionAddmodal
                    name="添加版本"
                    type="add"
                    versionList={versionList}
                    addVersion={addVersion}
                    findVersionlist = {findVersionlist}
                    {...props}
                ></VersionAddmodal>
            </div>

            <div className="plan-search">
                <Search
                    placeholder="请输入版本名称"
                    allowClear
                    style={{ width: 200, margin: '0 10px' }}
                />
            </div>

            <div className="plan-list">
                {
                    versionList && versionList.map(item => {
                        return <div
                            className={`plan-item ${item.id === actionPlanId ? 'plan-actione-item' : ''}`}
                            key={item.id}
                            onClick={() => setActionPlanId(item.id)}
                        >
                            <div>
                                <svg className="svg-icon" aria-hidden="true">
                                    <use xlinkHref={`#icon-plan`}></use>
                                </svg>

                            </div>
                            <div className="plan-item-title">
                                {item.name}
                            </div>
                        </div>
                    })
                }
            </div>

        </div>
    )
}
export default inject("versionStore")(observer(VersionSide));