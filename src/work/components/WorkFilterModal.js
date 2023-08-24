import React, { useRef, useEffect, useState } from "react";
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import "./Work.scss";
import { observer, inject } from "mobx-react";
import "./WorkAsideFilter.scss";
import WorkFilterHigh from "./WorkFilterHigh";
import "./WorkFilterModal.scss";
const WorkFilterModal = (props) => {
    const {style, workListSearch, viewType} = props;
    const filterDropDownRef = useRef();
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

    // useEffect(() => {
    //     if(workListSearch?.current){
    //         console.log(workListSearch)
    //         setHeightFilter(workListSearch.current.clientWidth + 50);
    //     }
    // }, [workListSearch?.current])

    const [listStyle, setListStyle] = useState()

    const showModal = () => {
        if(viewType === "list"){
            // setHeightFilter(workListSearch.current.clientWidth + 50);
            setListStyle({
                left: workListSearch.current.clientWidth + 49,
                top: "50px"
            })
        }else {
            setListStyle({
                right: 0,
                top: "30px"
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
                <div className="filter-modal-title">
                    <div>筛选条件</div>
                    <div onClick={() => setFiltetModal(false)}><CloseOutlined /></div>
                </div>
                <WorkFilterHigh 
                    labelHidden={false} 
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