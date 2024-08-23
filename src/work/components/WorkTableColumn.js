import React from "react";
import UserIcon from "../../common/UserIcon/UserIcon";
import ImgComponent from "../../common/imgComponent/ImgComponent";



const setStatuStyle = (id) => {
    let name;
    switch (id) {
        case "todo":
            name = "work-status-todo";
            break;
        case "done":
            name = "work-status-done";
            break;
        default:
            name = "work-status-process";
            break;
    }
    return name;
}

const xxlColumn = (goProdetail, sortArray, actionColumn) => {
    return [
        {
            title: '序号',
            dataIndex: 'code',
            key: 'code',
            className: `work-first-col ${sortArray.indexOf("id") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => <div className="work-id work-first-col" onClick={() => goProdetail(record, index)}>
                <div className="work-icon">
                    <ImgComponent
                        src={record.workTypeSys?.iconUrl}
                        alt=""
                        className="menu-icon"

                    />
                </div>
                <div className="work-key">{record.code}</div>
            </div>

        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            className: `${sortArray.indexOf("title") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => <div className="work-title" onClick={() => goProdetail(record, index)}>
                {text}
            </div>
        },
        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'workStatus',
            className: `${sortArray.indexOf("workStatus") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 2
            },
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusNode.id)}`}>
                {text}
            </div>
        },

        {
            title: '优先级',
            dataIndex: ['workPriority', 'name'],
            key: 'workPriority',
            className: `${sortArray.indexOf("workPriority") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 3
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.workPriority?.iconUrl}
                        alt=""
                        // isRemote={true}
                        className="img-icon-right"
                    />
                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: '负责人',
            dataIndex: ['assigner', 'nickname'],
            key: 'assignerId',
            className: `${sortArray.indexOf("assignerId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 4
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text">{text}</div>
            </div>
        },

        {
            title: '创建人',
            dataIndex: ['builder', 'nickname'],
            key: 'builderId',
            className: `${sortArray.indexOf("builderId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 5
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text">{text}</div>
            </div>
        },
        {
            title: '模块',
            dataIndex: ['module', 'moduleName'],
            key: 'moduleId',
            className: `${sortArray.indexOf("moduleId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-text">{text ? text : "无"}</div>
            </div>
        },
        {
            title: '创建时间',
            dataIndex: "buildTime",
            key: 'buildTime',
            className: `${sortArray.indexOf("buildTime") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 6
            },
            render: (text, record) => <div className="work-info-text">
                {text.slice(0, 10)}
            </div>
        },
        {
            title: '项目',
            dataIndex: ['project', 'projectName'],
            key: 'project',
            className: `${sortArray.indexOf("project") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 7
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.project?.iconUrl}
                        alt=""
                        className="img-icon-right"
                    />

                </div>
                <div className="work-info-text">{text}</div>
            </div>
        },
        actionColumn

    ];
}

const xxlWorkColumn = (goProdetail, sortArray, actionColumn) => {
    return [
        {
            title: '序号',
            dataIndex: 'code',
            key: 'code',
            className: `work-first-col ${sortArray.indexOf("id") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => <div className="work-id work-first-col" onClick={() => goProdetail(record, index)}>
                <div className="work-icon">
                    <ImgComponent
                        src={record.workTypeSys?.iconUrl}
                        alt=""
                        className="menu-icon"

                    />
                </div>
                <div className="work-key">{record.code}</div>
            </div>
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            className: `${sortArray.indexOf("title") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => <div className="work-title" onClick={() => goProdetail(record, index)}>
                {text}
            </div>
        },
        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'workStatus',
            className: `${sortArray.indexOf("workStatus") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 2
            },
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusNode.id)}`}>
                {text}
            </div>
        },

        {
            title: '优先级',
            dataIndex: ['workPriority', 'name'],
            key: 'workPriority',
            className: `${sortArray.indexOf("workPriority") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 3
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.workPriority?.iconUrl}
                        // isRemote={true}
                        alt=""
                        className="img-icon-right"
                    />
                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: '负责人',
            dataIndex: ['assigner', 'nickname'],
            key: 'assignerId',
            className: `${sortArray.indexOf("assignerId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 4
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text">{text}</div>
            </div>
        },

        {
            title: '创建人',
            dataIndex: ['builder', 'nickname'],
            key: 'builderId',
            className: `${sortArray.indexOf("builderId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 5
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text">{text}</div>
            </div>
        },
        {
            title: '模块',
            dataIndex: ['module', 'moduleName'],
            key: 'moduleId',
            className: `${sortArray.indexOf("moduleId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-text">{text ? text : "无"}</div>
            </div>
        },
        {
            title: '创建时间',
            dataIndex: "buildTime",
            key: 'buildTime',
            className: `${sortArray.indexOf("buildTime") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 6
            },
            render: (text, record) => <div className="work-info-text">
                {text.slice(0, 10)}
            </div>
        },

        actionColumn

    ];
}

const lgColumn = (goProdetail, sortArray, actionColumn) => {
    return [
        {
            title: '序号',
            dataIndex: 'code',
            key: 'code',
            className: `work-first-col ${sortArray.indexOf("id") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => <div className="work-id work-first-col" onClick={() => goProdetail(record, index)}>
                <div className="work-icon">
                    <ImgComponent
                        src={record.workTypeSys?.iconUrl}
                        alt=""
                        className="menu-icon"

                    />
                </div>
                <div className="work-key">{record.code}</div>
            </div>
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            className: `${sortArray.indexOf("title") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 1
            },
            render: (text, record, index) => <div className="work-title" onClick={() => goProdetail(record, index)}>
                {text}
            </div>
        },
        {
            title: '状态',
            dataIndex: ['workStatusNode', 'name'],
            key: 'workStatus',
            className: `${sortArray.indexOf("workStatus") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 2
            },
            render: (text, record) => <div className={`work-status ${setStatuStyle(record.workStatusNode.id)}`}>
                {text}
            </div>
        },

        {
            title: '优先级',
            dataIndex: ['workPriority', 'name'],
            key: 'workPriority',
            className: `${sortArray.indexOf("workPriority") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 3
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img">
                    <ImgComponent
                        src={record.workPriority?.iconUrl}
                        // isRemote={true}
                        alt=""
                        className="img-icon-right"
                    />
                </div>
                <div className="work-info-text">{text || "暂无设置"}</div>
            </div>
        },
        {
            title: '负责人',
            dataIndex: ['assigner', 'nickname'],
            key: 'assignerId',
            className: `${sortArray.indexOf("assignerId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 4
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text">{text}</div>
            </div>
        },

        {
            title: '创建人',
            dataIndex: ['builder', 'nickname'],
            key: 'builderId',
            className: `${sortArray.indexOf("builderId") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 5
            },
            render: (text, record) => <div className="work-info">
                <div className="work-info-img" style={{ marginRight: "5px" }}><UserIcon name={text} /></div>
                <div className="work-info-text">{text}</div>
            </div>
        },

        {
            title: '创建时间',
            dataIndex: "buildTime",
            key: 'buildTime',
            className: `${sortArray.indexOf("buildTime") > -1 ? "show-sort-icon" : "hidden-sort-icon"}`,
            sorter: {
                multiple: 6
            },
            render: (text, record) => <div className="work-info-text">
                {text.slice(0, 10)}
            </div>
        },
        actionColumn
    ];
}

const getColumn = (screenSize, goProdetail, sortArray, actionColumn) => {
    if (screenSize === "xxl") {
        return xxlColumn(goProdetail, sortArray, actionColumn);
    } else {
        return lgColumn(goProdetail, sortArray, actionColumn)
    }
}

const getWorkColumn = (screenSize, goProdetail, sortArray, actionColumn) => {
    if (screenSize === "xxl") {
        return xxlWorkColumn(goProdetail, sortArray, actionColumn);
    } else {
        return lgColumn(goProdetail, sortArray, actionColumn)
    }
}


export { getColumn, getWorkColumn };


