import React, {useState,useEffect} from "react";
import {Row,Col} from "antd";
import SettingHomeStore from "../store/SettingHomeStore";
import {applyJump, disableFunction, applySubscription, getUser} from "thoughtware-core-ui";
import versionStore from "thoughtware-licence-ui/es/version/VersionStore";
// import overviewStore from "../../../pipeline/overview/store/OverviewStore";
import vipLight from '../../../assets/images/vip-one.png';
import vipDark from '../../../assets/images/vip-two.png';
import "./SettingHome.scss";
import moment from "moment";
import {
    ApartmentOutlined,
    UserOutlined,
    MessageOutlined,
    GroupOutlined,
    ScheduleOutlined,
    InsertRowBelowOutlined,
    ConsoleSqlOutlined,
    VerifiedOutlined,
    ToolOutlined,
    AlertOutlined,
    CloudOutlined,
    NodeIndexOutlined,
    HourglassOutlined,
    InboxOutlined,
    ShoppingOutlined,
    RightOutlined,
    MacCommandOutlined,
    MergeCellsOutlined,
    FileProtectOutlined,
    HistoryOutlined,
    LaptopOutlined, DesktopOutlined,
} from "@ant-design/icons"

const SettingHome = props => {

    const {findOrgaNum, findlogpage} = SettingHomeStore;
    const {findUseLicence} = versionStore;
    // const {findlogpage} = overviewStore;

    //系统设置统计数据
    const [count,setCount] = useState({});
    //当前版本
    const [licence,setLicence] = useState(null);
    //操作日志
    const [log,setLog] = useState(null);

    useEffect(()=>{
        findOrgaNum().then(res=>{
            if(res.code===0){
                setCount(res.data)
            }
        })
        if(version==='cloud'){
            findlogpage({
                pageParam: {pageSize: 1, currentPage: 1},
                userId:getUser().userId
            }).then(res=>{
                if(res.code===0){
                    setLog(res.data)
                }
            })
        } else {
            findUseLicence().then(res=>{
                if(res.code===0){
                    setLicence(res.data)
                }
            })
        }
    },[])

    /**
     * 路由跳转
     */
    const li = ['orga','user','userGroup','dir'];
    const goPath = path => {
        const authConfig = JSON.parse(localStorage.getItem("authConfig"))
        if(!authConfig.authType){
            const isAuth = li.some(item => item===path)
            if(isAuth){
                return applyJump(`${authConfig.authServiceUrl}/#/user/${path}`)
            }
        }
        props.history.push(`/setting/${path}`)
    }


    const commonBox = (
        <>
            <div className='home-message-box'>
                <div className='home-title'>消息</div>
                <div className='home-message'>
                    <div className='home-message-item' onClick={()=>goPath('messageNotice')}>
                        <div className='home-icon'><MessageOutlined/></div>
                        <div className='home-label'>消息通知方案</div>
                        <div className='home-info'>
                            {count?.messageNotice || 0}
                        </div>
                    </div>
                    <div className='home-message-item' onClick={()=>goPath('messageSendType')}>
                        <div className='home-icon'><AlertOutlined /></div>
                        <div className='home-label'>消息发送方式</div>
                        <div className='home-info'>
                            {count?.sendType || 0}
                        </div>
                    </div>
                </div>
            </div>
            <div className='home-config-box'>
                <div className='home-title'>项目配置</div>
                <div className='home-config'>
                    <div className='home-config-item' onClick={()=>goPath('worktype')}>
                        <div className='home-icon'><ShoppingOutlined /></div>
                        <div className='home-label'>事项类型</div>
                        <div className='home-info'>{count?.workType || 0}</div>
                    </div>
                    <div className='home-config-item' onClick={()=>goPath('form')}>
                        <div className='home-icon'><InsertRowBelowOutlined /></div>
                        <div className='home-label'>表单</div>
                        <div className='home-info'>{count?.form || 0}</div>
                    </div>
                    <div className='home-config-item' onClick={()=>goPath('preliminary')}>
                        <div className='home-icon'><InboxOutlined /></div>
                        <div className='home-label'>字段</div>
                        <div className='home-info'>{count?.field || 0}</div>
                    </div>
                    <div className='home-config-item' onClick={()=>goPath('systemFlow')}>
                        <div className='home-icon'><NodeIndexOutlined /></div>
                        <div className='home-label'>流程</div>
                        <div className='home-info'>{count?.flow || 0}</div>
                    </div>
                    <div className='home-config-item' onClick={()=>goPath('nodestatus')}>
                        <div className='home-icon'><HourglassOutlined /></div>
                        <div className='home-label'>状态</div>
                        <div className='home-info'>{count?.flow || 0}</div>
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <Row className='setting-home'>
            <Col
                xs={{ span: "24" }}
                sm={{ span: "24" }}
                md={{ span: "24" }}
                lg={{ span: "18" , offset: "3" }}
                xl={{ span: "14", offset: "5" }}
                xxl={{ span: "14", offset: "5" }}
            >
                <div className='setting-home-limited'>
                    {
                        version ==='cloud' ?
                            <>
                                <div className='home-chunk-box'>
                                    {commonBox}
                                    <div className='home-security-box'>
                                        <div className='home-title'>安全</div>
                                        <div className='home-security'>
                                            <div className='home-security-item' onClick={()=>goPath('backups')}>
                                                <div className='home-icon'><HistoryOutlined /></div>
                                                <div className='home-label'>上次备份时间</div>
                                                <div className='home-info'>{count?.lastBackups && moment(count.lastBackups).format('YYYY-MM-DD') || '无'}</div>
                                            </div>
                                            <div className='home-security-item' onClick={()=>goPath('log')}>
                                                <div className='home-icon'><LaptopOutlined /></div>
                                                <div className='home-label'>操作日志</div>
                                                <div className='home-info'>{log?.totalRecord || '0'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='home-quick-box'>
                                    <div className='home-quick home-chunk-box'>
                                        <div className='home-quick-item' onClick={()=>goPath('urlData')}>
                                            <div className='home-icon'><MacCommandOutlined /></div>
                                            <div className='home-quick-item-title'>服务集成</div>
                                            <div><RightOutlined /></div>
                                        </div>
                                        <div className='home-quick-item' onClick={()=>goPath('loadData')}>
                                            <div className='home-icon'><MergeCellsOutlined/></div>
                                            <div className='home-quick-item-title'>jira集成</div>
                                            <div><RightOutlined /></div>
                                        </div>
                                        <div className='home-quick-item' onClick={()=>goPath('systemRole')}>
                                            <div className='home-icon'> <FileProtectOutlined /></div>
                                            <div className='home-quick-item-title'>权限</div>
                                            <div><RightOutlined /></div>
                                        </div>
                                    </div>
                                </div>
                            </>
                            :
                            <>
                                <div className='home-licence-box'>
                                    <div className='home-licence'>
                                        <div className='home-licence-item'>
                                            <div className='home-licence-item-level'>
                                                <div className='licence-level-img'>
                                                    <img src={count?.version ? vipDark:vipLight} alt={''}/>
                                                </div>
                                                <div>
                                                    <div>
                                                        <span className='licence-level-info'>{disableFunction() ? '社区版' : '企业版'}</span>
                                                        {licence?.issuedTime &&
                                                            <span className='licence-level-issuedTime'>
                                                                {moment(licence.issuedTime).format('YYYY-MM-DD HH:mm:ss')}到期
                                                            </span>}
                                                    </div>
                                                    <div className='licence-level-applyAuth'>
                                                        <span className='licence-level-applyAuth-title'>授权人数：</span>
                                                        <span className='licence-level-info'>
                                                            {count?.applyAuthNumber || 0 } / {count?.version ? "不限制" : licence?.userNum > 0 ? licence.userNum+'人' : "不限制"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='home-licence-sub' onClick={()=>applySubscription('kanass')}>
                                            {count?.version ? '订阅' : '续订'}
                                        </div>
                                    </div>
                                </div>
                                <div className='home-chunk-box'>
                                    <div className='home-user-box'>
                                        <div className='home-title'>用户与权限</div>
                                        <div className='home-user'>
                                            <div className='home-user-item' onClick={()=>goPath('user')}>
                                                <div className='home-icon'><UserOutlined/></div>
                                                <div className='home-label'>用户</div>
                                                <div className='home-info'>
                                                    {count?.user || 0}
                                                </div>
                                            </div>
                                            <div className='home-user-item' onClick={()=>goPath('orga')}>
                                                <div className='home-icon'><ApartmentOutlined /></div>
                                                <div className='home-label'>部门</div>
                                                <div className='home-info'>
                                                    {count?.orga || 0}
                                                </div>
                                            </div>
                                            <div className='home-user-item' onClick={()=>goPath('userGroup')}>
                                                <div className='home-icon'><GroupOutlined /></div>
                                                <div className='home-label'>用户组</div>
                                                <div className='home-info'>
                                                    {count?.userGroup || 0}
                                                </div>
                                            </div>
                                            <div className='home-user-item' onClick={()=>goPath('systemRole')}>
                                                <div className='home-icon'><ScheduleOutlined /></div>
                                                <div className='home-label'>权限</div>
                                                <div className='home-info'>
                                                    {count?.role || 0}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {commonBox}
                                </div>
                            </>
                    }
                </div>
            </Col>
        </Row>
    )
};

export default SettingHome;
