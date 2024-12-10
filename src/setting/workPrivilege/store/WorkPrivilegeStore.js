import { observable, action } from "mobx";
import { Service } from "../../../common/utils/requset";

export class WorkPrivilegeStore {
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
        Object.assign(this.roleCondition, params)
        const data = await Service("/role/findRolePageAndRoleUserNumber", this.roleCondition)
        return data;
    }

    @action
    findDmRolePageByNumber = async (params) => {
        const data = await Service("/dmRole/findDmRolePageByNumber", params)
        return data;
    }

    @action
    findVRolePage = async (params) => {
        const data = await Service("/vRole/findVRolePage", this.vroleCondition)
        return data;
    }
    
    @action
    createWorkItemFunction = async(params) => {
        const data = await Service("/workItemFunction/createWorkItemFunction", params)
        return data;
    }

    @action
    updateWorkItemFunction = async(params) => {
        const data = await Service("/workItemFunction/updateWorkItemFunction", params)
        return data;
    }

    @action
    updateWorkItemRoleAllFunctionDm = async(params) => {
        const data = await Service("/workItemRoleFunctionDm/updateWorkItemRoleAllFunctionDm", params)
        return data;
    }

    @action
    findWorkItemFunction = async (value) => {
        const params = new FormData();
        params.append("id", value.id);
        const data = await Service("/workItemFunction/findWorkItemFunction", params)
        return data;
    }

    @action
    findAllWorkItemFunction = async(params) => {
        const data = await Service("/workItemFunction/findAllWorkItemFunction", params)
        return data;
    }

    @action
    deleteWorkItemFunction = async(value) => {
        const params = new FormData();
        params.append("id", value.id);
        const data = await Service("/workItemFunction/deleteWorkItemFunction", params);
        return data;
    }

    @action
    findWorkPrivilegeList = async(params) => {
        const data = await Service("/workPrivilege/findWorkPrivilegeList", params)
        return data;
    }

    @action
    createWorkPrivilege = async(params) => {
        const data = await Service("/workPrivilege/createWorkPrivilege", params)
        return data;
    }

    @action
    findWorkPrivilege = async(value) => {
        const param = new FormData()
        param.append("id", value.id)
        const data = await Service("/workPrivilege/findWorkPrivilege", param)
        return data;
    }

    @action
    updateWorkItemRoleAllFunction= async(params) => {
        const data = await Service("/workItemRoleFunction/updateWorkItemRoleAllFunction", params)
        return data;
    }

    @action
    findWorkType = async(value) => {
        const params = new FormData();
        params.append("id", value.id);
        const data = await Service("/workType/findWorkType", params)
        return data;
    }

    @action
    findWorkTypeDm = async(value) => {
        const params = new FormData();
        params.append("id", value.id);
        const data = await Service("/workTypeDm/findWorkTypeDm", params)
        return data;
    }

    @action
    findFormFieldList = async(value) => {
        
        const data = await Service("/formField/findFormFieldList", value)
        return data;
    }

    @action
    findRoleUserList = async(value) => {
        const params = new FormData();
        params.append("roleId", value.id);
        const data = await Service("/role/count/findRoleUserList", params)
        return data;
    }

    @action
    findWorkItemRoleFunctionList = async(value) => {
        const data = await Service("/workItemRoleFunction/findWorkItemRoleFunctionList", value)
        return data;
    }
    
    @action
    findWorkItemRoleFunctionDmList = async(value) => {
        const data = await Service("/workItemRoleFunctionDm/findWorkItemRoleFunctionDmList", value)
        return data;
    }

    @action
    findRole = async(value) => {
        const params = new FormData();
        params.append("id", value.id);
        const data = await Service("/role/findRole", params)
        return data;
    }

    @action
    findVRole = async(value) => {
        const params = new FormData();
        params.append("id", value.id);
        const data = await Service("/vRole/findVRole", params)
        return data;
    }
}

export default new WorkPrivilegeStore();