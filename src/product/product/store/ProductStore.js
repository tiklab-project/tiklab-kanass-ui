import {action, observable} from "mobx";
import {Service} from "../../../common/utils/requset";

export class ProductStore {
    @observable uselist = [];
    @observable productList = [];
    @observable allProductList = [];
    @observable projectRelevance = [];
    @observable noRelatedProjects = [];
    @observable relatedProjects = [];
    @observable total = 0;
    @observable productPageParams = {
        orderParams: [{
            name: "creatTime",
            orderType: "desc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    }
    @observable projectPageParams = {
        orderParams: [{
            name: "projectName",
            orderType: "asc"
        }],
        pageParam: {
            pageSize: 10,
            currentPage: 1
        }
    }

    @observable type = "add";
    @observable visible = false;

    @action
    setType = (value) => {
        this.type = value
    }

    @action
    setVisible = (value) => {
        this.visible = value
    }

    // 合并搜索条件
    @action
    setProductSearchCondition = (value) => {
        this.productPageParams = Object.assign(this.productPageParams,  { ...value })
    }

    /**
     * 获取全部系统成员
     * @returns
     */
    @action
    getUseList = async() => {
        const data = await Service("/user/user/findAllUser")
        if(data.code === 0){
            this.uselist = data.data;
        }
        return data
    }

    /**
     * 添加产品
     * @param {*} values
     * @returns
     */
    @action
    addProduct = async (values) => {
        const data = await Service("/product/createProduct", values);
        return data;
    }

    /**
     * 获取产品列表
     * @param {*} value
     * @returns
     */
    @action
    getProductlist = async(value) => {
        this.setProductSearchCondition(value)
        const data = await Service("/product/findProductList", this.productPageParams);
        if(data.code === 0){
            this.productList = data.data;
        }
        return data;
    }

    /**
     * 删除产品
     * @param {产品id} values
     * @returns
     */
    @action
    deleProduct = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/product/deleteProduct", param);
        // if(data.code === 0){
        //     this.getProductlist()
        // }
        return data;
    }

    // 
    /**
     * 按照id查找产品
     * @param {产品id} values
     * @returns
     */
    @action
    findProduct = async(values) => {
        const param = new FormData()
        param.append("id", values)
        const data = await Service("/product/findProduct", param);
        return data;
    }

    /**
     * 更新产品
     * @param {*} values
     * @returns
     */
    @action
    updateProduct = async(values) => {
        const data = await Service("/product/updateProduct", values);
        return data;
    }

    /**
     * 获取产品关联项目
     * @param {*} values
     * @returns
     */
    @action
    findProjectList = async(values) => {
        Object.assign(this.projectPageParams, { ...values })
        const data = await Service("/product/findProjectList", this.projectPageParams);
        this.projectRelevance = data.data
        return data;
    }

    /**
     * 获取产品已关联和未关联的项目列表
     * @returns
     */
    @action
    findProjectIsOrNotRe = async() => {
        const data = await Service("/product/findProjectIsOrNotRe");
        if (data.code === 0) {
            this.noRelatedProjects = data.data.noRelatedProjects;
            this.relatedProjects = data.data.relatedProjects;
        }
        return data;
    }

    /**
     * 更新产品与项目的关联
     * @param {*} value
     * @returns
     */
    @action
    updateProject = async(value) => {
        const data = await Service("/project/updateProject", value);
        return data;
    }

    /**
     * 添加产品的关联项目
     * @param {*} value
     * @returns
     */
    addRelevance = async(value) => {
        const data = await Service("/product/addRelevance ", value);

        return data;
    }

    /**
     * 查找所有产品
     * @returns
     */
    findAllProduct = async(value) => {
        const data = await Service("/product/findJoinProductList", value);
        if(data.code === 0){
            this.productList = data.data;
            this.allProductList = data.data
        }

        return data;
    }

    findJoinProductList = async(value) => {
        const data = await Service("/product/findJoinProductList", value);
        if(data.code === 0){
            this.productList = data.data;
        }
        return data;
    }

    @action
    findProductPage = async (value) => {
        Object.assign(this.productPageParams, value)
        const data = await Service("/product/findProductPage", this.productPageParams);
        if(data.code === 0){
            this.productList = data.data.dataList;
            this.total = data.data.totalRecord;
        }
        return data;
    }

    findProductSortRecentTime = async(value) => {
        const data = await Service("/product/findProductSortRecentTime", value);

        return data;
    }
    /**
     * 添加产品收藏
     * @param {*} value
     * @returns
     */
    @action
    createProductFocus = async(value) => {
        const data = await Service("/productFocus/createProductFocus", value);
        return data;
    }

    /**
     *
     * @param {*} value
     * @returns
     */
    @action
    findProductFocusList = async(value) => {

        const data = await Service("/productFocus/findProductFocusList", value);
        return data;
    }

    @action
    deleteProductFocusByQuery = async(value) => {
        const data = await Service("/productFocus/deleteProductFocusByQuery", value);
        return data;
    }

    @action
    findRecentProductList = async(params) => {
        const data = await Service("/product/findRecentProductList", params);
        // if(data.code === 0){
        //     this.productList = data.data;
        // }
        return data;
    }

    @action
    findFocusProductList = async(value) => {
        const params = {
            orderParams: [{
                name: "recentTime",
                orderType: "asc"
            }]
        }
        const data = await Service("/product/findFocusProductList", params);
        if(data.code === 0){
            this.productList = data.data;
        }
        return data;
    }

    @action
    createRecent = async (value) => {
        const data = await Service("/recent/createRecent", value);
        return data;

    }

    /**
     * 上传icon
     */
    @action
    creatIcon = async (value) => {
        const data = await Service("/icon/createIcon", value)
        return data;

    }

    //获取项目icon
    @action
    findIconList = async (params) => {
        const data = await Service("/icon/findIconList", params)
        return data;
    }

    @action
    findProductCount = async () => {
        const data = await Service("/product/findProductCount", this.productPageParams);
        return data;
    }
}

export default new ProductStore();