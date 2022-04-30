/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 19:14:48
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-21 09:11:10
 */
/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-19 17:06:05
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-19 19:07:05
 */
import React, { useEffect, useState } from 'react';
import { NavBar, Avatar, SearchBar, Button, Modal } from 'antd-mobile';
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import { inject, observer } from 'mobx-react';
import "../components/sprint.scss";

// import ProjectAddEidtModal from "./components/projectAddEditModal";
const Sprint = (props) => {
    const { sprintStore } = props;
    const { getSprintConditionPage } = sprintStore;
    const [sprintList, setsprintList] = useState();

    useEffect(() => {
        getSprintConditionPage().then((data) => {
            if (data.code === 0) {
                setsprintList(data.data.dataList)
            }
        })
    }, [])
    

    return (
        <div className="home">
            <div className='sprint'>
                {
                    sprintList && sprintList.length > 0 && sprintList.map(item => {
                        return <div className="sprint-list">
                            <div className='sprint-left'>
                                <div className='sprint-icon'>
                                    <Avatar fallback={<AppOutline />} style={{ '--size': '32px' }} />
                                </div>
                                <div>
                                    <div className='sprint-title'>{item.sprintName}</div>
                                    <div onClick={() => props.history.push({ pathname: "/project/projectDetail"})}>
                                        {item.master ? item.master.name : "admin" }
                                    </div>
                                </div>
                            </div>
                            {/* <div className='sprint-type'>
                                {item.workType.name}
                            </div> */}
                            <div>
                            {item.sprintState.name}
                            </div>
                            <div>
                                <EyeOutline />
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default inject("sprintStore")(observer(Sprint));