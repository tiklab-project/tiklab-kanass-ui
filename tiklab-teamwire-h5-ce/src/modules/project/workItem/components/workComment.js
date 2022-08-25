/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-24 14:10:13
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-11-26 14:34:52
 */
import React, { useEffect, useState, useRef, Fragment } from "react";
import {  Button, Empty, TextArea } from 'antd-mobile';
import "./workComment.scss";
import { getUser } from 'tiklab-core-ui';
import { inject, observer } from "mobx-react";
import moment from 'moment';
import { withRouter } from "react-router";

const WorkComment = (props) => {
    const { workCommentStore } = props;
    const { createWorkComment, findWorkCommentPage, updateWorkComment, deleteWorkComment } = workCommentStore;
    const [isInput, setIsInPut] = useState(false);
    const [commentContent, setCommentContent] = useState("")
    const useId = getUser().userId;
    const commentInput = useRef(null);
    const [commentList, setCommentList] = useState();
    const [totalRecord, setTotalRecord] = useState(0);
    const editInput = useRef(null);
    const [editCommentContent, setEditCommentContent] = useState();
    const [editCommentId, setEditCommentId] = useState()
    const workId = props.match.params.id;
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
        console.log(page, pageSize)
        getCommentList({ current: page })
    }
    return  <div className="work-comment">
                <div className="work-comment-box">
                    <svg className="user-icon" aria-hidden="true">
                        <use xlinkHref="#icon-touxiang"></use>
                    </svg>
                    <div className={`comment-botton ${isInput ? "comment-botton-hidden" : null}`} onClick={() => changeInput()}>请输入评论...</div>
                    <div className={`comment-input ${isInput ? "comment-input-show" : null}`}>
                        <TextArea
                            rows={2}
                            className="comment-text"
                            defaultValue={commentContent}
                            onChange={(e) => setCommentContent(e)}
                            ref={commentInput}
                        />
                        <div className="comment-submit">
                            <Button size='mini' type="primary" className="submit" onClick={() => submitComment()}>发布</Button>
                            <Button size='mini' className="cancel" onClick={() => setIsInPut(false)}>取消</Button>
                        </div>
                    </div>

                </div>
                <div className="work-comment-list-box">
                    {
                        totalRecord && totalRecord > 0 ?
                            <Fragment>
                                <div className="title">评论({totalRecord})</div>
                                <div className="work-comment-list">
                                    {
                                        commentList && commentList.length > 0 && commentList.map(item => {
                                            return <div className="comment-item" key={item.id}>
                                                <div className="comment-user">
                                                    <svg className="user-icon" aria-hidden="true">
                                                        <use xlinkHref="#icon-touxiang"></use>
                                                    </svg>
                                                    <span className="user-name">{item.user.name}</span>
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
                                {/* <div style={{ textAlign: "right", width: "100%", marginTop: "10px" }}>
                                    <Pagination
                                        defaultCurrent={1}
                                        pageSize={6}
                                        total={totalRecord}
                                        onChange={(page, pageSize) => changePage(page, pageSize)}
                                    />
                                </div> */}
                            </Fragment> : <Empty />
                    }
                </div>
            </div>
}

export default withRouter(inject("workCommentStore")(observer(WorkComment)));