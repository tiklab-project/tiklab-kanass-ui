import React, { useEffect, useState } from "react";
import { List, SafeArea, Dialog } from 'antd-mobile';
import { withRouter } from "react-router";
import { inject, observer } from "mobx-react";
import "./systemSet.scss"
import { getUser } from "tiklab-core-ui";
const SystemSet = (props) => {
    const {systemSetStore} = props;
    // const {findUser} = systemSetStore;

    useEffect(()=> {
        // findUser(getUser().userId).then(res => {
        //     if(res.code === 0){
        //         console.log(res)
        //     }
        // })
    },[])

    return (
        <div className="systemset-set">
            <div style={{ background: '#ace0ff' }}>
                <SafeArea position='top' />
            </div>
            <div className="systemset-top">
                <div className="systemset-top-left">
                    <svg className="systemset-icon-logo" aria-hidden="true">
                        <use xlinkHref="#icon-templateList"></use>
                    </svg>
                    <div className="systemset-title">设置</div>
                </div>
                {/* <div className="systemset-top-right">
                    <span style={{ color: "#5D70EA", fontSize: "14px" }} onClick={() =>  props.history.push("/templateAdd")}>添加</span>
                </div> */}
            </div>
            <div className="systemset-set-middle">
                <div className="systemset-set-contant systemset-user">
                        <svg className="systemset-user-icon" aria-hidden="true">
                            <use xlinkHref="#icon-touxiang"></use>
                        </svg>
                        <div className="user-middle">
                            <div className="user-middle-top">{getUser().name}</div>
                            <div className="user-middle-bottom">0关注 | 0粉丝</div>
                        </div>
                        <svg className="systemset-set-icon" aria-hidden="true">
                            <use xlinkHref="#icon-rightxi"></use>
                        </svg>
                </div>
                <div className="systemset-set-contant">
                    <div className="systemset-set-item" onClick={() => props.history.push(`/projectType`)}>
                        <div>项目类型</div>
                        <div className="item-right" >
                            <svg className="systemset-set-icon" aria-hidden="true">
                                <use xlinkHref="#icon-rightxi"></use>
                            </svg>
                        </div>
                    </div>
                    <div className="systemset-set-item" onClick={() => props.history.push(`/workPriorityList`)}>
                        <div>事项类型</div>
                        <div className="item-right">
                            <svg className="systemset-set-icon" aria-hidden="true">
                                <use xlinkHref="#icon-rightxi"></use>
                            </svg>
                        </div>
                    </div>
                    <div className="systemset-set-item"  onClick={() => props.history.push(`/workTypeList`)}>
                        <div>事项优先级</div>
                        <div className="item-right">
                            <svg className="systemset-set-icon" aria-hidden="true">
                                <use xlinkHref="#icon-rightxi"></use>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(inject("systemSetStore")(observer(SystemSet)));