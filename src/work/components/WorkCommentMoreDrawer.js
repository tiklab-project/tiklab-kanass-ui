import {withRouter} from "react-router";
import {observer} from "mobx-react";
import {Button, Drawer, Input, Pagination} from "antd";
import React, {Fragment, useEffect, useRef, useState} from "react";
import UserIcon from "../../common/UserIcon/UserIcon";
import DeleteModal from "../../common/deleteModal/deleteModal";
import WorkCommentStore from "../store/WorkCommentStore";
const { TextArea } = Input;

const WorkCommentMoreDrawer = (props) => {
    const { findWorkCommentPage, workCommentPage } = WorkCommentStore;
    const {moreDrawerVisible, setMoreDrawerVisible, submitEditComment, deleteComment, getCommentList, workId} = props;
    const [editCommentContent, setEditCommentContent] = useState();
    const editInput = useRef(null);
    const logAction = useRef(null);
    const [editCommentId, setEditCommentId] = useState()
    const [dataList, setDataList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageSize, setPageSize] = useState(10);


    const onClose = () => {
        setMoreDrawerVisible(false);
    };

    useEffect(() => {
        const params = {
            workItemId: workId,
        }
        findWorkCommentPage(params).then(res => {
            setDataList(res.data.dataList);
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    }, []);

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
            setDataList(res.data.dataList);
            setCurrentPage(res.data.currentPage)
            setTotalRecord(res.data.totalRecord)
            setPageSize(res.data.pageSize)
        })
    }



    return(
        <Drawer
            title="评论"
            placement="right"
            visible={moreDrawerVisible}
            onClose={onClose}
            width={"40%"}
        >


            <div className="work-comment">
                <div className="work-comment-list-box">
                    {
                        <Fragment>
                            {/*<div className="title">共{totalRecord}条</div>*/}
                            <div className="work-comment-list">
                                {
                                    dataList && dataList.length > 0 && dataList.map(item => {
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
                                    })
                                }
                            </div>
                        </Fragment>
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
}

export default withRouter(observer(WorkCommentMoreDrawer));