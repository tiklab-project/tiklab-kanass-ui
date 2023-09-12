import React, { useEffect, useState, useRef } from "react";
import "./WorkSort.scss";

const WorkSort = (props) => {
    const { buttonType } = props;
    const [showSortDropDown, setShowSortDropDown] = useState(false);
    const sortDropDown = useRef();

    const [isAsc, setIsAsc] = useState("desc");
    const [sortType, setSortType] = useState({
        value: "id",
        title: "事项ID"
    })

    const attribute = [
        {
            value: "id",
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

    let [sortArray, setSortArray] = useState([{name: "id", orderType: "desc"}]);
    let [sortTitleArray, setSortTitleArray] = useState(["id"]);
    const upDownSort = (sortName, sortType) => {
        let array = sortArray;
        if(sortType === "cancel") {
            sortArray = array.filter((item) => {
                return !(item.name === sortName);
            })
        }else {
            const result = sortArray.some(function(item) {
                if (item.name == sortName) {
                    return true;
                }
            })

            if(result) {
                sortArray = array.map((item, index) => {
                    if(item.name === sortName){
                        array[index] = sortType;
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
        setSortArray(sortArray)
        console.log( sortArray.includes({name: sortName, orderType: sortType}))
        
        // if(item.value === sortType.value){
        //     if(isAsc === "desc"){
        //         sorter(item.value, "asc")
        //         setIsAsc("asc")  
        //     }
        //     if(isAsc === "asc"){
        //         sorter(item.value, "desc")
        //         setIsAsc("desc")  
        //     }  
        // }else {
        //     sorter(item.value, isAsc)
        // }
        // setSortType(item)
    }

    

    const sorter = (sortType, isAsc) => {
        const sortParams = [];
        sortParams.push({
            name: sortType,
            orderType: isAsc
        })
        searchCondition.orderParams = sortParams;
        searchCondition.pageParam = {
            pageSize: 20,
            currentPage: 1
        }
        if (viewType === "tree") {
            getWorkConditionPageTree()
        }
        if (viewType === "tile") {
            getWorkConditionPage()
        }

    }

    const sorterTable = () => {
        
        const setSortParams = (sorter) => {
            const field = sorter.columnKey;
            const order = sorter.order;
            let isAsc = "";
            let sortType = "";
            if (order === "ascend") {
                isAsc = "asc"
            }
            if (order === "descend") {
                isAsc = "desc"
            }
            if(!order) {
                return
            }
            switch (field) {
                case "title":
                    sortType = "id";
                    break;
                case "assignerId":
                    sortType = "assigner_id";
                    break;
                case "builderId":
                    sortType = "builder_id";
                    break;
                case "project":
                    sortType = "project_id";
                    break;
                case "workPriority":
                    sortType = "work_priority_id";
                    break;
                case "workStatus":
                    sortType = "work_status_node_id";
                    break;
                case "buildTime":
                    sortType = "build_time";
                    break;
                default:
                    break;
            }
            
            const params = {
                name: sortType,
                orderType: isAsc
            }

            return params;
        }
        console.log(sorter)
        if(extra.action === "sort"){
            let sortParams = [];
            let sortArray = []
            if(!(sorter instanceof Array)){
                if(sorter.order){
                    sortParams.push(setSortParams(sorter));
                    sortArray.push(sorter.columnKey);
                }else {
                    sortParams.push({
                        name: "id",
                        orderType: "desc"
                    });
                    sortArray.push("title");
                }
                
            }else {
                sorter.map(item => {
                    sortParams.push(setSortParams(item));
                    sortArray.push(item.columnKey);
                })
            }
            setSortArray(sortArray)
            searchCondition.orderParams = sortParams;
            searchCondition.pageParam = {
                pageSize: 20,
                currentPage: 1
            }
            if (viewType === "tree") {
                getWorkConditionPageTree()
            }
            if (viewType === "tile") {
                getWorkConditionPage()
            }
        }
       

    }

    //  判断某项排序是否被选中
    const isSelect = (sortName, sortType) => {
        const result = sortArray.some(function(item) {
            if (item.name == sortName && item.orderType == sortType) {
                return true;
            }
        })
        return result;
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
                                <div className={`view-sort-botton ${ isSelect(item.value, "desc") > -1 ? "sort-type-select" : ""}`} onClick={() => upDownSort(item.value, "asc")}>
                                    <svg className="svg-icon" aria-hidden="true" >
                                        <use xlinkHref="#icon-shengxu"></use>
                                    </svg>
                                </div>
                                <div className={`view-sort-botton ${sortArray.indexOf({name: item.value, sortType: "desc"}) > -1 ? "sort-type-select" : ""}`} onClick={() => upDownSort(item.value, "desc")}>
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