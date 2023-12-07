import React from "react";
import "./DyncmicList.scss";
import { Empty } from "antd";

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

            {/* <div className="more" onClick={() => { props.history.push(`/sprint/${userId}`) }}>更多...</div> */}
        </div>
        <div className="dynamic-list">
            {
                logList.length > 0 ? logList.map(item => {
                    return <div
                        dangerouslySetInnerHTML={{ __html: item.data }}
                        className="dynamic-item"
                        onClick={() => goOpLogDetail(item.link)}
                        key={item.id}
                    />
                })
                    :
                    <Empty image="/images/nodata.png" description="暂时没有动态~" />
            }
        </div>
    </div>
    )
}

export default DyncmicList;