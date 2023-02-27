import React, { Fragment } from "react";
import { Modal, Form, Input, Select, DatePicker, Row, Col, message } from 'antd';
import locale from 'antd/es/date-picker/locale/zh_CN';
import "./ProjectAddInfo.scss";
import Button from "../../../common/button/Button"
import { useState } from "react";
import { getUser } from "tiklab-core-ui";
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
        key: "project1"
    },
    {
        iconUrl: "project2.png",
        key: "project2"
    },
    {
        iconUrl: "project3.png",
        key: "project3"
    },
    {
        iconUrl: "project4.png",
        key: "project4"
    },
    {
        iconUrl: "project5.png",
        key: "project5"
    }
]

const ProjectAddInfo = (props) => {
    const { addProlist, workType, setVisible, setCurrentStep } = props;
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
    const [limtValue, setLimitValue] = useState("0");
    const [iconUrl, setIconUrl] = useState("project1.png")

    const onFinish = () => {
        form.validateFields().then((values) => {
            const time = values["startTime"]
            const data = {
                projectName: values.projectName,
                projectKey: values.projectKey,
                projectType: {
                    id: workType.id,
                    type: workType.type
                },
                master: {
                    id: getUser().userId
                },
                desc: values.desc,
                startTime: time[0].format("YYYY-MM-DD"),
                endTime: time[1].format("YYYY-MM-DD"),
                projectState: values.projectState,
                projectLimits: values.projectLimits,
                iconUrl: iconUrl
            }
            addProlist(data).then(res => {
                if (res.code === 40000) {
                    message.error(res.msg);
                }
                if (res.code === 0) {
                    message.success('添加成功');
                    setVisible(false);
                    setCurrentStep("0")
                }
            })
        })
    }

    const onReset = () => {
        form.resetFields();
    };

    const checkLimit = (_, value) => {
        console.log(value)
        if (value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Price must be greater than zero!'));
    };

    const LimitComponents = ({ value = {}, onChange }) => {

        const changeLimit = (id) => {
            setLimitValue(id)
            onChange(id)
        }

        return (
            <div className="project-limit" onChange={onChange} value={value}>
                <div key="0" className={`project-limits ${limtValue === "0" ? "limit-select" : ""}`} onClick={() => changeLimit("0")}>
                    <div className="limits-title">
                        公共
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-publish"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        公共项目，全部成员可见
                    </div>
                </div>
                <div key="1" className={`project-limits ${limtValue === "1" ? "limit-select" : ""}`} onClick={() => changeLimit("1")}>
                    <div className="limits-title">
                        私密
                        <svg className="svg-icon" aria-hidden="true">
                            <use xlinkHref="#icon-private"></use>
                        </svg>
                    </div>
                    <div className="limits-desc">
                        私密项目，只有项目成员可见
                    </div>
                </div>
            </div>
        )
    }
    return (
        <Fragment>
            <div className="project-select-type">
                <div className="project-type-head">项目类型</div>
                <div className="project-type-content">
                    <div className="project-type-box">
                        <div className="type-img">
                            <img src={`/images/${workType.iconUrl}`} alt="" className="img-icon" />
                        </div>
                        <div className="type-info">
                            <div className="type-name">{workType.name}</div>
                            <div className="type-desc">{workType.desc}</div>
                        </div>
                    </div>
                    <Button onClick={() => setCurrentStep(0)}>更改类型</Button>
                </div>

            </div>
            <div className="project-addinfo">
                {/* <div className="project-type-head">填写信息</div> */}
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{
                        remember: true,
                        projectLimits: "0"
                    }}
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        label="项目名称"
                        name="projectName"
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
                        label="项目Key"
                        name="projectKey"

                        rules={[
                            {
                                required: true,
                                message: '请输入项目键值',
                            },
                            {
                                pattern: /^[A-Za-z]+$/,
                                message: '只能包含字母!'
                            }
                        ]}
                    >
                        <Input placeholder="只能包含字母" />
                        {/* <div>请输入字母</div> */}
                    </Form.Item>
                    <Form.Item
                        label="可见范围"
                        name="projectLimits"
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
                        label="项目描述"
                        name="desc"
                        rules={[
                            {
                                required: false,
                                message: '请输入项目描述',
                            },
                        ]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        label="图标"
                        name="icon"
                    >
                        <div className="project-icon-box">
                            {
                                iconList && iconList.map((item) => {
                                    return <div key={item.key} className={`project-icon  ${item.iconUrl === iconUrl ? "icon-select" : null}`} onClick={() => { setIconUrl(item.iconUrl) }}>
                       
                                        <img src={('/images/' + item.iconUrl)} alt="" className="img-icon" />
                                    </div>
                                })
                            }
                        </div>
                    </Form.Item>
                    <div className="project-add-submit">
                        <Button htmlType="button" onClick={() => setCurrentStep(0)}>
                            上一步
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

export default ProjectAddInfo;