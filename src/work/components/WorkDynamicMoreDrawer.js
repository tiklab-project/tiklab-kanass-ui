import {observer} from "mobx-react";
import {withRouter} from "react-router";
import {Drawer, List, Pagination} from "antd";
import React, {useEffect, useState} from "react"
import WorkDynamicStore from "../store/WorkDynamicStore";
import WorkDynmicItem from "./WorkDynamicItem";
import "./WorkDynamicTimeAxis.scss"
import "./WorkDynamicItem.scss"

const WorkDynamicMoreDrawer = (props) => {
    const { logTimeList, findMoreLogPageByTime, opLogTimeCondition } = WorkDynamicStore;
    const {moreDrawerVisible, setMoreDrawerVisible, workId} = props;
    const [dataList, setDataList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageSize, setPageSize] = useState(10);


    useEffect(() => {
        const params = {
            data:{
                workItemId: workId
            }

        }
        findMoreLogPageByTime(params).then(res => {
            setDataList(res.data.dataList);
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    }, []);

    const onClose = () => {
        setMoreDrawerVisible(false);
    };

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
        findMoreLogPageByTime(params).then(res => {
            setDataList(res.data.dataList);
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    };

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
                        dataList.map((item, index) => {
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
                </div>
            </div>


            <Pagination
                current={currentPage}
                total={totalRecord}
                pageSize={pageSize}
                onChange={(currentPage) => onPageChange(currentPage)}
                style={{ marginTop: 20, textAlign: 'center' }}
            />
        </Drawer>
    )
};

export default withRouter(observer(WorkDynamicMoreDrawer));