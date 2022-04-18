import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Button, Select, Menu, Dropdown, Popconfirm, message } from 'antd';
import { DownOutlined, CodepenOutlined } from '@ant-design/icons';
import "../components/work.scss";
import { WorkList } from "./workList";
import WorkTable from "./workTable";
import WorkBodar from "./workBodar";
import WorkAddModel from "./workAddModel";
import { PrivilegeProjectButton } from "doublekit-privilege-ui";
import { PluginComponent, PLUGIN_STORE, PluginFun } from "doublekit-plugin-ui";

import { observer, inject } from "mobx-react";
import { useTranslation } from 'react-i18next'
import { getUser } from "doublekit-core-ui";

const WorkItem = (props) => {
    // 查找表单
    const [form] = Form.useForm();
    const workListFather = useRef()

    const { workStore, workCalendarStore } = props;


    // 解析store数据
    const { getProlist, getSelectUserList,
        projectList, userList,
        workTypeList, getWorkType, searchCondition,
        setSearchCondition, workStatus, workStatusList,
        getWorkConditionPage, getWorkConditionPageTree, setWorkShowType,
        workShowType, getWorkBoardList, getWorkGanttListTree,
        workListTime, setWorkId, workId, setWorkIndex, setViewType, viewType,
        boardGroup,setBoardGroup,findWorkUserGroupBoardList,findWorkTypeIds
    } = workStore;
    const projectId = localStorage.getItem("projectId")
    const sprintId = localStorage.getItem("sprintId")
    const [stateType, setState] = useState()
    const workType = props.match.params.type ? props.match.params.type : null;
    useEffect(async() => {
        let initValues = {}
        if (props.match.path === "/index/prodetail/sprintdetail") {
            initValues = { projectId: [projectId], sprintIds: [sprintId]};
        }
        if (props.location.pathname === "/index/prodetail/work") {
            initValues = { projectIds: [projectId]}
        }
        if (props.match.path === "/index/prodetail/scrum/:type") {
            initValues = { projectIds: [projectId]}
        }
        
        if(workType){
            await findWorkTypeIds({code: workType}).then(data => {
                initValues = {workTypeIds: data.data,...initValues}
            })
        }
        setSearchCondition({...initValues})
        getWorkList();
        getProlist();
        getSelectUserList(projectId);
        getWorkType()
        workStatus()
        initFrom();
        return;
    }, [workType])

    const getWorkList = () =>{
        switch (workShowType) {
            case "list":
                if (viewType === "tile") {
                    getPageList();
                } else if (viewType === "tree") {
                    getPageTree({ userId: getUser().userId });
                }
                break;
            case "table":
                if (viewType === "tile") {
                    getWorkConditionPage();
                } else if (viewType === "tree") {
                    getWorkConditionPageTree({ userId: getUser().userId });
                }
                break;
            case "bodar":
                getWorkBoardList();
                break;
            default:
                break;
        }
    }


    const pluginGantt = new PluginFun(props, 'work-gantt', {});
    const configGantt = pluginGantt.getPlugins();

    const pluginCalendar = new PluginFun(props, 'work-calendar', {});
    const configCalendar = pluginCalendar.getPlugins();

    const pluginImportModal = new PluginFun(props, 'import-modal', {});
    const importModal = pluginImportModal.getPlugins();

    // 切换视图类型
    const onGenderChange = value => {
        setWorkShowType(value)
        switch (value) {
            case "list":
                if (viewType === "tile") {
                    getPageList();
                } else if (viewType === "tree") {
                    getPageTree({ userId: getUser().userId });
                }
                break;
            case "table":
                if (viewType === "tile") {
                    getWorkConditionPage();
                } else if (viewType === "tree") {
                    getWorkConditionPageTree({ userId: getUser().userId });
                }
                break;
            case "bodar":
                getWorkBoardList();
                break;
            default:
                break;
        }
    };

    //切换平铺或者树状
    const changTileOrTree = (value) => {
        setViewType(value)
        switch(value) {
            case "tile":
                if (workShowType === "list") {
                    getPageList();
                } else if (workShowType === "table") {
                    getWorkConditionPage();
                }
                break;
            case "tree":
                if (workShowType === "list") {
                    getPageTree({ userId: getUser().userId });
                } else if (workShowType === "table") {
                    getWorkConditionPageTree({ userId: getUser().userId });
                }
                break;
            default:
                break;
        }
    }
    /**
     * 初始化表格
     * @param {*} value 
     */
    const initFrom = () => {
        form.setFieldsValue({
            projectIds: searchCondition.projectIds ? searchCondition.projectIds : [],
            workTypeIds: searchCondition.workTypeIds ? searchCondition.workTypeIds : [],
            workStatusIds: searchCondition.workStatusIds ? searchCondition.workStatusIds : [],
            title: searchCondition.title ? searchCondition.title : "",
            assignerIds: searchCondition.assignerIds ? searchCondition.assignerIds : []
        })
    }

    const getPageTree = (value) => {
        getWorkConditionPageTree(value).then((res) => {
            if (res.dataList.length > 0) {
                if (props.route.path === "/index/prodetail/workMessage/:id") {
                    setWorkId(props.match.params.id)
                } else {
                    setWorkId(res.dataList[0].id)
                }
                setWorkIndex(1)
            }
        })
    }

    const getPageList = (value) => {
        getWorkConditionPage(value).then((res) => {
            if (res.dataList.length > 0) {
                if (props.route.path === "/index/prodetail/workMessage/:id") {
                    setWorkId(props.match.params.id)
                } else {
                    setWorkId(res.dataList[0].id)
                }
                setWorkIndex(1)
            }
        })
    }

    const workAddModel = useRef()

    // 添加事务，选择事务类型
    const selectAddType = (e) => {
        const params = { type: e.key, id: workId, title: `添加${e.item.props.name}`, typework: e.item.props.typework }
        setState(params)
        workAddModel.current.setShowAddModel(true)
    }

    //查找事务
    const search = values => {
        if ((workShowType === "list" || workShowType === "table") && viewType === "tree") {
            getWorkConditionPageTree(values).then((res) => {
                if (workShowType === "list") {
                    workListFather.current.changeWork(res.dataList[0].id, 1);
                }
            })
        }
        if ((workShowType === "list" || workShowType === "table") && viewType === "tile") {
            getWorkConditionPage(values).then((res) => {
                if (workShowType === "list") {
                    workListFather.current.changeWork(res.dataList[0].id, 1);
                }
            })
        }
        if (workShowType === "bodar") {
            getWorkBoardList(values)
        }
        if (workShowType === "time") {
            getWorkGanttListTree(values)
        }
    };

    const menu = (
        <Menu onClick={selectAddType}>
            {
                workTypeList && workTypeList.map((item) => {
                    return <Menu.Item key={item.id} name={item.name} typework={item.category} icon={<CodepenOutlined />}>
                        {item.name}
                    </Menu.Item>
                })
            }
        </Menu>
    );

    // 插件下拉框
    const [isModalVisible, setIsModalVisible] = useState(false);
    const menuPlugin = (
        <Menu>
            <Menu.Item>
                {
                    importModal.length > 0 ? <div onClick={() => importFile()}>导入</div> :
                        <Popconfirm
                            title="此服务需要购买，确认购买?"
                            okText="Yes"
                            cancelText="No"
                        >
                            <div onClick={() => buy()}>导入?</div>
                        </Popconfirm>
                }
            </Menu.Item>
        </Menu>
    );
    const importFile = () => {
        setIsModalVisible(true);
    };

    const buy = () => {
        message.info('暂未开通购买渠道')
    }

    const handleChange = () => {
        form.validateFields().then((values) => {
            search(values)
        })
    }

    const changGroup = (value) => {
        setBoardGroup(value)
        if(value === "assinger"){
            findWorkUserGroupBoardList()
        }
    }
    return (
        <div className="work">
            <Form
                form={form}
                name="control-hooks"
                onFinish={search}
                layout="inline"
                className="work-head"

            >
                <div className="work-head-left">
                    {
                        props.location.pathname == "/index/work/worklist" &&
                        <Form.Item name="projectIds" rules={[{ required: false }]} >
                            <Select
                                mode="multiple"
                                placeholder="项目"
                                allowClear
                                className="work-select"
                                key="projectIds"
                                style={{ minWidth: '80px' }}
                                onChange={handleChange}
                            >
                                {
                                    projectList && projectList.map((item) => {
                                        return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    }

                    {/* <Form.Item name="workTypeIds" rules={[{ required: false }]} >
                        <Select
                            mode="multiple"
                            placeholder="类型"
                            allowClear
                            className="work-select"
                            key="workTypeIds"
                            style={{ minWidth: '80px' }}
                            onChange={handleChange}
                            maxTagCount={1}
                        >
                            {
                                workTypeList && workTypeList.map((item) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item> */}

                    <Form.Item name="workStatusIds" rules={[{ required: false }]} >
                        <Select
                            mode="multiple"
                            placeholder="状态"
                            allowClear
                            className="work-select"
                            key="status"
                            style={{ minWidth: '80px' }}
                            onChange={handleChange}
                            maxTagCount={1}
                        >
                            {
                                workStatusList && workStatusList.map((item) => {
                                    return <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item name="assignerIds" rules={[{ required: false }]} >
                        <Select
                            mode="multiple"
                            placeholder="负责人"
                            allowClear
                            className="work-select"
                            key="assigner"
                            style={{ minWidth: '80px' }}
                            onChange={handleChange}
                            maxTagCount={1}
                        >
                            {
                                userList && userList.map((item) => {
                                    return <Select.Option value={item.user.id} key={item.user.id}>{item.user.name}</Select.Option>
                                })
                            }
                        </Select>
                    </Form.Item>

                    <Form.Item name="title">
                        <Input
                            placeholder="搜索事项"
                            allowClear
                            onChange={handleChange}
                            style={{ width: "100px" }}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">搜索</Button>
                    </Form.Item>
                </div>

                <div className="work-head-right">
                    <Select
                        placeholder="列表"
                        onChange={onGenderChange}
                        allowClear
                        className="right-item"
                        key="select5"
                        defaultValue={workShowType}
                    >
                        <Select.Option value="list" key="list">列表</Select.Option>
                        <Select.Option value="table" key="table">表格</Select.Option>
                        <Select.Option value="bodar" key="bodar">看板</Select.Option>
                        {
                            configGantt.length > 0 && <Select.Option value="time" key="time">甘特图</Select.Option>
                        }
                        {
                            configCalendar.length > 0 && <Select.Option value="calendar" key="calendar">日历视图</Select.Option>
                        }
                    </Select>
                    {
                        (workShowType === "list" || workShowType === "table" )&& 
                        <Select value={viewType} 
                            className="right-item" 
                            style={{ width: "80px" }} 
                            onChange={(vlaue) => changTileOrTree(vlaue)}
                        >
                            <Select.Option value="tile">平铺</Select.Option>
                            <Select.Option value="tree">树状</Select.Option>
                        </Select>
                    }
                    {
                        workShowType === "bodar" && 
                        <Select 
                            value={boardGroup}
                            className="right-item" 
                            style={{ width: "80px" }} 
                            onChange={(vlaue) => changGroup(vlaue)}
                        >
                            <Select.Option value="nogroup">无分组</Select.Option>
                            <Select.Option value="assinger">经办人</Select.Option>
                            {/* <Select.Option value="tree">状态</Select.Option> */}
                        </Select>
                    }
                    <PrivilegeProjectButton code={'WorkAdd'} domainId={projectId}>
                        <Dropdown trigger="click" overlay={menu} className="right-item">
                            <Button>
                                +添加事项 <DownOutlined />
                            </Button>
                        </Dropdown>
                    </PrivilegeProjectButton>
                    <Dropdown overlay={menuPlugin} placement="bottom" className="right-item" arrow>
                        <Button> 更多... </Button>
                    </Dropdown>
                    <PluginComponent point="import-modal" props={{ useTranslation }} pluginsStore={props.pluginsStore} extraProps={{ isModalVisible: isModalVisible, setIsModalVisible: setIsModalVisible }} />
                </div>
            </Form>
            {
                workShowType === "list" &&
                <WorkList {...props}
                    workListFather={workListFather}
                ></WorkList>
            }
            {
                workShowType === "table" &&
                <WorkTable {...props} ></WorkTable>
            }
            {
                workShowType === "bodar" &&
                <WorkBodar {...props}></WorkBodar>
            }
            {
                workShowType === "time" &&
                <PluginComponent
                    point="work-gantt"
                    pluginsStore={props.pluginsStore}
                    extraProps={{ workListTime: workListTime, getWorkGanttListTree: getWorkGanttListTree, sprintId: sprintId, pathName: props.location.pathname }}
                />
            }
            {
                workShowType === "calendar" &&
                <PluginComponent point="work-calendar"
                    pluginsStore={props.pluginsStore}
                    extraProps={{ workCalendarStore: workCalendarStore }}
                />
            }
            <WorkAddModel workAddModel={workAddModel} state={stateType} {...props} />
        </div>
    )
}
export default inject("workStore", "workCalendarStore", PLUGIN_STORE)(observer(WorkItem));