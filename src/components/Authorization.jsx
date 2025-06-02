import { useSelector } from 'react-redux';
import { matchRoutes, useLocation, useNavigate } from 'react-router-dom';
import PathConstants from '../routes/pathConstants';
import PropTypes from 'prop-types';
import { useEffect, useContext } from 'react';
import { AuthContext } from '../components';

export { Authorization };

function Authorization({ children }) {
    let navigate = useNavigate();
    const authUser = useSelector(x => x.auth.user);
    const location = useLocation();
    const { routes } = useContext(AuthContext);
    const { pathname } = location;
   

    useEffect(() => {
        if (!authUser?.token) {
            navigate(PathConstants.LOGIN);
        } else {
            const matchedRoutes = matchRoutes(routes, pathname)?.[0];
            if (matchedRoutes.length === 0) {
                navigate(PathConstants.HOME, { state: { redirectUrl: pathname} });
            }
        }
    }, [authUser, pathname, navigate, routes]);

    return children;
}

Authorization.propTypes = {
    children: PropTypes.node.isRequired,
}
