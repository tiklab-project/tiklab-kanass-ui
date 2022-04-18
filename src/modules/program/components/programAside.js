/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-12 13:59:12
 */
import React,{Fragment,useState} from 'react';
import { DownOutlined } from '@ant-design/icons';
import {getUser} from 'doublekit-core-ui'
import {observer, inject} from "mobx-react";
const programRouter = [
        {
            title: '所有项目集',
            key: '1',
            icon: "icon1_light-bulb"
        },
        {
            title: '最近浏览的项目集',
            key: '2',
            icon: "icon1_megaphone-money"
        },
        {
            title: '我创建的项目集',
            key: '3',
            icon: "icon1_sun-clouds"
        },
        {
            title: '我参与的项目集',
            key: '4',
            icon: "icon1_light-bulb"
        },
        {
            title: '我关注的项目集',
            key: '5',
            icon: "icon1_cheese"
        }
    ]
const ProgramSide = (props) => {
    const {proStore} = props;
    const {findMaterProjectList,getProlist,findJoinProjectList} = proStore
    const [showMenu, setShowMenu] = useState(true)
    const [selectMenu,setSelectMenu] = useState()
    const userId = getUser().userId
    const hiddenMenu=()=> {
        setShowMenu(!showMenu)
    }
    // 
    const selectKey = (key)=> {
        // ProStore.searchproList(key)
        setSelectMenu(key)
        // switch(key) {
        //     case "1":
        //         getProlist()
        //         break;
        //     case "3":
        //         findMaterProjectList({id:userId});
        //         break;
        //     case "4":
        //         findJoinProjectList({id:userId});
        //         break
        //     default:
        //         break;
        // }
    }
    return(
        <Fragment>
            <div className="program-aside"> 
                <div className="program-title" 
                >
                    <div>
                        <svg className="icon" aria-hidden="true">
                            <use xlinkHref= "#icon1_cheese"></use>
                        </svg> 项目集
                    </div>
                </div>
                <ul className={`program-menu ${!showMenu? "hidden-menu": ""}`}>
                    {
                        programRouter && programRouter.map(Item=> {
                            return <li className={`program-menu-submenu ${selectMenu === Item.key? "program-menu-select": ""}`} 
                                        key={Item.key} 
                                        onClick={()=>selectKey(Item.key)}
                                    >
                                    <svg className="icon" aria-hidden="true">
                                        <use xlinkHref= {`#${Item.icon}`}></use>
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
export default inject('proStore')(observer(ProgramSide));