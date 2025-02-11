/*
 * @Author: 袁婕轩
 * @Date: 2024-07-01 18:13:18
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:49:38
 * @Description: 事项排序组件
 */
import React, { useEffect, useState, useRef } from "react";
import "./WorkSort.scss";

const WorkSort = (props) => {
    const { buttonType, sorter } = props;
    const [showSortDropDown, setShowSortDropDown] = useState(false);
    const sortDropDown = useRef();

    const [isAsc, setIsAsc] = useState("desc");
 

    const attribute = [
        {
            value: "code",
            title: "事项Code"
        },
        {
            value: "title",
            title: "标题"
        },
        {
            value: "work_type_sys_id",
            title: "类型"
        },
        {
            value: "work_status_node_id",
            title: "状态"
        },
        {
            value: "work_priority_id",
            title: "优先级"
        },
        {
            value: "assigner_id",
            title: "负责人"
        },
        {
            value: "builder_id",
            title: "创建人"
        },
        {
            value: "build_time",
            title: "创建时间"
        }
    ]

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showSortDropDown])

    /**
     * 关闭排序弹窗
     */
    const closeModal = (e) => {
        if (!sortDropDown.current) {
            return;
        }
        if (!sortDropDown.current.contains(e.target) && sortDropDown.current !== e.target) {
            setShowSortDropDown(false)
        }
    }

    /**
     * 排序数组
     */
    let [sortArray, setSortArray] = useState([{name: "code", orderType: "desc"}]);

    /**
     * 排序
     */
    const upDownSort = (sortName, sortType) => {
        // JSON.stringify(sortArray).indexOf()
        if(sortType === "cancel") {
            sortArray = sortArray.filter((item) => {
                return !(item.name === sortName);
            })
        }else {
            const result = sortArray.some(function(item) {
                if (item.name == sortName) {
                    return true;
                }
            })

            if(result) {
                sortArray.map((item, index) => {
                    if(item.name === sortName){
                        sortArray[index].orderType = sortType;
                    }
                    return item;
                })
            }else {
                sortArray.push({
                    name: sortName, 
                    orderType: sortType
                })
            }
            
        }
        setSortArray([...sortArray])
        console.log(sortArray)
        sorter(sortArray)
    }

    return <div className="work-view">
        {
            buttonType === "button" ?
                <div className="worklist-filter-button" onClick={() => setShowSortDropDown(true)}>
                    {
                        isAsc === "asc" ? <svg className="botton-icon" aria-hidden="true" >
                            <use xlinkHref="#icon-shengxu"></use>
                        </svg>
                            :
                            <svg className="botton-icon" aria-hidden="true">
                                <use xlinkHref="#icon-jiangxu"></use>
                            </svg>
                    }
                    排序
                </div>
                :
                <div className="worklist-filter-item" onClick={() => setShowSortDropDown(true)}>
                    {
                        isAsc === "asc" ? <svg className="botton-icon" aria-hidden="true" >
                            <use xlinkHref="#icon-shengxu"></use>
                        </svg>
                        :
                        <svg className="botton-icon" aria-hidden="true">
                            <use xlinkHref="#icon-jiangxu"></use>
                        </svg>
                    }
                    {/* 排序 */}
                </div>
        }

        {
            showSortDropDown && <div className={`work-view-dropdown`} ref={sortDropDown}>
                <div className="work-view-head">切换排序</div>
                {
                    attribute.map(item => {
                        return <div
                            className={`work-view-item`}
                            key={item.value} >
                            {/* <div style={{ width: "80px" }}>  */}
                                <div className="view-item-name">
                                    {item.title}
                                </div>
                                <div className={`view-sort-botton ${JSON.stringify(sortArray).indexOf(JSON.stringify({name: item.value, orderType: "asc"})) > -1 ? "sort-type-select" : ""}`} onClick={() => upDownSort(item.value, "asc")}>
                                    <svg className="svg-icon" aria-hidden="true" >
                                        <use xlinkHref="#icon-shengxu"></use>
                                    </svg>
                                </div>
                                <div className={`view-sort-botton ${JSON.stringify(sortArray).indexOf(JSON.stringify({name: item.value, orderType: "desc"})) > -1 ? "sort-type-select" : ""}`} onClick={() => upDownSort(item.value, "desc")}>
                                    <svg className="svg-icon" aria-hidden="true" >
                                        <use xlinkHref="#icon-jiangxu"></use>
                                    </svg>
                                </div>
                                <div className={`view-sort-botton`}  onClick={() => upDownSort(item.value, "cancel")}>
                                    <svg className="svg-icon" aria-hidden="true" >
                                        <use xlinkHref="#icon-cancelSorter"></use>
                                    </svg>
                                </div>
                            {/* </div> */}
                        </div>
                    })
                }
            </div>
        }
    </div>
}

export default WorkSort;