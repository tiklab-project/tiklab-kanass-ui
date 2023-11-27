/*
 * @Descripttion: 弃用
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-12 13:59:12
 */
import React,{Fragment,useState} from 'react';
import {getUser} from 'tiklab-core-ui'
import {observer, inject} from "mobx-react";

const prorouter = [
    {
        title: '所有项目',
        key: '1',
        icon: "project"
    },
    {
        title: '最近浏览的',
        key: '2',
        icon: "programrencent"
    },
    {
        title: '我参与的',
        key: '4',
        icon: "programjoin"
    },
    {
        title: '我关注的',
        key: '5',
        icon: "programconcern"
    }
]
const Proaside = (props) => {
    const {projectStore} = props;
    const {findProjectList,findJoinProjectList, findRecentProjectList} = projectStore
    const [showMenu, setShowMenu] = useState(true)
    const [selectMenu,setSelectMenu] = useState("1")
    const userId = getUser().userId
    const hiddenMenu=()=> {
        setShowMenu(!showMenu)
    }
    // 
    const selectKey = (key)=> {
        // ProjectStore.searchproList(key)
        setSelectMenu(key)
        switch(key) {
            case "1":
                findProjectList()
                break;
            case "2":
                findRecentProjectList()
                break;
            case "3":
                findProjectList({master:userId})
                break;
            case "4":
                findJoinProjectList({id:userId});
                break
            default:
                break;
        }
    }
    return(
        <Fragment>
            <div className="project-aside"> 
                <div className="project-title" 
                >
                    <div>
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref= "#icon-project"></use>
                        </svg> 项目
                    </div>
                </div>
                <ul className={`project-menu ${!showMenu? "hidden-menu": ""}`}>
                    {
                        prorouter && prorouter.map(Item=> {
                            return <li className={`project-menu-submenu ${selectMenu === Item.key? "project-menu-select": ""}`} 
                                        key={Item.key} 
                                        onClick={()=>selectKey(Item.key)}
                                    >
                                    <svg className="svg-icon" aria-hidden="true">
                                        <use xlinkHref= {`#icon-${Item.icon}`}></use>
                                    </svg>
                                {Item.title}
                            </li>
                        })
                    }
                </ul>
                
            </div>
        </Fragment>
    )
}
export default inject('projectStore')(observer(Proaside));