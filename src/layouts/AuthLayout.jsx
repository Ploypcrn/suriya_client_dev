import { useEffect, useState } from 'react';
import { Outlet } from "react-router-dom"
import PathConstants from '../routes/pathConstants';
import { Layout, Menu, theme, Avatar, Badge, Dropdown } from 'antd';
import { UserOutlined, DollarOutlined, CreditCardOutlined, LogoutOutlined, LineChartOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Authorization } from "../components";
const { Header, Content, Footer } = Layout;
import { authActions } from '../store';
import Logo from "../assets/logo2.jpg";

const AuthLayout = () => {

    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    const [username, setUsername] = useState('');

    const dispatch = useDispatch();
    const logout = () => dispatch(authActions.logout());

    useEffect(() => {
        const user = localStorage.getItem('user');
        const userObj = JSON.parse(user);
        setUsername(userObj.data[0].username);
    }, []);

    const items = [
        {
            key: 'logout',
            label: 'ออกจากระบบ',
            icon: <LogoutOutlined />,
            onClick: logout,
        }
    ];

    const menuItems = [
        {
            key: 'overview',
            label: 'ภาพรวมรายรับรายจ่าย',
            path: PathConstants.HOME,
            icon: <LineChartOutlined />,
            auth: true,
        },
        {
            key: 'bill',
            label: 'ใบเรียกเก็บเงิน',
            icon: <DollarOutlined />,
            path: PathConstants.BILL,
            auth: true,
        },
        {
            key: 'cheque',
            label: 'รายการเช็ค',
            icon: <CreditCardOutlined />,
            path: PathConstants.CHEQUE,
            auth: true,
        },
        {
            key: 'expenses',
            label: 'รายจ่าย',
            icon: <DollarOutlined />,
            path: PathConstants.EXPENSES,
            auth: true,
        }
    ];

    return (
        <Authorization>
            <Layout
            >
                <Header
                    theme="light"
                    style={{
                        backgroundColor: '#D81D18'
                    }}

                >
                    <div
                        style={{
                            width: '350px',
                            height: '30px',
                            backgroundColor: 'transparent',
                            margin: '16px 24px 16px 0',
                            float: 'left',
                        }}
                    >
                        <a href={PathConstants.HOME}>
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <img
                                    src={Logo}
                                    alt="logo"
                                    style={{
                                        width: '20%',
                                    }}
                                />
                                <h5 style={{ marginLeft: '10px', color: "#fff" }}>Suriya Coffin Service Co.,Ltd. </h5>
                            </div>
                        </a>
                    </div>
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                // justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Menu
                                    theme="light"
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                    mode="horizontal"
                                    defaultSelectedKeys={
                                        [menuItems.find((item) => window.location.pathname === item.path)?.key] || []
                                    }
                                >
                                    {menuItems.map((item) => (
                                        <Menu.Item key={item.key}>
                                            <span
                                                style={{
                                                    marginRight: '5px',
                                                    fontSize: '20px',
                                                }}
                                            >{item.icon}</span>
                                            <a href={item.path}>{item.label}</a>
                                        </Menu.Item>
                                    ))}

                                </Menu>
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Badge dot>
                                    <Dropdown menu={{ items }} placement="bottomRight" arrow>
                                        <Avatar shape="square" icon={<UserOutlined />} />
                                    </Dropdown>
                                </Badge>
                                <span style={{ color: "#fff", marginLeft: '10px' }}>{username}</span>
                            </div>
                        </div>
                    </div>
                </Header>
                <Content
                    style={{
                        // padding: '35px',
                    }}
                >
                    <div
                        style={{
                            // background: colorBgContainer,
                            minHeight: '85vh',
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    Suriya ©{new Date().getFullYear()} Created by Suriya
                </Footer>
            </Layout>
        </Authorization >
    );
};

export default AuthLayout;