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
import VersionAddmodal from "./versionAdd"
const { Search } = Input;
const VersionSide = (props) => {
    const { versionStore, versionList, actionPlanId, setActionPlanId,findVersionlist} = props
    const { addVersion, getVersionId, searchVersionById, editVersion } = versionStore
    const projectId = localStorage.getItem("projectId");
    // const [versionList,setVersionList] = useState();
    // const [actionPlanId,setActionPlanId] = useState();
    // useEffect(() => {
    //     // getVersionList({ projectId: projectId }).then(data => {
    //     //     setVersionList(data.data.dataList)
    //     //     debugger
    //     //     getVersionId(data.data.dataList[0].id)
    //     // })
    //     return;
    // }, [])

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
                            className={`plan-item ${item.id === actionPlanId ? `plan-actione-item` : ''}`}
                            key={item.id}
                            onClick={() => setActionPlanId(item.id)}
                        >
                            <div>
                                <svg className="plan-item-icon" aria-hidden="true">
                                    <use xlinkHref="#iconzhishi"></use>
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