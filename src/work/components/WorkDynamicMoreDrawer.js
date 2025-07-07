import {observer} from "mobx-react";
import {withRouter} from "react-router";
import {Drawer, List, Pagination} from "antd";
import React, {useEffect, useState} from "react"
import WorkDynamicStore from "../store/WorkDynamicStore";
import WorkDynmicItem from "./WorkDynamicItem";
import "./WorkDynamicTimeAxis.scss"
import "./WorkDynamicItem.scss"
import "./WorkDynamicMoreDrawer.scss"

const WorkDynamicMoreDrawer = (props) => {
    const { findMoreLogPageByTime, opLogTimeCondition } = WorkDynamicStore;
    const {moreDrawerVisible, setMoreDrawerVisible, workId} = props;
    const [dataList, setDataList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [maxSize, setMaxSize] = useState(10)


    useEffect(() => {
        const params = {
            data:{
                workItemId: workId,
                pageParam:{
                    pageSize: 10,
                    currentPage: 1
                }
            }
        }
        searchList(params)

    }, [moreDrawerVisible]);

    const onClose = () => {
        setMoreDrawerVisible(false);
    };

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

    /**
     * 分页
     */
    const onPageChange = (page) => {
        const params = {
            pageParam: {
                ...opLogTimeCondition.pageParam,
                currentPage: page
            }
        }
        searchList(params);
    };

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

    return(
        <Drawer
            title="事项动态"
            placement="right"
            visible={moreDrawerVisible}
            onClose={onClose}
            width={"40%"}
        >


            <div className="work-dyncmic-timeaxis">
                <div className="work-dyncmic-timeaxis-content">
                    {
                        dataList && dataList.length > 0 && dataList.map((item, index) => {
                            return <div key={item.time} className="work-dyncmic-timeaxis-box">
                                {
                                    item.loggingList.map((dyncmicItem, dyncmicIndex) => {
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

                                    })
                                }
                            </div>
                        })
                    }
                    {
                        totalRecord > currentPage * pageSize ?
                            <div className="work-dyncmic-more" onClick={loadNextPage}>加载更多</div>
                            :
                            <div className="work-dyncmic-more">到底啦~</div>
                    }
                </div>
            </div>
        </Drawer>
    )
};

export default withRouter(observer(WorkDynamicMoreDrawer));