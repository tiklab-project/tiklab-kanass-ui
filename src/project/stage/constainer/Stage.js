/*
 * @Descripttion: 路线图页面
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-15 16:52:29
 */
import React, { useEffect, useState } from "react";
import { observer, inject } from "mobx-react";
import "../component/Stage.scss"
import InputSearch from "../../../common/input/InputSearch";
import { Select, Empty, Row, Col, Tabs } from 'antd';
import Breadcumb from "../../../common/breadcrumb/Breadcrumb";
import Button from "../../../common/button/Button";
import LineMapStage from "../component/StagelineMap";
import StageAddModal from "../component/StageAddModal";

const Stage = (props) => {
    const { stageStore } = props;
    const [stageList, setStageList] = useState([])
    const [parent, setParentId] = useState();
    const [addChild, setAddChild] = useState();
    const [showStageAddMoal, setShowStageAddModal] = useState(false);
    const { findStageList } = stageStore;
    const projectId = props.match.params.id;

    useEffect(() => {
        findStageList({ projectId: projectId, stageParentNull: true }).then(res => {
            if (res.code === 0) {
                setStageList(res.data)
            }
        })
    }, [])
    const onSearch = (value) => {
        findStageList({ projectId: projectId, stageName: value }).then(res => {
            if (res.code === 0) {
                setStageList(res.data)
            }
        })
    }
    const addStage = () => {
        setShowStageAddModal(true)
        setAddChild("father")
        setParentId(null)
    }
    return (
        <Row style={{ height: "100%" }}>
            <Col lg={{ span: 24 }} xxl={{ span: "18", offset: "3" }}>
                <div className="stage">
                    <Breadcumb
                        firstText="阶段"
                    ></Breadcumb>
                    <div className="stage-contant">
                        <div className="stage-action">
                            <InputSearch
                                placeholder="阶段名字"
                                allowClear
                                style={{ width: 300 }}
                                onChange={onSearch}
                            />
                            <Button type="primary" onClick={() => addStage()}>
                                添加阶段
                            </Button>
                        </div>
                        <div>
                            <LineMapStage 
                                data={stageList} 
                                setShowStageAddModal={setShowStageAddModal} 
                                setParentId={setParentId}
                                setAddChild={setAddChild} 
                            />
                        </div>
                        <StageAddModal
                            showStageAddMoal={showStageAddMoal}
                            setShowStageAddModal={setShowStageAddModal}
                            setStageList={setStageList}
                            parent={parent}
                            addChild={addChild}
                        />

                    </div>
                </div>
            </Col>
        </Row>

    )
}
export default inject(
    "stageStore"
)(observer(Stage));