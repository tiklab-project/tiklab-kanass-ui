import React, { useRef, useEffect, useState } from "react";
import { Modal, Select } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { observer, inject } from "mobx-react";
import "./WorkAsideFilter.scss";
import WorkFilterHigh from "./WorkFilterHigh";
import "./WorkFilterModal.scss";
const WorkFilterModal = (props) => {
    const { style, workListSearch, workStore } = props;
    const { workShowType } = workStore;
    const filterDropDownRef = useRef();
    const layout = "horizontal"
    const heightFilterTop = useRef()

    const [filterModal, setFiltetModal] = useState()
    
    useEffect(() => {
        window.addEventListener("mousedown", closeModal, false);
        return () => {
            window.removeEventListener("mousedown", closeModal, false);
        }
    }, [filterDropDownRef])

    const closeModal = (e) => {
        if (!filterDropDownRef.current) {
            return;
        }
        if (!filterDropDownRef.current.contains(e.target) && filterDropDownRef.current !== e.target) {
            setFiltetModal(false)
        }
    }

    const [listStyle, setListStyle] = useState()

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
                right: "265px",
                top: 0
            })
        }
        if (workShowType === "bodar" || workShowType === "gantt") {
            setListStyle({
                right: "300px",
                top: 0
            })
        }
        setFiltetModal(true)
    }
    


    return (
        <div className="worklist-filter-modal">
            <div className={`worklist-filter-item  ${filterModal ? 'worklist-filter-active' : ''}`} onClick={() => showModal()}>
                <svg className="botton-icon" aria-hidden="true" >
                    <use xlinkHref="#icon-filter"></use>
                </svg>
            </div>


            <div
                title="搜索"
                ref={filterDropDownRef}
                className={`filter-modal ${filterModal ? "filter-modal-show" : "filtet-modal-hidden"}`}
                footer={null}
                style={listStyle}
            >
                <div className="filter-modal-title" ref = {heightFilterTop}>
                    <div>筛选</div>
                    <div onClick={() => setFiltetModal(false)}><CloseOutlined /></div>
                    
                </div>
                <WorkFilterHigh
                    labelHidden={false}
                    layout={layout}
                    filterModal={filterModal}
                    setFiltetModal={setFiltetModal}
                    {...props}
                />
            </div>

        </div>


    )
}
export default inject("workStore", "workCalendarStore")(observer(WorkFilterModal));