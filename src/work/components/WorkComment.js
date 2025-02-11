/*
 * @Descripttion: 事项评论
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-24 14:10:13
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-26 14:31:48
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import { Input, Button, Empty, Pagination, Modal, Col } from "antd";
import "./WorkComment.scss";
import { getUser } from 'tiklab-core-ui';
import { observer } from "mobx-react";
import moment from 'moment';
import WorkCommentStore from "../store/WorkCommentStore";
import ProjectEmpty from "../../common/component/ProjectEmpty";
const { TextArea } = Input;

const WorkComment = (props) => {
    const { workId } = props;
    const { createWorkComment, findWorkCommentPage, updateWorkComment, deleteWorkComment } = WorkCommentStore;
    const [isInput, setIsInPut] = useState(false);
    const [commentContent, setCommentContent] = useState("")
    const useId = getUser().userId;
    const commentInput = useRef(null);
    const [commentList, setCommentList] = useState();
    const [totalRecord, setTotalRecord] = useState(0);
    const editInput = useRef(null);
    const [editCommentContent, setEditCommentContent] = useState();
    const [editCommentId, setEditCommentId] = useState()

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
            setCommentList(res.data.dataList)
            setTotalRecord(res.data.totalRecord)
        })
    }
    useEffect(() => {
        getCommentList({ workItemId: workId })
        return;
    }, [workId])

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
        getCommentList({ current: page })
    }
    const workComment = useRef(null);
    return (<>
        <div className="work-comment" ref = {workComment}>
            <div className="work-comment-box">
                <svg className="icon-32" aria-hidden="true">
                    <use xlinkHref="#icon-icontouxiang1"></use>
                </svg>
                <div className={`comment-botton ${isInput ? "comment-botton-hidden" : null}`} onClick={() => changeInput()}>请输入评论...</div>
                <div className={`comment-input ${isInput ? "comment-input-show" : null}`}>
                    <TextArea
                        rows={4}
                        className="comment-text"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        ref={commentInput}
                    />
                    <div className="comment-submit">
                        <Button type="primary" className="submit" onClick={() => submitComment()}>发布</Button>
                        <Button className="cancel" onClick={() => setIsInPut(false)}>取消</Button>
                    </div>
                </div>

            </div>
            <div className="work-comment-list-box">
                {
                    totalRecord && totalRecord > 0 ?
                        <Fragment>
                            <div className="title">共{totalRecord}条</div>
                            <div className="work-comment-list">
                                {
                                    commentList && commentList.length > 0 && commentList.map(item => {
                                        return <div className="comment-item" key={item.id}>
                                            <div className="comment-user">
                                                <svg className="menu-icon" aria-hidden="true">
                                                    <use xlinkHref="#icon-icontouxiang1"></use>
                                                </svg>
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
                                                        <div className="comment-operate">
                                                            <span onClick={() => setEditCommentId(item.id)}>编辑</span>
                                                            <span onClick={() => deleteComment(item.id)}>删除</span>
                                                            <span>赞</span>
                                                        </div>
                                                    </Fragment>

                                            }
                                        </div>
                                    })
                                }
                            </div>
                            <div style={{ textAlign: "right", width: "100%", marginTop: "10px" }}>
                                <Pagination
                                    defaultCurrent={1}
                                    pageSize={6}
                                    total={totalRecord}
                                    onChange={(page, pageSize) => changePage(page, pageSize)}
                                />
                            </div>
                        </Fragment> : <ProjectEmpty description = {"暂无评论"} />
                }
            </div>
        </div>
    </>
    )
}

export default observer(WorkComment);