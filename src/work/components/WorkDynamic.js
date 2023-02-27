/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-03-03 16:36:24
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-03 18:23:31
 */
import React, { useEffect, useState } from "react";
import { inject, observer } from "mobx-react";
import "./WorkDynamic.scss"
import { Empty, Row, Col } from 'antd';
import "./WorkDynamic.scss"
const WorkDynamic = (props) => {
    const { workDynamicStore, workStore } = props;
    const { findlogpage } = workDynamicStore;
    const { workId } = workStore;
    const [list, setList] = useState([])
    useEffect(() => {
        findlogpage({workItemId: workId}).then(data => {
            if(data.code === 0){
                setList(data.data.dataList)
            }
            
        })
        return;
    }, [workId])

    return <>
        {/* <Row justify="start" style={{ height: "calc(100vh - 180px)", overflow: "auto" }}>
            <Col lg={{ span: "22" }} xl={{ span: "18" }}> */}
                {/* <div className="workitem-dynamic-title">事项动态({list.length})</div> */}
                <div className="work-dynamic"> 
                    {
                        list && list.length > 0 ? list.map(item => {
                            return <div
                                dangerouslySetInnerHTML={{ __html: item.data }}
                                className="todo-item"
                            />
                        }) :
                            <Empty />
                    }
                </div>
            {/* </Col>
        </Row> */}

    </>


}
export default inject(
    "workDynamicStore"
)(observer(WorkDynamic));