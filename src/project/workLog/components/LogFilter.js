import React, { useEffect } from "react";
import { observer, inject } from "mobx-react";
import { Form, DatePicker } from 'antd';
import "./LogFilter.scss"
import moment from "moment";
import { getUser } from "tiklab-core-ui";
import { withRouter } from "react-router";
import { useState } from "react";
const { RangePicker } = DatePicker;

const LogFilter = (props) => {
    const { workStore, logStore, type } = props;
    const { findProjectList, projectList } = workStore;
    const { findWorkLogPage, logList } = logStore;
    const [form] = Form.useForm();
    const projectId = props.match.params.id;
    const [dateValue, setDateValue] = useState()
    // 定义时间格式
    const dateFormat = 'YYYY/MM/DD';
    const userId = getUser().userId

    useEffect(() => {
        findProjectList()
        getList()
        return;
    }, [])
    // startDate: values.dateRanger[0].startOf("day").format("YYYY-MM-DD HH:mm:ss"),
    // endDate: values.dateRanger[1].endOf("day").format("YYYY-MM-DD HH:mm:ss"),
    const getList = () => {
        if (type === "allLog") {
            const data = {
                projectId: projectId,
                startTime: moment().subtract(7, 'days').startOf("day").format("YYYY-MM-DD"),
                endTime: moment().add(1, 'days').format("YYYY-MM-DD"),
            }
            findWorkLogPage(data)
        }
        if (type === "myLog") {
            const data = {
                worker: userId,
                projectId: projectId,
                startTime: moment().subtract(7, 'days').format('YYYY-MM-DD'),
                endTime: moment().add(1, 'days').format('YYYY-MM-DD'),
            }
            findWorkLogPage(data)
        }
        console.log([moment().subtract(7, 'days'), moment()])
        setDateValue([moment().subtract(7, 'days'), moment()])
    }

    const changeData = (dateValue) => {
        setDateValue(dateValue)
        if (type === "allLog") {
            const values = {
                projectId: projectId,
                'startTime': dateValue[0].format('YYYY-MM-DD'),
                'endTime': moment(dateValue[1]).add(1, 'days').format('YYYY-MM-DD'),
                currentPage: 0
            }
            findWorkLogPage(values)
        }
        if (type === "myLog") {
            const values = {
                worker: userId,
                projectId: projectId,
                'startTime': dateValue[0].format('YYYY-MM-DD'),
                'endTime': moment(dateValue[1]).add(1, 'days').format('YYYY-MM-DD'),
                currentPage: 0
            }
            findWorkLogPage(values)
        }

    }

    const onValuesChange = (date, dateStrings) => {
        // onFinish(allValues)
        console.log(date, dateStrings)
    }


    return (
        // <div className="log-filter">
        //     <Form
        //         layout="inline"
        //         form={form}
        //         onFinish={onFinish}
        //         onValuesChange = {onValuesChange}
        //     >
        //         {/* <Form.Item name="projectId" rules={[{ required: true }]} >
        //             <Select
        //                 placeholder="所有项目"
        //                 allowClear
        //                 key="project"
        //                 style={{ width: 100, marginRight: "20px" }}
        //             >
        //                 {
        //                     projectList && projectList.map((item) => {
        //                         return <Select.Option value={item.id} key={item.id}>{item.projectName}</Select.Option>
        //                     })
        //                 }
        //             </Select>
        //         </Form.Item> */}
        //         <Form.Item name="startTime" rules={[{ required: true }]}>
        //             <RangePicker
        //                 format={dateFormat}
        //             />
        //         </Form.Item>
        //     </Form>
        // </div>
        <RangePicker
            value = {dateValue}
            format={dateFormat}
            onChange = {changeData}
        />

    )
}
export default withRouter(inject('workStore', 'logStore')(observer(LogFilter)));