import {observer} from "mobx-react";
import {withRouter} from "react-router";
import {Drawer, Pagination} from "antd";
import React, {useEffect, useRef, useState} from "react";
import WorkLogStore from "../store/WorkLogStore";
import UserIcon from "../../common/UserIcon/UserIcon";
import WorkPrivilegeComponent from "./WorkPrivilegeComponent";
import DeleteModal from "../../common/deleteModal/deleteModal";
import "./WorkLog.scss";

const WorkLogMoreDrawer = (props) => {

    const {moreDrawerVisible, setMoreDrawerVisible, workId, showEdit, deleteLog} = props
    const { findWorkLogPage, workLogList, workLogCondition } = WorkLogStore;
    const logAction = useRef()
    const workLog = useRef();
    const [logList, setLogList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageSize, setPageSize] = useState(20);

    const onClose = () => {
        setMoreDrawerVisible(false);
    };

    useEffect(() => {
        const params = {
            workItemId: workId

        }
        findWorkLogPage(params).then(res => {
            setLogList(res.data.dataList);
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    }, []);

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
            setLogList(res.data.dataList);
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    };

    return (
        <Drawer
            title="工时动态"
            placement="right"
            visible={moreDrawerVisible}
            onClose={onClose}
            width={"40%"}
        >
            <div className="work-log" ref={workLog}>
                <div className="work-log-list">
                    {
                        logList.map(item => {

                            return <>
                                <div className="work-log-item" key={item.id}>
                                            <div style={{ flex: 1 }}>
                                                <div className="work-log-item-first">
                                                    <div className="work-log-item-user">
                                                        <UserIcon size="big">{item.user.nickname}</UserIcon>
                                                        <span className="log-item-text">{item.user.nickname} 记录了 {item.takeupTime} 小时</span>
                                                    </div>
                                                    <div className="log-item-date">{item.workDate}</div>

                                                </div>
                                                <div className="work-log-item-second">
                                                    <div className="log-content">{item.workContent}</div>

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
                                            </div>

                                        </div>


                                </>

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

export default withRouter(observer(WorkLogMoreDrawer))