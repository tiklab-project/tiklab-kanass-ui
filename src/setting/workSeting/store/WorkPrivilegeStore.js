import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset";

export class WorkPrivilege {
    @observable roleCondition = {
        pageParam: {
            pageSize: 20,
            currentPage: 1,
        }
    };

    @observable vroleCondition = {
        pageParam: {
            pageSize: 20,
            currentPage: 1,
        }
    };

    @action
    findRolePageAndRoleUserNumber = async (params) => {
        const data = await Service("/role/findRolePageAndRoleUserNumber", this.roleCondition)
        return data;
    }

    @action
    findVRolePage = async (params) => {
        const data = await Service("/vRole/findVRolePage", this.vroleCondition)
        return data;
    }

    @action
    findWorkFunctionList = async (params) => {
        const data = await Service("/workFunction/findWorkFunctionList", this.vroleCondition)
        return data;
    }

}

export default new WorkPrivilege();