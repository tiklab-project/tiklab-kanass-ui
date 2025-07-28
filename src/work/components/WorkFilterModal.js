/*
 * @Descripttion: 事项详情页面的筛选按钮
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-02-05 11:02:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 15:17:20
 */
import React, { useRef, useEffect, useState } from "react";
import { CloseOutlined } from '@ant-design/icons';
import { observer, inject } from "mobx-react";
import "./WorkAsideFilter.scss";
import WorkFilterHigh from "./WorkFilterHigh";
import "./WorkFilterModal.scss";
import {Tabs} from "antd";
import WorkFilterQuickItem from "./WorkFilterQuickItem";
import WorkSortItem from "./WorkSortItem";
const WorkFilterModal = (props) => {
    const { style, workListSearch, workStore } = props;
    const { workShowType, getWorkConditionPageTree, getWorkConditionPage, viewType, searchCondition, getWorkBoardList } = workStore;
    const filterDropDownRef = useRef();
    const layout = "horizontal"
    const heightFilterTop = useRef()

    const [filterModal, setFiltetModal] = useState()
    
    /**
     * 监听筛选组件的关闭
     */
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [filterDropDownRef])

    /**
     * 关闭筛选组件
     */
    const closeModal = (e) => {
        if (!filterDropDownRef.current) {
            return;
        }
        if (!filterDropDownRef.current.contains(e.target) && filterDropDownRef.current !== e.target) {
            setFiltetModal(false)
        }
    }

    const [listStyle, setListStyle] = useState()

    /**
     * 显示筛选组件
     */
    const showModal = () => {
        if (workShowType === "list") {
            // setHeightFilter(workListSearch.current.clientWidth + 50);
            console.log(workListSearch.current.clientWidth, "list")
            setListStyle({
                left: workListSearch.current.clientWidth + 45,
                top: "0px"
            })
        }
        if (workShowType === "table") {
            // setHeightFilter(workListSearch.current.clientWidth + 50);
            setListStyle({
                right: "30px",
                top: 0
            })
        }
        if (workShowType === "bodar" || workShowType === "gantt") {
            setListStyle({
                right: "80px",
                top: 0
            })
        }
        setFiltetModal(true)
    }

    /**
     * 排序
     */
    const sorter = (orderParams) => {
        searchCondition.orderParams = orderParams;
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

        if (workShowType === "bodar") {
            getWorkBoardList(searchCondition)
        }

    }
    const [selectTab, setSelectTab] = useState(1);
    const tabValue=[
        {
            id: 1,
            label: "排序"
        },
        {
            id: 2,
            label: "筛选"
        }
    ]


    return (
        <div className="worklist-filter-modal">
            <div className={`worklist-filter-item  ${filterModal ? 'worklist-filter-active' : ''}`} onClick={() => showModal()}>
                <svg className="botton-icon" aria-hidden="true" >
                    <use xlinkHref="#icon-filter"></use>
                </svg>
                {
                    workShowType !== "list" ?
                    <span>筛选</span>
                    :
                    null
                }
            </div>


            <div
                title="搜索"
                ref={filterDropDownRef}
                className={`filter-modal ${filterModal ? "filter-modal-show" : "filtet-modal-hidden"}`}
                footer={null}
                style={listStyle}
            >
                <div className="filter-modal-title" ref = {heightFilterTop}>
                    <div>{workShowType === "list" ? "筛选与排序" : "筛选"}</div>
                    <div onClick={() => setFiltetModal(false)}><CloseOutlined /></div>

                </div>
                {
                    workShowType === "table" ?
                        <WorkFilterHigh
                            labelHidden={false}
                            layout={layout}
                            filterModal={filterModal}
                            setFiltetModal={setFiltetModal}
                            {...props}
                        />
                        :
                        <div className="work-filter-tabs">
                            <div className="work-filter-tab">
                                {
                                    tabValue.map((item, index) => {
                                        return <>
                                            <div
                                                key={item.id}
                                                className={"filter-tab " + (selectTab === item.id ? "filter-tab-active" : "")}
                                                onClick={() => {
                                                    setSelectTab(item.id)
                                                }}
                                            >
                                                <span>{item.label}</span>
                                            </div>
                                        </>

                                    })
                                }
                            </div>
                            {
                                selectTab === 1 ?
                                    <WorkFilterHigh
                                        labelHidden={false}
                                        layout={layout}
                                        filterModal={filterModal}
                                        setFiltetModal={setFiltetModal}
                                        {...props}
                                    />
                                    :
                                    <WorkSortItem sorter={sorter} />
                            }
                            {/*<Tabs tabPosition="left" defaultActiveKey="1" className="filter-tabs">*/}
                            {/*    <Tabs.TabPane tab="筛选" key="1" className="filter-tab-content">*/}
                            {/*        <WorkFilterHigh*/}
                            {/*            labelHidden={false}*/}
                            {/*            layout={layout}*/}
                            {/*            filterModal={filterModal}*/}
                            {/*            setFiltetModal={setFiltetModal}*/}
                            {/*            {...props}*/}
                            {/*        />*/}
                            {/*    </Tabs.TabPane>*/}
                            {/*    {*/}
                            {/*        (workShowType === "list" || workShowType === "bodar" || workShowType === "gantt") &&*/}
                            {/*        <Tabs.TabPane tab="排序" key="2" className="filter-tab-content">*/}
                            {/*            <WorkSortItem sorter={sorter} />*/}
                            {/*        </Tabs.TabPane>*/}
                            {/*    }*/}
                            {/*</Tabs>*/}
                        </div>
                }


            </div>

        </div>


    )
}
export default inject("workStore", "workCalendarStore")(observer(WorkFilterModal));