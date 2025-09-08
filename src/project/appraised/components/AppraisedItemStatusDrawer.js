import React, {Fragment, useEffect, useRef, useState} from "react";
import {Drawer, Form, Radio, Input, Button, Empty, Space} from "antd";
import { observer, inject } from "mobx-react";
import AppraisedHistoryStore from "../store/AppraisedHistoryStore";
import UserIcon from "../../../common/UserIcon/UserIcon";
import "./AppraisedItemStatusDrawer.scss"
import { getUser, applyJump } from "tiklab-core-ui";
import moment from "moment/moment";
import {showTextStatus} from "../../../common/caseCommon/CaseCommonFn";
import {setSessionStorage} from "../../../common/utils/setSessionStorage";
import WorkDetailDrawer from "../../../work/components/WorkDetailDrawer";
import WorkStore from "../../../work/store/WorkStore";
import WikiRepositoryStore from "../../wiki/repository/store/WikiRepositoryStore";
import FunctionContentDrawerView from "../../../test/function/components/appraisedDrawerView/FunctionContentDrawerView";

const AppraisedItemStatusDrawer = (props) => {
    const { appraisedHistoryList, createAppraisedHistory, searchAppraisedHistoryPage, totalPage } = AppraisedHistoryStore
    const {visible, setVisible, appraisedItemStore, searchTable} = props;
    const {getRecordId, setRecordId, updateAppraisedWorkItem, recordId, findAppraisedItemById} = appraisedItemStore;
    const {setWorkId, workId} = WorkStore;
    const { findSystemUrl } = WikiRepositoryStore;
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
        appraisedItemState:"",
        advice:""
    })
    const [workItemDetailVisible, setWorkItemDetailVisible] = useState(false);
    const [testCaseDetailVisible, setTestCaseDetailVisible] = useState(false);
    const [caseId, setCaseId] = useState();
    /**
     * 更新评审事项
     * @param formData
     */
    const updateItem = (formData) => {
        const recordId = getRecordId();
        const param = {
            id:recordId,
            appraisedItemState:formData.appraisedItemState,
            advice:formData.advice
        }
        console.log(JSON.stringify(param));
        updateAppraisedWorkItem(param).then(() => {
            // setVisible(false)
            setEdit(false)
            searchTable();
            findAppraisedItemById(getRecordId()).then(data => {
                if (data.code === 0){
                    setAppraisedInfo(data.data)
                    form.setFieldsValue({
                        appraisedItemState:data.data.appraisedItemState,
                        advice:data.data.advice,
                    })
                    setSelectedValue(data.data.appraisedItemState)
                }
            })
            // 新增历史记录
            const historyParam = {
                appraisedItemId: getRecordId(),
                appraisedItemState:formData.appraisedItemState,
                advice:formData.advice,
                creater: {id: getUser().userId},
            }
            createAppraisedHistory(historyParam).then(res => {
                setCurrentPage(1)
                searchAppraisedHistoryPage({
                    appraisedItemId: getRecordId(),
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
            appraisedItemId: getRecordId(),
            pageParam:{
                pageSize: 5,
                currentPage: currentPage + 1
            }
        })
    }


    useEffect(() => {
        if (visible){
            findAppraisedItemById(getRecordId()).then(data => {
                if (data.code === 0){
                    // setWorkTitle(data.data.workItem.title)
                    setAppraisedInfo(data.data)
                    if (data.data.appraisedItemState === "1" || data.data.appraisedItemState === "2"){
                        setEdit(false)
                    }else {
                        setEdit(true)
                    }
                    form.setFieldsValue({
                        appraisedItemState:data.data.appraisedItemState,
                        advice:data.data.advice,
                    })
                }
                setSelectedValue(data.data.appraisedItemState)
                // cleanAppraisedHistoryList();
            })
            setCurrentPage(1)
            searchAppraisedHistoryPage({
                appraisedItemId: getRecordId(),
                pageParam:{
                    pageSize: 5,
                    currentPage: 1
                }
            })
        }
        // setSelectedValue()
    },[visible])

    const goWorkItemDetail = (workItem) => {
        setWorkId(workItem.id)
        const pathname = props.match.url;
        setSessionStorage("detailCrumbArray", [{ id: workItem.id, code: workItem.code, title: workItem.title, iconUrl: workItem.workTypeSys.iconUrl }])
        props.history.push(`${pathname}/work/${workItem.id}`)
        setWorkItemDetailVisible(true);
    }

    const goTestCaseDetail = (testCase) => {
        const pathname = props.match.url;
        props.history.push(`${pathname}/testCase/${testCase.id}`)
        setCaseId(testCase.id)
        setTestCaseDetailVisible(true);
    }

    const goDocumentDetail = (data) => {
        if (data.exist) {
            findSystemUrl({ name: "sward" }).then(res => {
                let kanassUrl;
                if (res.code === 0 && res.data.length > 0) {
                    kanassUrl = res.data[0]?.systemUrl
                }
                if (data.documentType === "document") {
                    applyJump(`${kanassUrl}/#/repository/${data.kanassRepositoryId}/doc/rich/${data.id}`);
                } else {
                    applyJump(`${kanassUrl}/#/repository/${data.kanassRepositoryId}/doc/markdown/${data.id}`);
                }
            })
        } else {
            return
        }

    }

    const renderAppraisedContent = () => {
        if (!appraisedInfo) {return (<></>);}
        switch (appraisedInfo?.appraisedType.id) {
            case "000000" :{
                const workItem = appraisedInfo?.workItem;
                return (
                    <div className="appraised-detail-grid" onClick={() => {goWorkItemDetail(workItem)}}>
                        <DetailItem className={"detail-title"} onClick={() => {goWorkItemDetail(workItem)}}
                                    label="事项名称" value={workItem?.title} />
                        <DetailItem label="事项类型" value={workItem?.workTypeSys?.name} />
                        <DetailItem label="状态" value={workItem?.workStatusNode.name} />
                        <DetailItem label="负责人" value={workItem?.assigner?.nickname} />
                    </div>
                )
            }
            case "111111":{
                const testCase = appraisedInfo?.testCase;
                return (
                    <div className="appraised-detail-grid">
                        <DetailItem  className={"detail-title"} onClick={() => {goTestCaseDetail(testCase)}}
                            label="用例名称" value={testCase?.name} />
                        <DetailItem label="用例类型" value={"功能用例"} />
                        <DetailItem label="状态" value={showTextStatus(testCase?.status)} />
                        <DetailItem label="负责人" value={testCase?.updateUser?.nickname} />
                    </div>
                )
            }
            case "222222":
            case "333333":{
                const projectDocument = appraisedInfo?.projectDocument;
                return (
                    <div className="appraised-detail-grid">
                        <DetailItem className={"detail-title"} onClick={() => {goDocumentDetail(projectDocument?.kanassDocument)}}
                                    label="文档名称" value={projectDocument?.kanassDocument?.documentName} />
                        <DetailItem label="知识库" value={projectDocument?.kanassDocument?.kanassRepositoryName} />
                        <DetailItem label="作者" value={projectDocument?.kanassDocument?.userName} />
                    </div>
                )
            }
        }
    }


    const DetailItem = ({ label, value, className, onClick }) => {
        const itemClass = `detail-item ${className}`.trim();
        return(
            <div className={itemClass} onClick={onClick}>
                <span className="detail-label">{label}:</span>
                <span className="detail-value">{value || '-'}</span>
            </div>
        );
    };
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
                        <Form.Item name="title" label="评审对象">
                            {renderAppraisedContent()}
                        </Form.Item>
                        <Form.Item name="appraisedItemState" label="评审意见">
                            {
                                appraisedInfo?.appraisedItemState === "0" ?
                                    <Radio.Group onChange={(e) => setSelectedValue(e.target.value)}>
                                        <Radio value="1">通过</Radio>
                                        <Radio value="2">不通过</Radio>
                                    </Radio.Group>
                                    :
                                    <Space>
                                        {
                                            appraisedInfo?.appraisedItemState === "1" ?
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
                <WorkDetailDrawer
                    isModalVisible={workItemDetailVisible}
                    setIsModalVisible={setWorkItemDetailVisible}
                    searchTable={searchTable}
                    {...props}
                />
                <FunctionContentDrawerView
                    isModalVisible={testCaseDetailVisible}
                    setIsModalVisible={setTestCaseDetailVisible}
                    caseId={caseId}
                    {...props}
                />
            </div>
        </Drawer>
    )
}
export default inject("appraisedItemStore")(observer(AppraisedItemStatusDrawer));