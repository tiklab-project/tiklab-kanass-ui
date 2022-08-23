
/*
 * @Descripttion: 用户日志
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-07-30 17:40:03
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-01-25 13:24:52
 */
import React,{ Fragment, useEffect, useState } from "react"
import {observer, inject} from "mobx-react";
import { Input,Table, Select,Button,Form, Pagination,DatePicker } from 'antd';
import moment from "moment";
const { RangePicker } = DatePicker;

const UserLog = (props)=> {
    const {workStore,perWorkingHours} = props
    const {findProjectList, projectList} = workStore;
    const [form] = Form.useForm();
    // 定义时间格式
    const dateFormat = 'YYYY/MM/DD';

    useEffect(()=> {
        findProjectList().then(data=> {
            console.log(data)
        })
        const values = {
            startTime: moment().subtract(1, 'months').format('YYYY-MM-DD') ,
            endTime: moment().format('YYYY-MM-DD') ,
            currentPage: 1
        }
        perWorkingHours(values).then(res => {
            setTableUser(res.data)
            serCurrent(1)
        })
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

    const [userLog,setUserLog] = useState()
    //总页数
    const [dateTotal,setDateTotal] = useState()
    // 当前页数
    const [current,serCurrent] = useState(0)
    
    const setTableUser = (data) => {
        const totalNumber = data.manHour[0].totalNumber
        setUserLog([...data.manHour])    
        setDateTotal(totalNumber)    
        let columnsAdd = initColumns;
        // 动态拼接表单
        const headerDay = data.headerDay;
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
    
    const onFinish = (fieldsValue) => {
        const values = {
            ...fieldsValue,
            'startTime': fieldsValue.startTime[0].format('YYYY-MM-DD'),
            'endTime': fieldsValue.startTime[1].format('YYYY-MM-DD'),
            currentPage: 0
        }
        perWorkingHours(values).then(res => {
            setTableUser(res.data)
            serCurrent(1)
        })
    }

    // 日期翻页
    const changeDataPage = (value)=> {
        serCurrent(value)
        perWorkingHours({currentPage: value-1}).then(res => {
            setTableUser(res.data)
        })
    }

    return (
        <Fragment>
            <div className="log-from">
                <div>
                    <Form
                        layout="inline"
                        form={form}
                        onFinish={onFinish}
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
                {/* <Pagination simple defaultCurrent={1} total={dateTotal} current= {current} onChange={(value)=>changeDataPage(value)}/> */}
            </div>
            <Table columns={columns} dataSource={userLog} rowKey={(record) => record.worker}/>
        </Fragment>
    )
}
export default inject('workStore')(observer(UserLog));