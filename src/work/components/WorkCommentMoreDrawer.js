import {withRouter} from "react-router";
import {observer} from "mobx-react";
import {Button, Drawer, Input, Pagination} from "antd";
import React, {Fragment, useEffect, useRef, useState} from "react";
import UserIcon from "../../common/UserIcon/UserIcon";
import DeleteModal from "../../common/deleteModal/deleteModal";
import WorkCommentStore from "../store/WorkCommentStore";
import "./WorkCommentMoreDrawer.scss"
import {getUser} from "tiklab-core-ui";
import moment from 'moment';
const { TextArea } = Input;

const WorkCommentMoreDrawer = (props) => {
    const { findWorkCommentPage, workCommentPage, createWorkComment,
        setInputComment, commentList } = WorkCommentStore;
    const {moreDrawerVisible, setMoreDrawerVisible, submitEditComment, deleteComment, getCommentList, workId} = props;
    const [editCommentContent, setEditCommentContent] = useState();
    const editInput = useRef(null);
    const logAction = useRef(null);
    const [editCommentId, setEditCommentId] = useState()
    // const [dataList, setDataList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [isInput, setIsInPut] = useState(false);

    const [commentContent, setCommentContent] = useState("")
    const commentInput = useRef(null);
    const useId = getUser().userId;


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
        findWorkCommentPage(params).then(res => {
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    }, [moreDrawerVisible]);

    /**
     * 翻页
     */
    const onPageChange = (page) => {
        const params = {
            pageParam: {
                ...workCommentPage.pageParam,
                currentPage: page
            }

        }
        findWorkCommentPage(params).then(res => {
            // setDataList(res.data.dataList);
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    }

    const loadNextPage = () => {
        const params = {
            pageParam: {
                ...workCommentPage.pageParam,
                currentPage: currentPage + 1
            }
        }
        findWorkCommentPage(params).then(res => {
            // setDataList(res.data.dataList);
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    }

    /**
     * 提交评论
     */
    const submitComment = () => {
        if (commentContent) {
            const data = {
                workItem: { id: workId },
                details: commentContent,
                user: { id: useId },
                createTime: moment().format('YYYY-MM-DD')
            }
            createWorkComment(data).then(res => {
                if (res.code === 0) {
                    setIsInPut(false)
                    setCommentContent("")
                    getCommentList({ workItemId: workId })
                    setInputComment()

                    const params = {
                        pageParam: {
                            ...workCommentPage.pageParam,
                            currentPage: 1
                        }

                    }
                    findWorkCommentPage(params).then(res => {
                        // setDataList(res.data.dataList);
                        setCurrentPage(res.data.currentPage)
                        setTotalRecord(res.data.totalRecord)
                        setPageSize(res.data.pageSize)
                    })
                }
            })
        }
    }

    const onCancel = () => {
        setCommentContent("")
        setIsInPut(false);
    }

    /**
     * 打开评论输入框
     */
    const changeInput = () => {
        setIsInPut(true)
    }

    return(
        <Drawer
            title="评论"
            className={"work-comment-more-drawer"}
            placement="right"
            visible={moreDrawerVisible}
            onClose={onClose}
            width={"40%"}
        >
            <div
                style={{
                    height: isInput ? "calc(100% - 155px)" : "calc(100% - 65px)",
                    overflowY: "auto",
                    scrollbarGutter: "stable",
                    padding: "0 20px"
                }}
            >
                <div className="work-comment">
                    <div className="work-comment-list-box">
                        {
                            <Fragment>
                                {/*<div className="title">共{totalRecord}条</div>*/}
                                <div className="work-comment-list" style={{width: "100%"}}>
                                    {
                                        commentList && commentList.length > 0 && commentList.map(item => {
                                            return <div className="comment-item" key={item.id}>
                                                <div className="comment-top">
                                                    <div className="comment-user">
                                                        <UserIcon size="big" name={item.user?.nickname ? item.user?.nickname : item.user?.name} />
                                                        <span className="user-name">{item.user?.nickname ? item.user?.nickname : item.user?.name}</span>
                                                        <span className="user-date">{item.createTime}</span>
                                                    </div>
                                                    <div className="comment-operate" ref={logAction}>
                                                        <DeleteModal deleteFunction={deleteComment} id={item.id} getPopupContainer={logAction.current} />
                                                    </div>
                                                </div>
                                                {
                                                    <Fragment>
                                                        <div className="comment-content">
                                                            {item.details}
                                                        </div>
                                                    </Fragment>

                                                }
                                            </div>
                                        })
                                    }
                                </div>
                                {
                                    totalRecord > currentPage * pageSize ?
                                        <div className="work-comment-more" onClick={loadNextPage}>加载更多</div>
                                        :
                                        <div className="work-comment-more">到底啦~</div>
                                }
                            </Fragment>
                        }
                    </div>
                </div>
            </div>

            <div className={`work-comment-input `}>
                <div className={`work-comment-box ${isInput ? "" : ""}`}>
                            <svg className="icon-32" aria-hidden="true">
                                <use xlinkHref="#icon-icontouxiang1"></use>
                            </svg>
                            <div className={`comment-botton ${isInput ? "comment-botton-hidden" : ""}`} onClick={() => changeInput()}>请输入评论...</div>
                            <div className={`comment-input ${isInput ? "comment-input-show" : ""}`}>
                                <TextArea
                                    id="comment-input"
                                    rows={4}
                                    className="comment-text"
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    ref={commentInput}
                                />
                                <div className="comment-submit">
                                    <Button type="primary" className="submit" onClick={() => submitComment()}>发布</Button>
                                    <Button className="cancel" onClick={onCancel}>取消</Button>
                                </div>
                            </div>

                        </div>
            </div>
        </Drawer>
    )
}

export default withRouter(observer(WorkCommentMoreDrawer));