/*
 * @Descripttion: 计划入口页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-15 16:52:29
 */
import React, { useEffect, useState } from "react";
import { Provider } from "mobx-react";
import "../component/Stage.scss"
import InputSearch from "../../../common/input/InputSearch";
import { Row, Col } from 'antd';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";
import LineMapStage from "./StagelineMap";
import StageAddModal from "./StageAddModal";
import StageStore from "../store/StageStore";
import { observer } from "mobx-react";
const Stage = (props) => {
    const store = {
        stageStore: StageStore
    }
    const { findStageListTreePage, updateStage, stageList } = StageStore;
    // 添加子级的上级id
    const [parent, setParentId] = useState();
    // 添加类型 子级，顶级
    const [addChild, setAddChild] = useState();
    // 添加弹窗的显示参数
    const [showStageAddMoal, setShowStageAddModal] = useState(false);
    // 项目id
    const projectId = props.match.params.id;
    const [graph, setGraph] = useState()
    /**
     * 获取计划
     */
    useEffect(() => {
        /**
         * 获取第一级节点列表
         */
        findStageListTreePage({ projectId: projectId })
        return;
    }, [])

    const [archiveView, setArchiveView] = useState("week")
    const changeMonth = () => {
        setArchiveView("month");
        graph.dispose()
    }

    const changePage = () => {
        const values = {
            pageParam: {
                pageSize: 20,
                currentPage: searchCondition?.pageParam?.currentPage + 1,
            }
        }
        findStageListTreePage(values)
    }

    /**
     * 根据标题搜索计划
     * @param {标题} value 
     */
    const onSearch = (value) => {
        findStageListTreePage({ stageName: value })
    }

    /**
     * x显示添加弹窗
     */
    const addStage = () => {
        setShowStageAddModal(true)
        setAddChild("father")
        setParentId(null)
    }
    return (<Provider {...store}>
        <Row style={{ height: "100%" }}>
            <Col sm={24} md={24} lg={24} xl={24} xxl={24}>
                <div className="stage">
                    <Breadcumb
                        firstText="计划"
                    ></Breadcumb>
                    <div className="stage-contant">
                        <div className="stage-action">
                            <InputSearch
                                placeholder="计划名字"
                                allowClear
                                style={{ width: 300 }}
                                onChange={onSearch}
                            />

                            <div className="stage-action-right">
                                <div className="stage-view">
                                    <div className={`stage-view-item stage-view-week ${archiveView === "week" ? "stage-view-select" : ""}`} onClick={() => setArchiveView("week")}>周</div>
                                    <div className={`stage-view-item stage-view-month ${archiveView === "month" ? "stage-view-select" : ""}`} onClick={() => changeMonth()}>月</div>
                                </div>
                                <Button type="primary" onClick={() => addStage()}>
                                    添加计划
                                </Button>

                            </div>

                        </div>
                        <div>
                            <LineMapStage
                                data={stageList}
                                setShowStageAddModal={setShowStageAddModal}
                                setParentId={setParentId}
                                setAddChild={setAddChild}
                                updateStage={updateStage}

                                archiveView={archiveView}
                                graph={graph}
                                setGraph={setGraph}
                                changePage={changePage}
                            />
                        </div>
                        <StageAddModal
                            showStageAddMoal={showStageAddMoal}
                            setShowStageAddModal={setShowStageAddModal}
                            parent={parent}
                            addChild={addChild}
                        />

                    </div>
                </div>
            </Col>
        </Row>
    </Provider>

    )
}
export default observer(Stage);