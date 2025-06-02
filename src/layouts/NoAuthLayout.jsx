import { Outlet } from "react-router-dom"
import { Layout,  } from 'antd';

const {  Content } = Layout;

const NoAuthLayout = () => {

    return (
        <Layout>
            <Content
                style={{
                    padding: '35px',
                }}
            >
                <Outlet />
            </Content>
        </Layout>
    )
}

export default NoAuthLayout;