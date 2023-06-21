/*
 * @Descripttion: 史诗页面 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-03-30 10:14:58
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-19 11:10:30
 */
import React, { useState, useEffect } from "react";
import Button from "../../../common/button/Button";
import EpicLineMap from "./EpicLineMap";
import InputSearch from "../../../common/input/InputSearch";
import EpicAddModal from "./EpicAddModal"
import "./Epic.scss"
import { withRouter } from "react-router";
import { observer, Provider } from "mobx-react";
import EpicStore from '../store/EpicStore';
const EpicPage = (props) => {
    const store = {
        epicStore: EpicStore
    }
    const { findEpicList } = EpicStore;
    // 史诗列表
    const [epicList, setEpicList] = useState([])
    // 若添加下级史诗，父级的id
    const [parent, setParentId] = useState();
    // 添加史诗的类型，第一级或者子级
    const [addChild, setAddChild] = useState();
    // 显示史诗添加弹窗
    const [showEpicAddModal, setShowEpicAddModal] = useState(false);
    // 项目id
    const projectId = props.match.params.id;

    /**
     * 获取第一级史诗
     */
    useEffect(() => {
        findEpicList({ projectId: projectId, epicParentNull: true }).then(res => {
            if (res.code === 0) {
                setEpicList(res.data)
            }
        })
    }, [])

    /**
     * 根据史诗名称搜索史诗
     * @param {*} value 
     */
    const onSearch = (value) => {
        findEpicList({ projectId: projectId, epicName: value }).then(res => {
            if (res.code === 0) {
                setEpicList(res.data)
            }
        })
    }

    /**
     * 添加史诗
     */
    const addEpic = () => {
        setShowEpicAddModal(true)
        setAddChild("father")
        setParentId(null)
    }

    return (
        <Provider {...store}>
            <div className="epic">
                <div className="epic-action">
                    <InputSearch
                        placeholder="需求集名字"
                        allowClear
                        style={{ width: 300 }}
                        onChange={onSearch}
                    />
                    <Button type="primary" onClick={() => addEpic()}>
                        添加需求集
                    </Button>
                </div>
                <div>
                    <EpicLineMap data={epicList} setShowEpicAddModal={setShowEpicAddModal} setParentId={setParentId}
                        setAddChild={setAddChild} />
                </div>
                <EpicAddModal
                    showEpicAddModal={showEpicAddModal}
                    setShowEpicAddModal={setShowEpicAddModal}
                    setEpicList={setEpicList}
                    parent={parent}
                    addChild={addChild}
                />

            </div>
        </Provider>

    )

}

export default withRouter(observer(EpicPage));