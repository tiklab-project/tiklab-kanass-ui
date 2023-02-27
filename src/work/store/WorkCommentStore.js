/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-11-24 15:01:00
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-11-26 14:34:25
 */
import { observable, action } from "mobx";
import { CreateWorkComment,FindWorkCommentPage,UpdateWorkComment,DeleteWorkComment } from "../api/WorkCommentApi"
export class WorkCommentStore {
    @observable workCommentPage = {
        current: 1,
        defaultCurrent: 1,
        pageSize: "6"
    };

    @action
    createWorkComment = async(value) => {
		const data = await CreateWorkComment(value);
        return data;
    }

    @action
    findWorkCommentPage = async(value) => {
        Object.assign(this.workCommentPage, {...value});
        let params = {
            workItemId: value.workItemId,
            sortParams: [{
                name: "createTime",
                orderType: "asc"
            }],
            pageParam: {
                pageSize: 6,
                currentPage: this.workCommentPage.current
            }
        }
		const data = await FindWorkCommentPage(params);
        return data;
    }

    @action
    updateWorkComment = async(value) => {
		const data = await UpdateWorkComment(value);
        return data;
    }

    @action
    deleteWorkComment = async(value) => {
        const params = new FormData();
        params.append("id",value.id)
		const data = await DeleteWorkComment(params);
        return data;
    }
}

export const WORKCOMMENT_STORE = "workCommentStore";