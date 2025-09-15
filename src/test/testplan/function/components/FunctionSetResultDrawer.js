import React, {useState} from "react";
import {Button, Drawer, Form, Radio, Space, Input, message} from "antd";
import {CheckCircleTwoTone, CloseCircleTwoTone, MinusCircleTwoTone, ExclamationCircleTwoTone, StopOutlined, PauseCircleTwoTone} from "@ant-design/icons";
import functionInstanceStore from "../../../function/function/store/functionInstanceStore";
const { TextArea } = Input;

const resultMap = {
    0: { text: "失败", color: "#ff4d4f", icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" /> },
    1: { text: "成功", color: "#52c41a", icon: <CheckCircleTwoTone twoToneColor="#52c41a" /> },
    2: { text: "无法执行", color: "#ffa325", icon: <CheckCircleTwoTone twoToneColor="#ffa325" /> },
};

const FunctionSetResultDrawer = (props) => {
    const {record,testPlanId,findPage,projectId,recordResult} = props;
    const {createFunctionInstance, findFunctionInstancePage} = functionInstanceStore;

    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState();
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);

    // 打开抽屉时获取历史记录
    const showDrawer = async () => {
        setLoading(true);
        const params = {
            functionId: record.id,
            testPlanInstanceId:testPlanId,
        }
        let data = await findFunctionInstancePage(params);
        const dataList = data?.dataList || [];
        setList(dataList);
        if (dataList.length > 0) {
            const first = dataList[0];
            form.setFieldsValue({
                result: first.result,
                comment: first.comment,
            });
            setResult(first.result);
        } else {
            form.resetFields();
            setResult(undefined);
        }
        setOpen(true);
        setLoading(false);
    };

    const onClose = () => {
        setOpen(false);
    };

    // 提交表单
    const handleSubmitReview = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            let data = {
                ...values,
                funcUnitCase:{id:record.id},
                testPlan:{id:testPlanId},
                // testPlanInstanceId:testPlanId,
                projectId:projectId
            }

            await createFunctionInstance(data);
            await findPage()
            message.success('提交成功');
            // 提交后刷新历史
            showDrawer().then(res => {
                setOpen(false);
            });
        } catch (e) {
            // 校验失败或接口异常
        } finally {
            setLoading(false);
        }
    };

    // 结果展示
    const showResult = (result) => {
        const item = resultMap[result];
        if (!item) {
            return <Space size={"small"}>
                <MinusCircleTwoTone twoToneColor={"#d3d3d3"}/>
                <span className="font-12">未执行</span>
            </Space>
        }
        return <Space size={"small"}>
            {item.icon}
            <span className="font-12" style={{color: item.color}}>{item.text}</span>
        </Space>
    };

    // 历史记录渲染
    const renderHistoryList = () => (
        <div style={{ marginTop: 24 }}>
            <h4 style={{marginBottom: 12}}>历史记录</h4>
            {list.length === 0 ? (
                <div style={{color:'#aaa',textAlign:'center',padding:'16px 0', fontSize:13}}>暂无历史记录</div>
            ) : (
                <div style={{display:'flex',flexDirection:'column',gap: '8px'}}>
                    {list.map((item, idx) => (
                        <div
                            key={idx}
                            style={{
                                background: '#fafbfc',
                                borderRadius: 4,
                                padding: '8px 12px',
                                border: '1px solid #f0f0f0',
                                transition: 'box-shadow 0.2s',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'stretch',
                                minHeight: 44,
                            }}
                        >
                            {/* 左侧：名称、时间、建议 */}
                            <div style={{flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                                <div style={{display:'flex',alignItems:'center', marginBottom:2}}>
                                    <span style={{fontWeight:500, fontSize:13}}>
                                        <i className="iconfont icon-user" style={{marginRight:3, fontSize:13}} />
                                        {item.createUser?.nickname || item.createUser || "--"}
                                    </span>
                                    <span style={{marginLeft:10, color:'#888', fontSize:12}}>
                                        <i className="iconfont icon-time" style={{marginRight:3, fontSize:13}} />
                                        {item.createTime ? new Date(item.createTime).toLocaleString() : "--"}
                                    </span>
                                </div>
                                <div style={{fontSize:12,margin: "1px 5px", color: item.comment ? '#222' : '#aaa', fontStyle: item.comment ? 'normal' : 'italic', marginTop: 1}}>
                                    {item.comment || '无'}
                                </div>
                            </div>
                            {/* 右侧：结果，垂直居中 */}
                            <div style={{width: 80, display:'flex', alignItems:'center', justifyContent:'center'}}>
                                {showResult(item.result)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            <div className={"link-text"} onClick={showDrawer} >
                {showResult(record.result)}
            </div>

            <Drawer
                title={`功能用例意见`}
                placement="right"
                onClose={onClose}
                visible={open}
                width={500}
                destroyOnClose={true}
                footer={null}
            >
                <div style={{ padding: '0 16px' }}>
                    {/* 上半部分：表单 */}
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="result"
                            rules={[{ required: true, message: '请选择功能用例结果' }]}
                        >
                            <Radio.Group onChange={(e) => setResult(e.target.value)}>
                                <Space direction="horizontal">
                                    <Radio value={0}>失败</Radio>
                                    <Radio value={1}>成功</Radio>
                                    <Radio value={2}>无法执行</Radio>
                                </Space>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="comment"
                            rules={[{
                                required: result !== 1,
                                message: '请输入功能用例建议'
                            }]}
                        >
                            <TextArea
                                placeholder="请输入功能用例建议"
                                rows={4}
                            />
                        </Form.Item>

                        <div style={{ marginTop: 24, textAlign: 'right' }}>
                            <Space>
                                <Button onClick={onClose} disabled={loading}>
                                    取消
                                </Button>
                                <Button
                                    onClick={handleSubmitReview}
                                    type="primary"
                                    loading={loading}
                                >
                                    提交
                                </Button>
                            </Space>
                        </div>
                    </Form>
                    {/* 下半部分：历史列表 */}
                    {renderHistoryList()}
                </div>
            </Drawer>
        </>
    )
}

export default FunctionSetResultDrawer;