/*
 * @Descripttion: 项目集添加详细信息
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:05:16
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2024-12-18 17:51:03
 */
import React, { Fragment } from "react";
import { Form, Input, DatePicker, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import "./ProjectSetAddInfo.scss";
import Button from "../../../common/button/Button"
import { useState } from "react";
import { withRouter } from "react-router";
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const layout = {
    labelCol: {
        span: 6,
    }
};


const ProjectSetAddInfo = (props) => {
    const { addProjectSetSet, findAllProjectSet } = props;
    const [form] = Form.useForm();
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                required: true,
                message: '请选择计划时间!',
            }
        ]
    };
    
    const [iconUrl, setIconUrl] = useState("projectSet1.png")

    const onFinish = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                name: values.projectSetName,
                desc: values.desc,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                projectSetLimits: values.projectSetLimits,
                iconUrl: iconUrl
            }
            addProjectSetSet(data).then(res => {
                if (res.code === 40000) {
                    message.error(res.msg);
                }
                if (res.code === 0) {
                    message.success('添加成功');
                    props.history.goBack()
                    findAllProjectSet({})
                    
                    // props.history.push(`/projectSet/${res.data}/overview`)
                }
            })
        })
    }

    const checkLimit = (_, value) => {
        if (value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Price must be greater than zero!'));
    };
    const [limtValue, setLimitValue] = useState("0");
    const LimitComponents = ({ value = {}, onChange }) => {

        const changeLimit = (id) => {
            setLimitValue(id)
            onChange(id)
        }

        return (
            <div className="projectSet-limit" onChange={onChange} value={value}>
                <div key="0" className={`projectSet-limits ${limtValue === "0" ? "limit-select" : ""}`} onClick={() => changeLimit("0")}>
                    <div className="limits-title">
                        公共
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-publish"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        公共项目集，全部成员可见
                    </div>
                </div>
                <div key="1" className={`projectSet-limits ${limtValue === "1" ? "limit-select" : ""}`} onClick={() => changeLimit("1")}>
                    <div className="limits-title">
                        私密
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-private"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        私密项目集，只有项目集成员可见
                    </div>
                </div>
            </div>
        )
    }
    return (
        <Fragment>
            <div className="projectSet-addinfo">
                {/* <div className="projectSet-type-head">填写信息</div> */}
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                        projectSetLimits: "0"
                    }}
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="项目集名称"
                        name="projectSetName"
                        rules={[
                            {
                                required: true,
                                message: '使用中英文、数字、空格组合',
                            },
                        ]}
                    >
                        <Input placeholder="使用中英文、数字、空格组合" />
                    </Form.Item>
                    
                    <Form.Item
                        label="可见范围"
                        name="projectSetLimits"
                        rules={[
                            {
                                validator: checkLimit,
                            }
                        ]}
                    >
                        <LimitComponents />
                    </Form.Item>
                    <Form.Item name="startTime" label="计划日期" {...rangeConfig}>
                        <RangePicker locale={locale} />
                    </Form.Item>
                    <Form.Item
                        label="项目集描述"
                        name="desc"
                        rules={[
                            {
                                required: false,
                                message: '请输入项目集描述',
                            },
                        ]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>
                    <div className="projectSet-add-submit">
                        <Button htmlType="button" onClick={() => props.history.goBack()}>
                            取消
                        </Button>

                        <Button type="primary" htmlType="submit" onClick={onFinish}>
                            提交
                        </Button>
                    </div>
                </Form>
            </div>
        </Fragment>

    )
}

export default withRouter(ProjectSetAddInfo);