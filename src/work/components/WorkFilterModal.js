import React, { useRef, useEffect, useState } from "react";
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import "./Work.scss";
import { observer, inject } from "mobx-react";
import "./WorkAsideFilter.scss";
import WorkFilterHigh from "./WorkFilterHigh";
import "./WorkFilterModal.scss";
const WorkFilterModal = (props) => {
    const filterDropDownRef = useRef();
    const { form } = props;
    const layout = "horizontal"
  

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

    return (
        <div className="worklist-filter-modal">
            <div className="worklist-filter-item" onClick={() => setFiltetModal(true)}>
                <svg className="botton-icon" aria-hidden="true" >
                    <use xlinkHref="#icon-filter"></use>
                </svg>
                {/* 筛选 */}
            </div>


            <div
                title="搜索"
                ref={filterDropDownRef}
                className={`filter-modal ${filterModal ? "filter-modal-show" : "filtet-modal-hidden"}`}
                footer={null}
            >
                <div className="filter-modal-title">
                    <div>筛选条件</div>
                    <div onClick={() => setFiltetModal(false)}><CloseOutlined /></div>
                </div>
                <WorkFilterHigh 
                    labelHidden={false} 
                    form={form} 
                    layout={layout} 
                    filterModal = {filterModal}
                    setFiltetModal = {setFiltetModal}
                    {...props} 
                />
            </div>

        </div>


    )
}
export default inject("workStore", "workCalendarStore")(observer(WorkFilterModal));