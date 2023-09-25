import React, { Fragment } from "react";
import { Modal, Form, Input, Select, DatePicker, Row, Col, message } from 'antd';
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
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

const iconList = [
    {
        iconUrl: "project1.png",
        key: "projectSet1"
    },
    {
        iconUrl: "project2.png",
        key: "projectSet2"
    },
    {
        iconUrl: "project3.png",
        key: "projectSet3"
    },
    {
        iconUrl: "project4.png",
        key: "projectSet4"
    },
    {
        iconUrl: "project5.png",
        key: "projectSet5"
    }
]

const ProjectSetAddInfo = (props) => {
    const { addProjectSetSet, findAllProjectSet, setVisible } = props;
    const [form] = Form.useForm();
    const rangeConfig = {
        rules: [
            {
                type: 'array',
                required: true,
                message: 'Please select time!',
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
                    findAllProjectSet()
                    
                    // props.history.push(`/index/projectSetdetail/${res.data}/survey`)
                }
            })
        })
    }

    const checkLimit = (_, value) => {
        console.log(value)
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
                    <Form.Item
                        label="图标"
                        name="icon"
                    >
                        <div className="projectSet-icon-box">
                            {
                                iconList && iconList.map((item) => {
                                    return <div key={item.key} className={`projectSet-icon  ${item.iconUrl === iconUrl ? "icon-select" : null}`} onClick={() => { setIconUrl(item.iconUrl) }}>
                       
                                        <img src={('/images/' + item.iconUrl)} alt="" className="img-icon-right" />
                                    </div>
                                })
                            }
                        </div>
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