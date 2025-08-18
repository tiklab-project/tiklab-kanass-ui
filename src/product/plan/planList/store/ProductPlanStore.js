import {action, observable} from "mobx";
import {Service} from "../../../../common/utils/requset";

export class ProductPlanStore {
    // 迭代列表
    @observable
    productPlanList = [];

    @observable
    total = 1;
    // 搜索迭代的名字
    @observable
    searchProductPlanName = [];

    // 搜索迭代的id
    @observable
    searchProductPlanId = [];

    // 成员列表
    @observable
    uselist = [];

    // 迭代查询分页参数
    @observable
    productPlanPageParams = {
        orderParams: [{
            name: "startTime",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 20,
            currentPage: 1
        }
    };

    // 迭代总数
    @observable
    totalRecord = "";

    // 迭代状态列表
    @observable
    productPlanStateList = []
    // 筛选状态
    @observable filterType = "pending"

    @action
    setProductPlanList = (value) => {
        this.productPlanList = value;
    }

    /**
     * 设置筛选状态
     * @param {*} value
     */
    @action
    setFilterType = (value) => {
        this.filterType = value
    }

    /**
     * 获取迭代列表
     */
    @action
    findAllProductPlan = async() => {
        const data = await Service("/productPlan/findAllProductPlan", params)
        if (data.code === 0) {
            this.productPlanList = data.data;
        }
        return data;
    }

    /**
     * 根据条件查询迭代列表带分页
     * @param {*} value
     * @returns
     */
    @action
    findProductPlanList = async (value) => {
        Object.assign(this.productPlanPageParams, { ...value })
        const data = await Service("/productPlan/findProductPlanList", this.productPlanPageParams)
        if (data.code === 0) {
            this.productPlanList = data.data;
        }
        return data.data;
    }

    @action
    findProductPlanPage = async (value) => {
        Object.assign(this.productPlanPageParams, { ...value })
        const data = await Service("/productPlan/findProductPlanPage", this.productPlanPageParams)
        if (data.code === 0) {
            this.productPlanList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data;
    }
    /**
     * 查找关注的迭代列表
     * @param {查询参数} value
     * @returns
     */
    @action
    findFocusProductPlanList = async (value) => {
        // Object.assign(this.productPlanPageParams, { ...value })
        const data = await Service("/productPlan/findFocusProductPlanList", value)
        if (data.code === 0) {
            this.productPlanList = data.data;
        }
        return data.data;
    }

    /**
     * 添加迭代
     * @param {迭代信息} values
     * @returns
     */
    @action
    addproductPlanlist = async (values) => {
        const data = await Service("/productPlan/createProductPlan", values)
        if (data.code === 0) {
            this.findProductPlanList()
        }
        return data;
    }

    /**
     * 删除迭代
     * @param {迭代id} values
     * @returns
     */
    @action
    deleproductPlanList = async (values) => {
        const param = new FormData()
        param.append("id", values)

        const data = await Service("/productPlan/deleteProductPlan", param)
        if (data.code === 0) {
            return data;
        }
    }

    /**
     * 根据id查找迭代
     * @param {迭代id} values
     * @returns
     */
    @action
    searchProductPlan = async (values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/productPlan/findProductPlan", param)
        if (data.code === 0) {
            return data;
        }

    }

    /**
     * 编辑迭代
     * @param {*} values
     * @returns
     */
    @action
    editProductPlan = async (values) => {
        const data = await Service("/productPlan/updateProductPlan", values)
        if (data.code === 0) {
            this.findProductPlanList(values.project.id, this.searchProductPlanName)
        }
        return data;
    }

    /**
     * 设置分页参数
     * @param {} value
     */
    @action
    setProductPlanPageParam = (value) => {
        this.productPlanPageParams = { ...value }
    }

    /**
     * 获取项目成员
     * @param {项目id} projectId
     */
    @action
    getUseList = async (projectId) => {
        const params = {
            domainId: projectId,
            pageParam: {
                pageSize: 10,
                currentPage: 1
            }
        }
        const data = await Service("/dmUser/findDmUserList", params)
        if (data.code === 0) {
            this.uselist = data.data;
        }
        return data;
    }

    /**
     * 查找全部迭代状态
     */
    @action
    findAllProductPlanState = async () => {
        const data = await Service("/productPlanState/findAllProductPlanState")
        // if (data.code === 0) {
        //     this.productPlanStateList = data.data;
        // }
        return data;
    }

    /**
     * 添加迭代关注
     * @param {*} value
     * @returns
     */
    @action
    createProductPlanFocus = async (value) => {
        const data = await Service("/productPlanFocus/createProductPlanFocus", value)
        return data;
    }

    /**
     * 查找迭代列表
     * @param {*} value
     * @returns
     */
    @action
    findProductPlanFocusList = async (value) => {
        const data = await Service("/productPlanFocus/findProductPlanFocusList", value)
        return data;
    }

    /**
     * 取消关注
     * @param {*} value
     * @returns
     */
    @action
    deleteProductPlanFocus = async (value) => {
        const data = await Service("/productPlanFocus/deleteProductPlanFocusByQuery", value)
        return data;
    }

    /**
     * 创建最近点击的
     * @param {最近点击的} value
     * @returns
     */
    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value)
        return data;
    }

    @action
    findProductPlanCount = async () => {

        const data = await Service("/productPlan/findProductPlanCount", this.productPlanPageParams)
        return data;
    }
}
export default new ProductPlanStore();