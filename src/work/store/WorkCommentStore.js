/*
 * @Descripttion: 事项评论接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2024-12-27 09:22:37
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-27 10:20:48
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

    // 创建事项评论
    @action
    createWorkComment = async (value) => {
        const data = await Service("/workComment/createWorkComment", value)
        return data;
    }

    // 获取事项评论
    @action
    findWorkCommentPage = async (value) => {
        Object.assign(this.workCommentPage, { ...value });
        const data = await Service("/workComment/findWorkCommentPage", this.workCommentPage)
        return data;
    }

    // 更新事项评论
    @action
    updateWorkComment = async (value) => {
        const data = await Service("/workComment/updateWorkComment", value)
        return data;
    }

    // 删除事项评论
    @action
    deleteWorkComment = async (value) => {
        const params = new FormData();
        params.append("id", value.id)
        const data = await Service("/workComment/deleteWorkComment", params)
        return data;
    }
}

export default new WorkCommentStore();