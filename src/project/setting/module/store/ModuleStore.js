/*
 * @Descripttion: 模块接口
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-05-08 17:27:13
 */
import { observable, action } from "mobx";
import { Service } from "../../../../common/utils/requset"
export class ModuleStore {
    // 模块列表
    @observable 
    modulelist = [];

    // 查询模块的名称
    @observable 
    searchModuleName = "";

    // 分页参数
    @observable 
    searchCondition = {
    };
    

    /**
     * 获取模块列表
     */
    @action
	getmodule = async() => {
        const data = await Service("/module/findAllModule")
        if(data.code=== 0){
            this.modulelist = data.data;
        }
        return data;
    }
    
    /**
     * 添加模块
     * @param {*} values 
     */
    @action
	createModule = async(values) => {
        const data = await Service("/module/createModule", values)
        if(data.code === 0){
            this.findModulePage({projectId: values.project.id})
        }
        return data;
    }

    /**
     * 删除模块
     * @param {*} moduleId 
     * @param {*} projectId 
     */
    @action
	deleModule = async(moduleId) => {
        const param = new FormData()
        param.append("id", moduleId)
        const data = await Service("/module/deleteModule", param)
		if(data.code=== 0){
            this.findModulePage()
        }
        return data;
    }

    /**
     * 根据id 查找模块详情
     * @param {*} values 
     * @returns 
     */
    @action
	searchModuleById = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/module/findModule", param)
        return data;
		
    }

    /**
     * 编辑模块
     * @param {*} values 
     */
    @action
	editModuleById = async(values) => {
        const data = await Service("/module/updateModule", values)
        if(data.code===0){
            this.findModulePage(values.project.id,this.searchModuleName)
        }
        return data;
    }

    /**
     * 根据项目id查找模块，带分页
     * @param {*} projectId 
     * @param {*} moduleName 
     * @returns 
     */
    @action
	findModulePage = async(value) => {
        // Object.assign(this.searchCondition, { ...value })
        const data = await Service("/module/findModuleListTree", value)
        if(data.code===0){
            this.modulelist = data.data
        }
        return data;
    }

    /**
     * 设置分页参数
     * @param {*} value 
     */
    @action
    setPageParam = (value)=> {
        this.searchCondition = {...value}
    }
}

export default new ModuleStore();