import React, { useEffect, useState} from "react";
import { observer, inject } from "mobx-react";
import { AppOutline, EyeOutline } from 'antd-mobile-icons'
import "./logContent.scss"
import { getUser } from "tiklab-core-ui";
import { Selector } from 'antd-mobile'

const LogContent = (props) => {
    const { logStore } = props;
    const {findWorkLogPage, logList,selectLogCondition} = logStore;
    
    const [type, setType] = useState("all");
    const userId = getUser().userId
    useEffect(() => {
        getList()
    }, [type])

    const getList = () => {
        if(type === "all"){
            findWorkLogPage({worker: null, projectId: null})
        }
        if(type === "mylist"){
            findWorkLogPage({worker: userId})
        }
    }
    const columns = [
        {
            title: "事项",
            dataIndex: ["workItem", "title"],
            key: "workItem",
            align: "center",
        },
        {
            title: "项目",
            dataIndex: ["workItem", "title"],
            key: "workItem",
            align: "center",

        },
        {
            title: "负责人",
            dataIndex: ["worker", "name"],
            key: "worker",
            align: "center",
        },
        {
            title: "记录日期",
            dataIndex: "workDate",
            key: "workDate",
            align: "center",
        },
        {
            title: "用时",
            dataIndex: "takeupTime",
            key: "endTime",
            align: "center",
        },
        {
            title: "工作内容",
            dataIndex: "workContent",
            key: "workContent",
            align: "center",
        }
    ];
    const changePage = (pagination) => {
        if(type === "all"){
            findWorkLogPage({worker: null, projectId: null, pageParam: {current: pagination.current}})
        }
        if(type === "mylist"){
            findWorkLogPage({worker: userId, pageParam: {current: pagination.current}})
        }
    }

    const options = [
        {
          label: '全部日志',
          value: 'all',
        },
        {
          label: '我的日志',
          value: 'mylist',
        }
      ]

    return (
        <div className="logcontent">
            <div className="logcontent-filter">
                <Selector
                    options={options}
                    defaultValue={['all']}
                    onChange={(arr, extend) => setType(arr[0])}
                />
            </div>
            
            <div className="logcontent-box">
                {
                    logList && logList.length > 0 && logList.map(item => {
                        return <div className="logcontent-list" key={item.id}>
                            <div className='logcontent-left'>
                                <div className='logcontent-icon'>
                                </div>
                                <div>
                                    <div className='logcontent-title'>{item.workItem.title}</div>
                                    <div>
                                        {item.worker.name}
                                    </div>
                                </div>
                            </div>
                            <div className='logcontent-type'>
                                {item.workDate}
                            </div>
                            <div>
                                {item.takeupTime}
                            </div>
                            <div>
                                {item.project.projectName}
                            </div>
                            <div>
                                <EyeOutline />
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
}
export default inject('logStore')(observer(LogContent));