import React, { Children } from "react";
import "./DyncmicTimeAxis.scss";
import DyncmicItem from "../../../common/overviewComponent/DynamicItem"
import { observer } from "mobx-react";
const DyncmicTimeAxis = (props) => {
    const { logList } = props;

    return <div className="dyncmic-timeaxis">
        {/* <div className="dyncmic-timeaxis-title">最近动态</div> */}

        <div className="dyncmic-timeaxis-content">
            {
                logList.map((item, index) => {
                    return <div key={item.date} className="dyncmic-timeaxis-box">
                        <div className="dyncmic-timeaxis-date">
                            <div className="dyncmic-timeaxis-date-content">
                                {item.date}
                            </div>
                        </div>
                        {
                            item.children.map((dyncmicItem, dyncmicIndex) => {
                                return <div
                                    className={`dyncmic-timeaxis-item ${index === logList.length - 1 && dyncmicIndex === item.children.length - 1 ? "" : "dyncmic-showtimeaxis-item"}`}
                                    key = {dyncmicItem.id}
                                >
                                    <div className="dyncmic-timeaxis-item-time">{dyncmicItem.createTime.slice(10, 16)}</div>
                                    
                                    <div className="dyncmic-timeaxis-item-name">
                                        <div className="dynamic-user-icon">{dyncmicItem.user.nickname?.charAt(0)}</div>

                                    </div>
                                    <DyncmicItem content={dyncmicItem.data} type={dyncmicItem.actionType.id} key={dyncmicItem.id} />
                                    
                                </div>
                            })
                        }
                    </div>
                })
            }
        </div>

    </div>
}

export default observer(DyncmicTimeAxis);