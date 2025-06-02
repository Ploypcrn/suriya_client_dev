import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { submitLogin } from "../../features/loginSlice";
import { authActions } from '../../store';
import Logo from "../../assets/logo_login.jpg";

const Login = () => {

    // const navigate = useNavigate();
    const dispatch = useDispatch();

    // const handleSubmit = async (values) => {
    //     const { username, password } = values;
    //     dispatch(submitLogin(username, password));

    //     // dispatch
    //     navigate("/bill");
    // };

    function onSubmit(values) {
        const { username, password } = values;
        return dispatch(authActions.login({ username, password }));
    }

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '90vh',
                }}
            >
                <div
                    style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        width: '420px',
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "30px",
                            marginBottom: "30px",
                        }}
                    >
                        <img src={Logo} alt="logo" style={{ width: '150px' }} />
                    </div>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onSubmit}
                    // onFinishFailed={onFinishFailed}
                    >
                        <Form.Item
                            style={{
                                borderRadius: "0px !important",
                            }}
                            // label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your username!",
                                },
                            ]}
                        >
                            <Input
                                style={{
                                    width: "100%",
                                    borderRadius: "0px !important",
                                }}
                                size="large"
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="ชื่อผู้ใช้งาน"
                            />
                        </Form.Item>

                        <Form.Item
                            // label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your password!",
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="รหัสผ่าน"
                            />
                        </Form.Item>


                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Form.Item>
                        </Form.Item>


                        <Form.Item>
                            <Button
                                style={{
                                    width: "100%",
                                    borderRadius: "0px !important",
                                }}
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                            >
                                เข้าสู่ระบบ
                            </Button>
                        </Form.Item>

                    </Form>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "10rem",
                            marginBottom: "30px",
                        }}
                    >
                        <label
                            style={{
                                fontSize: "12px",
                                color: "#00152966"
                            }}
                        >
                            Copyright ©2024 Produced by Suria coffin service co., ltd.
                        </label>
                    </div>
                </div>
            </div >
        </>
    );
};

export default Login;