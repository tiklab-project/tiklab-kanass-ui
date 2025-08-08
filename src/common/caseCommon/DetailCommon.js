import React, {useEffect, useState} from "react";
import {Form, Row, Col, TreeSelect, Select,  Drawer} from "antd";
import {DownOutlined} from "@ant-design/icons";
import Input from "antd/es/input/Input";
import {inject, observer} from "mobx-react";
import {Axios} from "tiklab-core-ui";
import CaseDesc from "./CaseDesc";
import IconCommon from "./IconCommon";
import ReviewResultDisplay from "./ReviewResultDisplay";
import "./detailCommonStyle.scss"

const {Option} = Select
const tailLayout = {
    labelCol:{span: 6}
};

/**
 * 用于详情
 */
const DetailCommon = (props) =>{
    const {categoryStore,updateCase,form,demand,detailInfo} = props;
    const {findCategoryListTreeTable,categoryTableList} = categoryStore;
    const [userList, setUserList] = useState([]);
    const [drawerVisible, setDrawerVisible] = useState(false);

    const projectId = localStorage.getItem("projectId")
    useEffect(()=>{
        findCategoryListTreeTable(projectId)
    },[])

    useEffect(async ()=>{
        const params = {domainId:projectId};
        const res = await Axios.post("/dmUser/findDmUserPage",params);
        if(res.code===0){
            setUserList(res.data.dataList)
        }
    },[])

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const onDrawerClose = () => {
        setDrawerVisible(false);
    };

    return(
        <div >
            <div
                style={{
                    cursor:"pointer",
                    fontSize: "12px",
                    color:"#a8a8a8",
                }}
                onClick={showDrawer}
            >
                <DownOutlined />
            </div>
            
            <Drawer
                title="基本信息详情"
                placement="right"
                onClose={onDrawerClose}
                visible={drawerVisible}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={updateCase}
                    className={"base-info-form"}
                    style={{padding: " 0 15px"}}
                >
                    {/*<Form.Item label={"名称"} name="name">*/}
                    {/*    <Input placeholder={"名称"}/>*/}
                    {/*</Form.Item>*/}
                    
                    {/*<Form.Item label={"用例类型"}>*/}
                    {/*    <div style={{margin: "0 0 0 10px"}}>*/}
                    {/*        {showCaseTypeInList(detailInfo?.testCase?.caseType)}*/}
                    {/*    </div>*/}
                    {/*</Form.Item>*/}
                    
                    <Form.Item label={"责任人"} name="director">
                        <Select placeholder={"未设置"}>
                            {
                                userList && userList.map(item => {
                                    return <Option key={item?.user?.id}
                                                   value={item?.user?.id}>{item?.user?.nickname}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    
                    {/*<Form.Item label={"状态"} name="status">*/}
                    {/*    <Select placeholder={"未设置"}>*/}
                    {/*        <Option value={0}><Tag color="#bfc4c6">未开始</Tag></Option>*/}
                    {/*        <Option value={1}><Tag color="#76b6f1">进行中</Tag></Option>*/}
                    {/*        <Option value={2}><Tag color="#f29e9ee8">结束</Tag></Option>*/}
                    {/*    </Select>*/}
                    {/*</Form.Item>*/}
                    
                    <Form.Item label={"模块"} name="category">
                        <TreeSelect
                            style={{width: '100%'}}
                            dropdownStyle={{
                                maxHeight: 400,
                                overflow: 'auto',
                            }}
                            placeholder="未设置"
                            allowClear
                            treeDefaultExpandAll
                            treeData={categoryTableList.map(item => ({
                                title: item.name,
                                key: item.id,
                                value: item.id,
                                children: item.children?.map(child => ({
                                    title: child.name,
                                    key: child.id,
                                    value: child.id,
                                    children: child.children?.map(grandChild => ({
                                        title: grandChild.name,
                                        key: grandChild.id,
                                        value: grandChild.id
                                    }))
                                }))
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label={"优先级"} name="priorityLevel" >
                        <Select placeholder={"未设置"} style={{flex: 1}}>
                            <Option value={0}>
                                <div className={"display-flex-gap"}>
                                    <IconCommon
                                        className={"icon-s"}
                                        icon={"icon_level1"}
                                        style={{cursor: "pointer"}}
                                    />
                                    <div>低</div>
                                </div>
                            </Option>
                            <Option value={1}>
                                <div className={"display-flex-gap"}>
                                    <IconCommon
                                        className={"icon-s"}
                                        icon={"icon_level2"}
                                        style={{cursor: "pointer"}}
                                    />
                                    <div>中</div>
                                </div>
                            </Option>
                            <Option value={2}>
                                <div className={"display-flex-gap"}>
                                    <IconCommon
                                        className={"icon-s"}
                                        icon={"icon_level3"}
                                        style={{cursor: "pointer"}}
                                    />
                                    <div>高</div>
                                </div>
                            </Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label={"创建时间"} name="createTime" >
                        <Input disabled={true} placeholder={"创建时间"} />
                    </Form.Item>
                    
                    <Form.Item label={"更新时间"} name="updateTime" >
                        <Input disabled={true}  placeholder={"更新时间"}/>
                    </Form.Item>
                    
                    <Form.Item label={"评审"} name="reviewResult" >
                        <ReviewResultDisplay />
                    </Form.Item>
                    
                    {
                        demand
                            ?<Form.Item label={"关联需求"} name="updateTime" >
                                {demand}
                            </Form.Item>
                            :null
                    }
                </Form>
                
                <div style={{marginTop: '20px',padding: " 0 15px"}}>
                    <CaseDesc form={form} updateCase={updateCase}/>
                </div>
            </Drawer>
        </div>
    )
}

export default inject("categoryStore")(observer(DetailCommon));