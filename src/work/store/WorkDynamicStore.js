/*
 * @Descripttion: 事项动态接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2024-12-27 09:22:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:20:46
 */
import { observable, action, extendObservable } from "mobx";
import {Service} from "../../common/utils/requset";
export class WorkDynamicStore {
    @observable dynamicList = [];
    @observable logList = [];
    @observable logTimeList = [];
    @observable opLogCondition = {
        pageParam: {
            pageSize: 20,
            currentPage: 1,
            totalPage: 1,
            total: 1
        },
        bgroup: "kanass",
        data: {}
    }


    @observable opLogTimeCondition = {
        pageParam: {
            pageSize: 10,
            currentPage: 1,
            totalPage: 1,
            total: 1
        },
        bgroup: "kanass",
        data: {}
    }

    @action
    setOpLogCondition = (value) => {
        this.opLogCondition = extendObservable(this.opLogCondition, { ...value })
    }

    // 获取事项动态
    @action
    findLogpage = async (value) => {
        this.setOpLogCondition(value)
        const data = await Service("/oplog/findlogpage", this.opLogCondition);
        if (data.code === 0) {
            const dataList = data.data.dataList;
            this.opLogCondition.pageParam.totalPage = data.data.totalPage;
            this.opLogCondition.pageParam.total = data.data.totalRecord;
            this.logList = []
            if (dataList.length > 0) {
                dataList.map(item => {
                    const date = item.createTime.slice(0, 10);
                    const list1 = this.logList.filter(dateItem => dateItem.date === date)
                    if (list1.length > 0) {
                        this.logList.map(dateItem => {
                            if (dateItem.date === date) {
                                dateItem.children.push(item)
                            }
                            return dateItem;
                        })
                    } else {
                        this.logList.push({
                            date: date,
                            children: [item]
                        })
                    }
                })
            }
            console.log(this.logList)
        }
        return data;
    }

    // 根据时间排序获取事项动态
    @action
    findLogPageByTime = async (value) => {
        Object.assign(this.opLogTimeCondition, value)
        const data = await Service("/oplog/findLogPageByTime", this.opLogTimeCondition);
        if (data.code === 0) {
            this.logTimeList = data.data.dataList;
            this.opLogTimeCondition.pageParam.total = data.data.totalRecord;
            this.opLogTimeCondition.pageParam.totalPage = data.data.totalPage;
        }
    }
}


export default new WorkDynamicStore();
