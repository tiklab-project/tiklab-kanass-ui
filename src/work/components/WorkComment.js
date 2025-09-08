/*
 * @Descripttion: 事项评论
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-24 14:10:13
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 14:31:48
 */
import React, {useEffect, useState, useRef, Fragment, useImperativeHandle} from "react";
import { Input, Button, Empty, Pagination, Modal, Col } from "antd";
import "./WorkComment.scss";
import { getUser } from 'tiklab-core-ui';
import { observer } from "mobx-react";
import moment from 'moment';
import WorkCommentStore from "../store/WorkCommentStore";
import ProjectEmpty from "../../common/component/ProjectEmpty";
import DeleteModal from "../../common/deleteModal/deleteModal";
import UserIcon from "../../common/UserIcon/UserIcon";
import WorkCommentMoreDrawer from "./WorkCommentMoreDrawer";
import WorkCommentInput from "./WorkCommentInput";
const { TextArea } = Input;

const WorkComment = (props) => {
    const { workId, commentInputRef } = props;
    const { createWorkComment, findWorkCommentPage, commentList, updateWorkComment, deleteWorkComment, inputComment, workCommentPage } = WorkCommentStore;
    const [isInput, setIsInPut] = useState(false);
    const [commentContent, setCommentContent] = useState("")
    const useId = getUser().userId;
    const commentInput = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const editInput = useRef(null);
    const [editCommentContent, setEditCommentContent] = useState();
    const [editCommentId, setEditCommentId] = useState()
    const logAction = useRef(null);

    const [displayedComments, setDisplayedComments] = useState([]);
    const [workCommentList, setWorkCommentList] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [moreDrawerVisible, setMoreDrawerVisible] = useState(false);
    const [hoverItem, setHoverItem] = useState();


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
                }
            })
        }
    }

    /**
     * 获取评论列表
     */
    const getCommentList = (value) => {
        findWorkCommentPage(value).then(res => {
            // setDisplayedComments(res.data.dataList.slice(0,3))
            // if (res.data.dataList.length > 3){
            //     setHasMore(true)
            // }
            // setWorkCommentList(res.data.dataList)
            // setTotalRecord(res.data.totalRecord)
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    }
    useEffect(() => {
        let initValue = {
            workItemId: workId,
            pageParam:{currentPage: 1, pageSize: 10}
        }
        getCommentList(initValue)
        return;
    }, [workId, inputComment])

    /**
     * 打开评论输入框
     */
    const changeInput = () => {
        setIsInPut(true)
    }

    useEffect(() => {
        if (isInput) {
            commentInput.current.focus({
                preventScroll: true,
                cursor: 'end',
            });
        }
        return;
    }, [isInput])

    /**
     * 更新评论
     */
    const submitEditComment = (id) => {
        const data = {
            id: id,
            details: editCommentContent,
            workItem: { id: workId },
            updateTime: moment().format('YYYY-MM-DD'),
            user: { id: useId }
        }
        updateWorkComment(data).then(res => {
            if (res.code === 0) {
                getCommentList()
                setEditCommentId()
            }
        })
    }

    /**
     * 删除评论
     */
    const deleteComment = (id) => {
        deleteWorkComment({ id: id }).then(res => {
            if (res.code === 0) {
                getCommentList()

            }
        })
    }
    /**
     * 翻页
     */
    const changePage = (page, pageSize) => {
        getCommentList({pageParam:{currentPage: page, pageSize: 10}})
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

    const showMore = () => {
        setMoreDrawerVisible(true)
    };
    const workComment = useRef(null);
    return (<>
        {/*<div className="other-title">*/}
        {/*    评论*/}
        {/*</div>*/}
        <div className="work-comment" ref = {workComment}>
            <div className="work-comment-list-box">
                <WorkCommentInput
                    workId={workId}
                    // reSizeDetailRowHeight={reSizeDetailRowHeight}
                    // reSetDetailRowHeight={reSetDetailRowHeight}
                />
                {
                    commentList && commentList.length > 0 ?
                        <Fragment>
                            {/*<div className="title">共{totalRecord}条</div>*/}
                            <div className="work-comment-list">
                                {
                                    commentList && commentList.length > 0 && commentList.map(item => {
                                        // if (displayedComments.includes(item)){
                                            return <div className="comment-item" key={item.id}
                                                        onMouseEnter={() => setHoverItem(item.id)}
                                                        onMouseLeave={() => setHoverItem()}
                                            >
                                                <UserIcon size="big" name={item.user?.nickname ? item.user?.nickname : item.user?.name} />
                                                <div style={{width: "100%"}}>
                                                    <div className="comment-top">
                                                        <div className="comment-user">
                                                            <span className="user-name">{item.user?.nickname ? item.user?.nickname : item.user?.name}</span>
                                                            <span className="user-date">{item.createTime}</span>
                                                        </div>

                                                        <div ref={logAction}>
                                                            {
                                                                hoverItem === item.id &&
                                                                <div className="comment-operate" >
                                                                    <DeleteModal deleteFunction={deleteComment} id={item.id} getPopupContainer={logAction.current} />
                                                                    {/*<div onClick={() => {deleteComment(item.id)}}*/}
                                                                    {/*     className={"operate-text"}*/}
                                                                    {/*>*/}
                                                                    {/*    删除*/}
                                                                    {/*</div>*/}
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="comment-content">
                                                        {item.details}
                                                    </div>
                                                </div>
                                            </div>
                                        // }
                                    })
                                }
                            </div>
                            {
                                totalRecord > currentPage * pageSize ?
                                    <div className="work-comment-more" onClick={loadNextPage}>加载更多</div>
                                    :
                                    <div className="work-comment-more"></div>
                            }
                        </Fragment> :
                        <div style={{textAlign: "center"}}>暂无评论</div>
                }
            </div>

            <WorkCommentMoreDrawer
                moreDrawerVisible={moreDrawerVisible}
                setMoreDrawerVisible={setMoreDrawerVisible}
                submitEditComment={submitEditComment}
                deleteComment={deleteComment}
                getCommentList={getCommentList}
                workId={workId}
            />

        </div>
    </>
    )
}

export default observer(WorkComment);