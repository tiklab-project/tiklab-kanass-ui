import React, { useState, useEffect } from "react";
import Button from "../../../common/button/Button";
import EpicLineMap from "./EpicLineMap";
import InputSearch from "../../../common/input/InputSearch";
import EpicAddModal from "./EpicAddModal"
import "./Epic.scss"
import { withRouter } from "react-router";
import { observer, inject } from "mobx-react";
const EpicPage = (props) => {
    const { epicStore } = props;
    const [epicList, setEpicList] = useState([])
    const [parent, setParentId] = useState();
    const [addChild, setAddChild] = useState();
    const [showEpicAddMoal, setShowEpicAddModal] = useState(false);
    const { findEpicList } = epicStore;
    const projectId = props.match.params.id;

    useEffect(() => {
        findEpicList({ projectId: projectId, epicParentNull: true }).then(res => {
            if (res.code === 0) {
                setEpicList(res.data)
            }
        })
    }, [])
    const onSearch = (value) => {
        findEpicList({ projectId: projectId, epicName: value }).then(res => {
            if (res.code === 0) {
                setEpicList(res.data)
            }
        })
    }
    const addEpic = () => {
        setShowEpicAddModal(true)
        setAddChild("father")
        setParentId(null)
    }
    return <div className="epic">
        <div className="epic-action">
            <InputSearch
                placeholder="需求集名字"
                allowClear
                style={{ width: 300 }}
                onChange={onSearch}
            />
            <Button type = "primary" onClick={() => addEpic()}>
                添加需求集
            </Button>
        </div>
        <div>
            <EpicLineMap data={epicList} setShowEpicAddModal={setShowEpicAddModal} setParentId={setParentId}
            setAddChild={setAddChild} />
        </div>
        <EpicAddModal
            showEpicAddMoal={showEpicAddMoal}
            setShowEpicAddModal={setShowEpicAddModal}
            setEpicList={setEpicList}
            parent={parent}
            addChild={addChild}
        />

    </div>
}

export default withRouter(inject("epicStore")(observer(EpicPage)));