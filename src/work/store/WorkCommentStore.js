/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-24 15:01:00
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-11-26 14:34:25
 */
import { observable, action } from "mobx";
import { Service } from "../../common/utils/requset";
export class WorkCommentStore {
    @observable workCommentPage = {
        orderParams: [{
            name: "createTime",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    };

    @action
    createWorkComment = async (value) => {
        const data = await Service("/workComment/createWorkComment", value)
        return data;
    }

    @action
    findWorkCommentPage = async (value) => {
        Object.assign(this.workCommentPage, { ...value });
        const data = await Service("/workComment/findWorkCommentPage", this.workCommentPage)
        return data;
    }

    @action
    updateWorkComment = async (value) => {
        const data = await Service("/workComment/updateWorkComment", value)
        return data;
    }

    @action
    deleteWorkComment = async (value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workComment/deleteWorkComment", params)
        return data;
    }
}

export default new WorkCommentStore();