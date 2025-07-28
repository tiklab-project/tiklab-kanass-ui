import React, {useEffect, useState} from "react";
import WorkDynmicItem from "./WorkDynamicItem";
import "./WorkDynamicTimeAxis.scss"
import {observer} from "mobx-react";
import WorkDynamicMoreDrawer from "./WorkDynamicMoreDrawer";

const WorkDynamicTimeAxis = (props) => {
    const { workId, workDynamicStore } = props;
    const { logTimeList, findMoreLogPageByTime, opLogTimeCondition } = workDynamicStore;
    const [count, setCount] = useState(0);
    const [allLogs, setAllLogs] = useState([]);
    const [moreDrawerVisible, setMoreDrawerVisible] = useState(false);
    const [dataList, setDataList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [maxSize, setMaxSize] = useState(10)

    // 计算要显示的日志数量
    const displayedLogs = allLogs.slice(0, 3);
    const hasMore = allLogs.length > 3;

    const showMore = () => {
        setMoreDrawerVisible(true);
    }

    // useEffect(() => {
    //     setAllLogs(logTimeList.flatMap(item => item.loggingList))
    // }, [logTimeList]);

    useEffect(() => {
        const params = {
            pageParam: {
                pageSize: 10,
                currentPage: 1,
                totalPage: 1,
                total: 1
            },
            bgroup: "kanass",
            data: { workItemId: workId }
        }
        searchList(params)
    }, [workId])

    const searchList = (params) => {
        findMoreLogPageByTime(params).then(res => {
            if (res.data.currentPage === 1){
                setDataList(res.data.dataList);
            }else if (res.data.currentPage > 1){
                setDataList(mergeList(dataList, res.data.dataList));
            }
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    }

    const mergeList = (logTimeList, dataList) =>{
        // 创建一个新的合并后的数组
        const mergedDataList = [...logTimeList];

        // 遍历 page2 的 dataList
        for (const item of dataList) {
            // 检查相同日期的条目是否已存在
            const existingItemIndex = mergedDataList.findIndex(x => x.time === item.time);

            if (existingItemIndex >= 0) {
                // 如果存在相同日期的条目，合并 loggingList
                mergedDataList[existingItemIndex].loggingList = [
                    ...mergedDataList[existingItemIndex].loggingList,
                    ...item.loggingList
                ];
            } else {
                // 如果不存在，直接添加整个条目
                mergedDataList.push(item);
            }
        }

        // 按时间降序排序（最新的在前面）
        mergedDataList.sort((a, b) => new Date(b.time) - new Date(a.time));
        mergedDataList.forEach(item => {
            item.loggingList.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
        });

        return mergedDataList;
    }

    const loadNextPage = () => {
        const params = {
            pageParam: {
                ...opLogTimeCondition.pageParam,
                currentPage: currentPage + 1
            }
        }
        setMaxSize(maxSize + 10)
        searchList(params);
    }

    return <div className="work-dyncmic-timeaxis">

        <div className="work-dyncmic-timeaxis-content">
            {
                dataList.map((item, index) => {
                    return <div key={item.time} className="work-dyncmic-timeaxis-box">
                        {
                            item.loggingList.map((dyncmicItem, dyncmicIndex) => {
                                // if (displayedLogs.includes(dyncmicItem)){
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
                                // }
                            })
                        }
                    </div>
                })
            }
            {/*{*/}
            {/*    hasMore && <div className="work-dyncmic-more" onClick={showMore}>查看更多</div>*/}
            {/*}*/}
            {
                totalRecord > currentPage * pageSize ?
                    <div className="work-dyncmic-more" onClick={loadNextPage}>加载更多</div>
                    :
                    <div className="work-dyncmic-more">到底啦~</div>
            }
        </div>

        <WorkDynamicMoreDrawer moreDrawerVisible={moreDrawerVisible} setMoreDrawerVisible={setMoreDrawerVisible} workId={workId}/>

    </div>
};

export default observer(WorkDynamicTimeAxis);