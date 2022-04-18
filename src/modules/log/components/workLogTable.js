
/*
 * @Descripttion: 事项日志
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-30 17:40:03
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-02-10 10:01:44
 */
import React,{ Fragment, useEffect, useState } from "react"
import {observer, inject} from "mobx-react";
import { Input,Table, Select,Button,Form, Pagination,DatePicker } from 'antd';
const { RangePicker } = DatePicker;


const WorkLog = (props)=> {
    const {workStore,findMatterWorkingHours} = props
    const {getProlist, projectList} = workStore;
    const [form] = Form.useForm();
    // 定义时间格式
    const dateFormat = 'YYYY/MM/DD';

    useEffect(()=> {
        getProlist()
        return;
    },[])

    const initColumns = [{
        title: '成员',
        width: 100,
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        align: "center"
    },
    {
        title: '总计',
        width: 100,
        dataIndex: 'statistics',
        key: 'age',
        fixed: 'left',
        align: "center"
    }]

    const [columns,setColums] = useState(initColumns);

    const [workLog,setworkLog] = useState()
    //总页数
    const [dateTotal,setDateTotal] = useState()
    // 当前页数
    const [current,serCurrent] = useState(0)
    
    const setTableWork = (data) => {
        const totalNumber = data.workItemManhour[0].totalNumber
        setworkLog([...data.workItemManhour])
        setDateTotal(totalNumber)
        let columnsAdd = initColumns;
        const headerDay = data.headerDay;
        // 动态拼接表单
        columnsAdd.push({
            title: '状态',
            width: 100,
            dataIndex: 'workStatus',
            key: 'workStatus',
            fixed: 'left',
            align: "center"
        })
        headerDay.map((item,index)=> {
            columnsAdd.push({  
                title: `${item.dateTime}`,
                key: index,
                children: [
                    {   
                        title: `${item.weekDay}`,
                        dataIndex: "statisticsList", 
                        key: `${index}week`,
                        render: (render) => (
                            <Fragment>{render[index]}</Fragment>
                        ),
                        align: "center"
                    }
                ],
                align: "center"
            })
            return 0;
        });
        setColums(columnsAdd)
    }
    
    const submitSeachInfo = (fieldsValue) => {
        const values = {
            ...fieldsValue,
            'startTime': fieldsValue.startTime[0].format('YYYY-MM-DD'),
            'endTime': fieldsValue.startTime[1].format('YYYY-MM-DD'),
            currentPage: 0
        }
        findMatterWorkingHours(values).then(res => {
            setTableWork(res.data)
            serCurrent(1)
        })
        
    }

    // 日期翻页
    const changeDataPage = (value)=> {
        serCurrent(value)
        findMatterWorkingHours({currentPage: value-1}).then(res => {
            setTableWork(res.data)
        })
    }

    return (
        <Fragment>
            <div className="log-from">
                <div>
                    <Form
                        layout="inline"
                        form={form}
                        onFinish={submitSeachInfo}
                    >   
                        <Form.Item name="projectId" rules={[{ required: true }]} >
                            <Select
                                placeholder="所有项目"
                                allowClear
                                key="project"
                                style={{ width:100,marginRight: "20px"}}
                            >
                                {
                                    projectList && projectList.map((item)=>{
                                        return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item name="startTime" rules={[{ required: true }]}>
                            <RangePicker
                                format={dateFormat}
                            />
                        </Form.Item>
                        <Form.Item  name="keywords" rules={[{ required: false }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                搜索
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <Pagination simple defaultCurrent={1} total={dateTotal} current= {current} onChange={(value)=>changeDataPage(value)}/>
            </div>
            <Table columns={columns} dataSource={workLog} rowKey={(record) => record.workItemId} />
        </Fragment>
    )
}
export default inject('workStore')(observer(WorkLog));