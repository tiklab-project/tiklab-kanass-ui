import React from "react";
import "./DyncmicList.scss";
import { Empty } from "antd";
import DyncmicItem from "./DynamicItem"
const DyncmicList = (props) => {
    const {logList, goDynamicList, goOpLogDetail} = props;
    return (
        <div className="dynamic-box">
        <div className="box-title">
            <div className="name">最新动态</div>
            <div className="more" onClick={() => goDynamicList()}>
                <svg aria-hidden="true" className="svg-icon">
                    <use xlinkHref="#icon-rightjump"></use>
                </svg>
            </div>

        </div>
        <div className="dynamic-list">
            {
                logList.length > 0 ? logList.map(item => {
                    return <DyncmicItem content = {item.data} type = {item.actionType.id} key = {item.id}/>
                })
                    :
                    <Empty image="/images/nodata.png" description="暂时没有动态~" />
            }
        </div>
    </div>
    )
}

export default DyncmicList;