import {Button, Input} from "antd";
import React, {useEffect, useRef, useState} from "react";
const { TextArea } = Input;
import WorkCommentStore from "../store/WorkCommentStore";
import "./WorkCommentInput.scss"
import {getUser} from "tiklab-core-ui";
import moment from 'moment';

const WorkCommentInput = (props) => {
    const { workId, reSizeDetailRowHeight, reSetDetailRowHeight } = props;
    const [isInput, setIsInPut] = useState(false);
    const { createWorkComment, findWorkCommentPage, findWorkCommentList, updateWorkComment, deleteWorkComment, setInputComment } = WorkCommentStore;
    const [commentContent, setCommentContent] = useState("")
    const commentInput = useRef(null);
    const useId = getUser().userId;


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
                    reSetDetailRowHeight()
                    setCommentContent("")
                    getCommentList({ workItemId: workId })
                    setInputComment()
                }
            })
        }
    }

    const onCancel = () => {
        setCommentContent("")
        reSetDetailRowHeight()
        setIsInPut(false);
    }

    /**
     * 获取评论列表
     */
    const getCommentList = (value) => {
        findWorkCommentPage(value).then(res => {
            // setCommentList(res.data)
            // setTotalRecord(res.data.totalRecord)
        })
    }

    /**
     * 打开评论输入框
     */
    const changeInput = () => {
        setIsInPut(true)
        reSizeDetailRowHeight()
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

    return(
        <div className="work-comment-input">
            <div className="work-comment-box">
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

    )
}
export default WorkCommentInput;