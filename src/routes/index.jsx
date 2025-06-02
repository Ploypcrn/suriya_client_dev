import React from "react"
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import PathConstants from "./pathConstants"
import AuthLayout from "../layouts/AuthLayout";
import NoAuthLayout from "../layouts/NoAuthLayout";

const Login = React.lazy(() => import("../pages/Login/login"))
const Home = React.lazy(() => import("../pages/Home/home"))
const BillList = React.lazy(() => import("../pages/Bill/PageIndex"))
const BillManage = React.lazy(() => import("../pages/Bill/PageManage"))
const BillDetail = React.lazy(() => import("../pages/Bill/PageView"))
const ChequeList = React.lazy(() => import("../pages/Cheque/chequeList"))
const ChequeAdd = React.lazy(() => import('../pages/Cheque/chequeAdd'))
const TempaltePDF = React.lazy(() => import("../components/TemplatePDF/indexReactPDF"))
const ChequePDF = React.lazy(() => import("../components/TemplatePDF/cheque"))

const ExpenseList = React.lazy(() => import("../pages/Expense/expenseList"))
const ExpenseAdd = React.lazy(() => import("../pages/Expense/expenseAdd"))
const ExpenseEdit = React.lazy(() => import("../pages/Expense/expenseEdit"))

const configRoutes = [
    {
        path: PathConstants.LOGIN,
        element: <Login />,
        auth: false,
    },
    {
        path: PathConstants.PRINT_PDF,
        element: <TempaltePDF />,
        auth: false
    },
    {
        path: PathConstants.HOME,
        element: <Home />,
        auth: true,
    },
    {
        path: PathConstants.BILL,
        element: <BillList />,
        auth: true
    },
    {
        path: PathConstants.BILL_MANAGE,
        element: <BillManage />,
        auth: true
    },
    {
        path: PathConstants.BILL_MANAGE,
        element: <BillManage />,
        auth: true
    },
    {
        path: PathConstants.BILL_VIEW,
        element: <BillDetail />,
        auth: true
    },
    {
        path: PathConstants.CHEQUE,
        element: <ChequeList />,
        auth: true
    },
    {
        path: PathConstants.CHEQUE_ADD,
        element: <ChequeAdd />,
        auth: true
    },
    {
        path: PathConstants.CHEQUE_PDF,
        element: <ChequePDF />,
        auth: true
    },
    {
        path: PathConstants.EXPENSES,
        element: <ExpenseList />,
        auth: true
    },
    {
        path: PathConstants.EXPENSES_ADD,
        element: <ExpenseAdd />,
        auth: true
    },
    {
        path: PathConstants.EXPENSES_EDIT,
        element: <ExpenseEdit />,
        auth: true
    },
]


export const routes = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            {
                configRoutes.map(({ path, element, auth }) =>
                    auth ? (
                        <Route key={path} element={<AuthLayout />}>
                            <Route path={path} element={element} />
                        </Route>
                    ) : (
                        <Route key={path} element={<NoAuthLayout />}>
                            <Route path={path} element={element} />
                        </Route>
                    )
                )
            }
        </Route>
    )
);

export default routes