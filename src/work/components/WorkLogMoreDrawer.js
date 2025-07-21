import {observer} from "mobx-react";
import {withRouter} from "react-router";
import {Drawer, Pagination} from "antd";
import React, {useEffect, useRef, useState} from "react";
import WorkLogStore from "../store/WorkLogStore";
import UserIcon from "../../common/UserIcon/UserIcon";
import WorkPrivilegeComponent from "./WorkPrivilegeComponent";
import DeleteModal from "../../common/deleteModal/deleteModal";
import "./WorkLog.scss";
import "./WorkLogMoreDrawer.scss"

const WorkLogMoreDrawer = (props) => {

    const {moreDrawerVisible, setMoreDrawerVisible, workId, showEdit, deleteLog} = props
    const { findWorkLogPage, workLogList, workLogCondition } = WorkLogStore;
    const logAction = useRef()
    const workLog = useRef();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageSize, setPageSize] = useState(20);

    const onClose = () => {
        setMoreDrawerVisible(false);
    };

    useEffect(() => {
        const params = {
            workItemId: workId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        findWorkLogPage(params).then(res => {
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    }, [moreDrawerVisible]);

    /**
     * 分页
     */
    const onPageChange = (page) => {
        const params = {
            pageParam: {
                ...workLogCondition.pageParam,
                currentPage: page
            }

        }
        findWorkLogPage(params).then(res => {
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    };

    const loadNextPage = () => {
        const params = {
            pageParam: {
                ...workLogCondition.pageParam,
                currentPage: currentPage + 1
            }
        }
        findWorkLogPage(params).then(res => {
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    }

    return (
        <Drawer
            title="工时信息"
            placement="right"
            visible={moreDrawerVisible}
            onClose={onClose}
            width={"40%"}
        >
            <div className="work-log" ref={workLog}>
                <div className="work-log-list" style={{width: "100%"}}>
                    {
                        workLogList && workLogList.length > 0 && workLogList.map(item => {

                            return <>
                                <div className="work-log-item" key={item.id}>
                                            <div style={{ flex: 1 }}>
                                                <div className="work-log-item-first">
                                                    <div className="work-log-item-user">
                                                        <UserIcon size="big" name={item.user.nickname}/>
                                                        <span>{item.user.nickname}</span>
                                                        <div className="log-item-date">{item.workDate.slice(0,10)}</div>
                                                        <span className="log-item-text">记录了 {item.takeupTime} 小时</span>
                                                    </div>
                                                    <div className="log-action" ref={logAction}>
                                                        <WorkPrivilegeComponent workId={workId} code="WorkLogEdit">
                                                            <svg className="img-icon-right" aria-hidden="true" style={{ cursor: "pointer", marginRight: "10px" }}
                                                                 onClick={() => showEdit(item)}>
                                                                <use xlinkHref="#icon-edit"></use>
                                                            </svg>
                                                        </WorkPrivilegeComponent>
                                                        <WorkPrivilegeComponent workId={workId} code="WorkLogDelete">
                                                            <DeleteModal deleteFunction={deleteLog} id={item.id} getPopupContainer={workLog.current} />
                                                        </WorkPrivilegeComponent>

                                                    </div>
                                                </div>
                                                <div className="work-log-item-second">
                                                    <div className="log-content">{item.workContent}</div>
                                                </div>
                                            </div>

                                        </div>


                                </>

                            })
                    }
                </div>
                {
                    totalRecord > currentPage * pageSize ?
                        <div className="work-log-more" onClick={loadNextPage}>加载更多</div>
                        :
                        <div className="work-log-more">到底啦~</div>
                }
            </div>
        </Drawer>
    )
};

export default withRouter(observer(WorkLogMoreDrawer))