import { observable,  action } from "mobx";
import {Axios} from "tiklab-core-ui";

export class WorkItemBindStore {
	@observable workItemBindList = [];


	/**
	 * 查询绑定的缺陷
	 */
	@action
	findWorkItemBindPage = async (values) => {
		const params = {
			...values,
			orderParams: [{
				name:'createTime',
				orderType:'desc'
			}],
		}

		const res = await Axios.post("/workItemBind/findWorkItemBindPage",params);
		if(res.code === 0) {
			this.workItemBindList = res.data.dataList;
			return res.data;
		}
	}

	@action
	deleteWorkItemBind = async (id) => {
		const param = new FormData();
		param.append('id', id);

		await Axios.post("/workItemBind/deleteWorkItemBind",param);
	}

    @action
	createWorkItemBind =async (values) => await Axios.post("/workItemBind/createWorkItemBind",values);

	@action
	updateWorkItemBind = async (values) => await Axios.post("/workItemBind/updateWorkItemBind",values)

	@action
	findWorkItemBind =async (id) => {
		const param = new FormData();
		param.append('id', id);
		const res = await Axios.post("/workItemBind/findWorkItemBind",param);

		if( res.code === 0){
			return res.data;
		}
	}



}

let workItemBindStore = new WorkItemBindStore();
export default workItemBindStore;

