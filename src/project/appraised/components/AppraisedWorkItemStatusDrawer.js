import React, {Fragment, useEffect, useRef, useState} from "react";
import {Drawer, Form, Radio, Input, Button, Empty, Space} from "antd";
import { observer, inject } from "mobx-react";
import AppraisedHistoryStore from "../store/AppraisedHistoryStore";
import UserIcon from "../../../common/UserIcon/UserIcon";
import "./AppraisedWorkItemStatusDrawer.scss"
import {getUser} from "tiklab-core-ui";
import moment from "moment/moment";

const AppraisedWorkItemStatusDrawer = (props) => {
    const { appraisedHistoryList, createAppraisedHistory, searchAppraisedHistoryPage, totalPage } = AppraisedHistoryStore
    const {visible, setVisible, appraisedWorkItemStore, searchTable} = props;
    const {getRecordId, setRecordId, updateAppraisedWorkItem, recordId, findAppraisedWorkItemById} = appraisedWorkItemStore;
    const detailRef = useRef();

    const {TextArea} = Input

    const [selectedValue, setSelectedValue] = useState();
    const [workTitle, setWorkTitle] = useState("");
    const [appraisedInfo, setAppraisedInfo] = useState(null);
    const [edit, setEdit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [form] = Form.useForm();
    const [appraisedFormData, setAppraisedFormData] = useState({
        workItemAppraisedState:"",
        advice:""
    })
    /**
     * 更新评审事项
     * @param formData
     */
    const updateItem = (formData) => {
        const recordId = getRecordId();
        const param = {
            id:recordId,
            workItemAppraisedState:formData.workItemAppraisedState,
            advice:formData.advice
        }
        console.log(JSON.stringify(param));
        updateAppraisedWorkItem(param).then(() => {
            // setVisible(false)
            setEdit(false)
            searchTable();
            findAppraisedWorkItemById(getRecordId()).then(data => {
                if (data.code === 0){
                    setAppraisedInfo(data.data)
                    form.setFieldsValue({
                        workItemAppraisedState:data.data.workItemAppraisedState,
                        advice:data.data.advice,
                    })
                    setSelectedValue(data.data.workItemAppraisedState)
                }
            })
            // 新增历史记录
            const historyParam = {
                workAppraised:{id: getRecordId()},
                workItemAppraisedState:formData.workItemAppraisedState,
                advice:formData.advice,
                creater: {id: getUser().userId},
            }
            createAppraisedHistory(historyParam).then(res => {
                setCurrentPage(1)
                searchAppraisedHistoryPage({
                    workAppraisedId: getRecordId(),
                    pageParam:{
                        pageSize: 5,
                        currentPage: 1
                    }
                })
            })
        })
    }

    const loadNextPage = () => {
        setCurrentPage(currentPage + 1)
        searchAppraisedHistoryPage({
            workAppraisedId: getRecordId(),
            pageParam:{
                pageSize: 5,
                currentPage: currentPage + 1
            }
        })
    }


    useEffect(() => {
        if (visible){
            findAppraisedWorkItemById(getRecordId()).then(data => {
                if (data.code === 0){
                    setWorkTitle(data.data.workItem.title)
                    setAppraisedInfo(data.data)
                    if (data.data.workItemAppraisedState === "1" || data.data.workItemAppraisedState === "2"){
                        setEdit(false)
                    }else {
                        setEdit(true)
                    }
                    form.setFieldsValue({
                        workItemAppraisedState:data.data.workItemAppraisedState,
                        advice:data.data.advice,
                    })
                }
                setSelectedValue(data.data.workItemAppraisedState)
                // cleanAppraisedHistoryList();
            })
            setCurrentPage(1)
            searchAppraisedHistoryPage({
                workAppraisedId: getRecordId(),
                pageParam:{
                    pageSize: 5,
                    currentPage: 1
                }
            })
        }
        // setSelectedValue()
    },[visible])

    /**
     * 关闭详情抽屉
     */
    const closeModal = (e) => {

        let pathname = props.location.pathname; // props.location.pathname;
        const index = pathname.lastIndexOf("\/");
        pathname = pathname.substring(0, index);
        props.history.replace(`${pathname}`)
        setVisible(false)
        form.resetFields()
        setRecordId(0)
    }

    return  (
        <Drawer
            title={"评审意见"}
            placement="right"
            onClose={closeModal}
            visible={visible}
            destroyOnClose={true}
            width={"42%"}
            style={{ display: "flex", flexDirection: "column" }}
            bodyStyle={{ flex: 1, display: "flex", flexDirection: "column", padding: 0 }}
        >
            <div className="appraised-state">
                {/*<div className="appraised-state-top-title">*/}
                {/*    {workTitle}*/}
                {/*</div>*/}
                <div className="appraised-state-top">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={updateItem}>
                        <Form.Item name="title" label="评审事项">
                            {workTitle}
                        </Form.Item>
                        <Form.Item name="workItemAppraisedState" label="评审意见">
                            {
                                appraisedInfo?.workItemAppraisedState === "0" ?
                                    <Radio.Group onChange={(e) => setSelectedValue(e.target.value)}>
                                        <Radio value="1">通过</Radio>
                                        <Radio value="2">不通过</Radio>
                                    </Radio.Group>
                                    :
                                    <Space>
                                        {
                                            appraisedInfo?.workItemAppraisedState === "1" ?
                                                <>
                                                    <svg className="icon-20" aria-hidden="true">
                                                        <use xlinkHref="#icon-pass"></use>
                                                    </svg>
                                                    <div>
                                                        通过
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <svg className="icon-20" aria-hidden="true">
                                                        <use xlinkHref="#icon-unPass"></use>
                                                    </svg>
                                                    <div>
                                                        不通过
                                                    </div>
                                                </>
                                        }
                                    </Space>
                            }
                        </Form.Item>
                        <Form.Item name="advice" label="建议">
                            <Input.TextArea
                                rows={4}
                                placeholder="请输入评审建议..."
                                onFocus={() => setEdit(true)}  // 获取焦点时设置 edit=true
                                onBlur={() => setTimeout(() => setEdit(false), 200)}
                            />
                        </Form.Item>
                        {
                            edit &&
                            <Form.Item>
                                <div  style={{ textAlign: 'right' }}>
                                    <Button type={"primary"} htmlType={"submit"} >确认</Button>
                                    <Button onClick={(e) => closeModal(e)}>取消</Button>
                                </div>
                            </Form.Item>
                        }
                    </Form>
                </div>
                <div className="appraised-state-bottom">
                    <div className="appraised-state-bottom-title">
                        <span>评审历史</span>
                    </div>
                    {
                        appraisedHistoryList && appraisedHistoryList.length > 0 ?
                            <div className={"history-list"}>
                                {
                                    appraisedHistoryList.map(item => {
                                        return <div className="history-item" key={item.id}>
                                            <div className="history-top">
                                                <div className="history-user">
                                                    <UserIcon size="big" name={item.creater?.nickname ? item.creater?.nickname : item.creater?.name} />
                                                    <span className="user-name">{item.creater?.nickname ? item.creater?.nickname : item.creater?.name}</span>
                                                    <span className="user-date">{item.createTime.replace("T"," ").slice(0,19)}</span>
                                                </div>
                                            </div>
                                            {
                                                <Fragment>
                                                    <div className="history-content">
                                                        {item.advice}
                                                    </div>
                                                </Fragment>

                                            }
                                        </div>
                                    })
                                }
                                {
                                    totalPage > 1 &&
                                    <>
                                        {
                                            totalPage > currentPage ?
                                                <div className="history-list-bottom loading-more" onClick={() => loadNextPage()}>查看更多</div>
                                                :
                                                <div className="history-list-bottom">到底啦~</div>
                                        }
                                    </>
                                }
                            </div>
                            :
                            <Empty description={"暂无评审记录"}></Empty>
                    }
                </div>
            </div>
        </Drawer>
    )
}
export default inject("appraisedWorkItemStore")(observer(AppraisedWorkItemStatusDrawer));