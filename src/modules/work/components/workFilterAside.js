/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-12 13:49:59
 */
import React,{Fragment, useEffect, useState} from 'react';
import "./work.scss";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router";
import {getUser} from 'doublekit-core-ui';

const workrouter = [
        {
            title: '所有事项',
            icon: 'icon1_light-bulb',
            key: '1'
        },
        {
            title: '最近浏览的事项',
            icon: 'icon1_megaphone-money',
            key: '2'
        }
        ,
        {
            title: '我创建的事项',
            icon: 'icon1_sun-clouds',
            key: '3'
        }
        ,
        {
            title: '我参与的事项',
            icon: 'icon1_light-bulb',
            key: '4'
        }
        ,
        {
            title: '我关注的事项',
            icon: 'icon1_cheese',
            key: '5'
        }
    ]
const WorkFilterAside = (props) => {
    const {workStore}= props;
    const {setSearchConditionNull,setSearchCondition} = workStore;
    const [menyKey,setMenuKey] = useState("1")
    const projectId = localStorage.getItem("projectId")
    const sprintId = localStorage.getItem("sprintId")
    //选择菜单项
    // const selectMenu=(e)=> {
    //     const menu = e.target.parentNode.childNodes;
    //     menu.forEach((item)=> {
    //         item.classList.remove("work-menu-select")
    //     })
    //     e.target.classList.add("work-menu-select");

    // }
    // 

    useEffect(()=> {
        selectKey("1")
    },[])
    const selectKey = (key) =>{
        // WorkStore.searchworkList(key)
        setMenuKey(key)
        let initValues;
        switch(key){
            case "1":
                if (props.location.pathname === "/index/work/worklist") {
                    setSearchConditionNull();
                }
                if (props.location.pathname === "/index/prodetail/work") {
                    setSearchConditionNull();
                    initValues = { projectIds: [projectId]}
                    setSearchCondition(initValues)
                }
                break;
            case "3":
                setSearchConditionNull();
                initValues = {assignerIds: [getUser().userId]}
                setSearchCondition(initValues);
                break;
            
            default:
                break;    
        }
    }
    return(
        <Fragment>
            <div className="work-aside">
                <ul className={'work-menu'}>
                    {
                        workrouter && workrouter.map(item=> {
                            return <li className={`work-menu-submenu ${menyKey===item.key ? 'work-menu-select' : '' }`} key={item.key} onClick={()=>selectKey(item.key)}>
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref= {`#${item.icon}`}></use>
                                    </svg>{item.title}
                            </li>
                        })
                    }
                </ul>
            </div>
            
        </Fragment>
    )
}
export default withRouter(inject("workStore")(observer(WorkFilterAside)));