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
import "./workDynamic.scss"
import { constant } from "lodash";
const WorkDynamic = (props) => {
    const { workDynamicStore, workStore } = props;
    const { findDynamicList, dynamicList } = workDynamicStore;
    const { workId } = workStore;
    const [list,setList] = useState()
    useEffect(() => {
        const params = {
            modelId: workId,
            dynamicType: "update"
        }
        findDynamicList(params).then(data => {
            const list = data.data.map(item => {
                const contant = item.data;
                console.log(JSON.parse(contant));
                item.data = dymnamic(JSON.parse(contant));
                return item;
            })
            console.log(list)
            setList(list)
        });
    }, [workId])

    const dymnamic = (data) => {
        const contant = {
            key: "",
            oldValue: "",
            newValue: ""
        }
        const key = data.key;
        switch (key) {
            case "workPriority":
                contant.key = "优先级";
                contant.oldValue = data.oldValue.name;
                contant.newValue = data.newValue.name;
                break;
            case "assigner":
                contant.key = "优先级";
                contant.oldValue = data.oldValue.name;
                contant.newValue = data.newValue.name;
                break;
            case "reporter":
                contant.key = "报告人";
                contant.oldValue = data.oldValue.name;
                contant.newValue = data.newValue.name;
                break;
            case "sprint":
                contant.key = "所属迭代";
                contant.oldValue = data.oldValue.sprintName;
                contant.newValue = data.newValue.sprintName;
                break;
            case "module":
                contant.key = "所属模块";
                contant.oldValue = data.oldValue.moduleName;
                contant.newValue = data.newValue.moduleName;
                break;
            case "planBeginTime":
                contant.key = "计划开始日期";
                contant.oldValue = data.oldValue;
                contant.newValue = data.newValue;
                break;
            case "planEndTime":
                contant.key = "计划结束日期";
                contant.oldValue = data.oldValue;
                contant.newValue = data.newValue;
                break;
            case "percent":
                contant.key = "进度";
                contant.oldValue = data.oldValue;
                contant.newValue = data.newValue;
                break;
            case "planTakeupTime":
                contant.key = "计划用时";
                contant.oldValue = data.oldValue;
                contant.newValue = data.newValue;
                break; 
            default:
                break;
        }
        return contant;
    }
    return <div>
        {
            list && list.length > 0 && list.map(item => {
                return <div className="dynamic-item">
                    <svg className="dynamic-item-icon" aria-hidden="true">
                        <use xlinkHref="#icon1_user5"></use>
                    </svg>
                    <div>
                        <div>{item.user.name} 更改了 {item.data.key} {item.dynamicTime}</div>
                        <div>{item.data.oldValue} --- {item.data.newValue}</div>
                    </div>
                </div>
            })
        }

    </div>
}
export default inject(
    "workDynamicStore"
)(observer(WorkDynamic));