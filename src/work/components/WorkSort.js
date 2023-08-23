import React, { useEffect, useState, useRef } from "react";
import "./WorkSort.scss";

const WorkSort = (props) => {
    const { sorter, buttonType } = props;
    const [showSortDropDown, setShowSortDropDown] = useState(false);
    const sortDropDown = useRef();

    const [isAsc, setIsAsc] = useState("desc");
    const [sortType, setSortType] = useState({
        value: "order_num",
        title: "事项ID"
    })

    const attribute = [
        {
            value: "order_num",
            title: "事项ID"
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
        },
        {
            value: "work_status_node_id",
            title: "状态"
        }
    ]

    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [showSortDropDown])

    const closeModal = (e) => {
        if (!sortDropDown.current) {
            return;
        }
        if (!sortDropDown.current.contains(e.target) && sortDropDown.current !== e.target) {
            setShowSortDropDown(false)
        }
    }

    const upDownSort = (item) => {
        
        if(item.value === sortType.value){
            if(isAsc === "desc"){
                sorter(item.value, "asc")
                setIsAsc("asc")  
            }
            if(isAsc === "asc"){
                sorter(item.value, "desc")
                setIsAsc("desc")  
            }  
        }else {
            sorter(item.value, isAsc)
        }
        setSortType(item)
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
                            key={item.value} onClick={() => upDownSort(item)}>
                            {/* <div style={{ width: "80px" }}>  */}
                                <div className="view-item-name">
                                    {item.title}
                                </div>
                                <div className={`view-sort-botton ${item.value === sortType.value && isAsc === "asc" ? "sort-type-select" : ""}`}>
                                    <svg className="svg-icon" aria-hidden="true" >
                                        <use xlinkHref="#icon-shengxu"></use>
                                    </svg>
                                </div>
                                <div className={`view-sort-botton ${item.value === sortType.value && isAsc === "desc" ? "sort-type-select" : ""}`}>
                                    <svg className="svg-icon" aria-hidden="true" >
                                        <use xlinkHref="#icon-jiangxu"></use>
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