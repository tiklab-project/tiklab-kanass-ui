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
const { TextArea } = Input;

const WorkComment = (props) => {
    const { workId, commentInputRef } = props;
    const { createWorkComment, findWorkCommentPage, findWorkCommentList, updateWorkComment, deleteWorkComment, inputComment } = WorkCommentStore;
    const [isInput, setIsInPut] = useState(false);
    const [commentContent, setCommentContent] = useState("")
    const useId = getUser().userId;
    const commentInput = useRef(null);

    const [totalRecord, setTotalRecord] = useState(0);
    const editInput = useRef(null);
    const [editCommentContent, setEditCommentContent] = useState();
    const [editCommentId, setEditCommentId] = useState()
    const logAction = useRef(null);

    const [displayedComments, setDisplayedComments] = useState([]);
    const [workCommentList, setWorkCommentList] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [moreDrawerVisible, setMoreDrawerVisible] = useState(false);

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
            setDisplayedComments(res.data.dataList.slice(0,3))
            if (res.data.dataList.length > 3){
                setHasMore(true)
            }
            setWorkCommentList(res.data.dataList)
            // setTotalRecord(res.data.totalRecord)
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

        Modal.confirm({
            title: '确定删除?',
            centered: true,
            className: "delete-modal",
            getContainer: workComment.current,
            onOk() { deleteData(id) },
            onCancel() { },
        });

        const deleteData = () => {
            deleteWorkComment({ id: id }).then(res => {
                if (res.code === 0) {
                    getCommentList()

                }
            })
        }

    }
    /**
     * 翻页
     */
    const changePage = (page, pageSize) => {
        getCommentList({pageParam:{currentPage: page, pageSize: 10}})
    }

    const showMore = () => {
        setMoreDrawerVisible(true)
    };
    const workComment = useRef(null);
    return (<>
        <div className="other-title">
            评论:
        </div>
        <div className="work-comment" ref = {workComment}>
            <div className="work-comment-list-box">
                {
                    workCommentList && workCommentList.length > 0 ?
                        <Fragment>
                            {/*<div className="title">共{totalRecord}条</div>*/}
                            <div className="work-comment-list">
                                {
                                    workCommentList && workCommentList.length > 0 && workCommentList.map(item => {
                                        if (displayedComments.includes(item)){
                                            return <div className="comment-item" key={item.id}>
                                                <div className="comment-user">
                                                    {/*<svg className="menu-icon" aria-hidden="true">*/}
                                                    {/*    <use xlinkHref="#icon-icontouxiang1"></use>*/}
                                                    {/*</svg>*/}
                                                    <UserIcon size="big" name={item.user?.nickname ? item.user?.nickname : item.user?.name} />
                                                    <span className="user-name">{item.user?.nickname ? item.user?.nickname : item.user?.name}</span>
                                                    <span className="user-date">{item.createTime}</span>
                                                </div>
                                                {
                                                    editCommentId === item.id ? <div className="comment-input">
                                                            <TextArea
                                                                rows={4}
                                                                className="comment-text"
                                                                defaultValue={item.details}
                                                                onChange={(e) => setEditCommentContent(e.target.value)}
                                                                ref={editInput}
                                                            />
                                                            <div className="comment-submit">
                                                                <Button type="primary" className="submit" onClick={() => submitEditComment(item.id)}>发布</Button>
                                                                <Button className="cancel" onClick={() => setEditCommentId()}>取消</Button>
                                                            </div>
                                                        </div>
                                                        : <Fragment>
                                                            <div className="comment-content">
                                                                {item.details}
                                                            </div>
                                                            <div className="comment-operate" ref={logAction}>
                                                                <svg className="img-icon-right" aria-hidden="true" style={{ cursor: "pointer", marginRight: "10px" }}
                                                                     onClick={() => setEditCommentId(item.id)}>
                                                                    <use xlinkHref="#icon-edit"></use>
                                                                </svg>
                                                                <DeleteModal deleteFunction={deleteComment} id={item.id} getPopupContainer={logAction.current} />
                                                                {/*<span onClick={() => setEditCommentId(item.id)}>编辑</span>*/}
                                                                {/*<span onClick={() => deleteComment(item.id)}>删除</span>*/}
                                                                {/*<span>赞</span>*/}
                                                            </div>
                                                        </Fragment>

                                                }
                                            </div>
                                        }
                                    })
                                }
                            </div>
                            {/*<div style={{ textAlign: "right", width: "100%", marginTop: "10px" }}>*/}
                            {/*    <Pagination*/}
                            {/*        defaultCurrent={1}*/}
                            {/*        defpageSize={10}*/}
                            {/*        total={totalRecord}*/}
                            {/*        onChange={(page, pageSize) => changePage(page, pageSize)}*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </Fragment> : <ProjectEmpty description = {"暂无评论"} />
                }
                {
                    hasMore &&
                    <div className="work-comment-more" onClick={showMore}>--查看更多--</div>
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