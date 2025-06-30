import React, {useState} from "react";
import WorkDynmicItem from "./WorkDynamicItem";
import "./WorkDynamicTimeAxis.scss"
import {observer} from "mobx-react";
import WorkDynamicMoreDrawer from "./WorkDynamicMoreDrawer";

const WorkDynamicTimeAxis = (props) => {
    const { logList, workId } = props;

    const [count, setCount] = useState(0);

    const allLogs = logList.flatMap(item => item.loggingList);
    const [moreDrawerVisible, setMoreDrawerVisible] = useState(false);

    // 计算要显示的日志数量
    const displayedLogs = allLogs.slice(0, 3);
    const hasMore = allLogs.length > 3;

    const showMore = () => {
        setMoreDrawerVisible(true);
    }


    return <div className="work-dyncmic-timeaxis">

        <div className="work-dyncmic-timeaxis-content">
            {
                logList.map((item, index) => {
                    return <div key={item.time} className="work-dyncmic-timeaxis-box">
                        {
                            item.loggingList.map((dyncmicItem, dyncmicIndex) => {
                                if (displayedLogs.includes(dyncmicItem)){
                                    return (
                                        <div
                                            className={`work-dyncmic-timeaxis-item`}
                                            key = {dyncmicItem.id}
                                        >
                                            <div className="work-dyncmic-timeaxis-item-name">
                                                <div className="dynamic-user-icon">{dyncmicItem.user.nickname?.charAt(0)}</div>

                                            </div>
                                            <WorkDynmicItem time={dyncmicItem?.createTime.slice(0, 16)} content={dyncmicItem.data} type={dyncmicItem.actionType.id} key={dyncmicItem.id} />
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                })
            }
            {
                hasMore && <div className="work-dyncmic-more" onClick={showMore}> --查看更多-- </div>
            }
        </div>

        <WorkDynamicMoreDrawer moreDrawerVisible={moreDrawerVisible} setMoreDrawerVisible={setMoreDrawerVisible} workId={workId}/>

    </div>
};

export default observer(WorkDynamicTimeAxis);