import { observable,  action } from "mobx";
import {Axios} from "tiklab-core-ui";

/**
 * teamWire 查询
 */
export class WorkItemStore {
	@observable demandInfo ;

	@action
	getDemandInfo = (value) =>{
		this.demandInfo = value
	}

	/**
	 * 项目查询
	 * @param values
	 * @returns {Promise<*>}
	 */
	@action
	findProjectList = async (values) => {
		const res = await Axios.post("/teamWire/findProjectList",values);
		if(res.code === 0) {
			return res.data;
		}
	}

	/**
	 * 需求查询
	 * @param values
	 * @returns {Promise<*>}
	 */
	@action
	findWorkItemList = async (values) =>  await Axios.post("/teamWire/findWorkItemList",values);

	@action
	findWorkItem = async (id,repositoryId) => {
		const param = new FormData();
		param.append("id",id)
		param.append("repositoryId",repositoryId)
		return  await Axios.post("/teamWire/findWorkItem",param);
	}

	/**
	 * 创建缺陷
	 * @param values
	 * @returns {Promise<unknown>}
	 */
	@action
	createWorkItem =async (values) => await Axios.post("/teamWire/createWorkItem",values);


}
const workItemStore = new WorkItemStore();
export default workItemStore

