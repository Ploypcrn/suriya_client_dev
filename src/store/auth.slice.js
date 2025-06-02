import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { history, fetchWrapper } from '../helpers';
import NotiAfterConfirm from '../Notification/NotiAfterConfirm';
// import jwtService from '../services/jwtService';

// create slice
const name = 'auth';
const initialState = createInitialState();
const reducers = createReducers();
const extraActions = createExtraActions();
const slice = createSlice({ name, initialState, reducers, extraReducers: (builder) => createExtraReducers(builder), });

// exports
export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation
function createInitialState() {
    return {
        user: JSON.parse(localStorage.getItem('user')),
        error: null
    }
}

function createReducers() {
    return {
        logout
    };

    function logout(state) {
        state.user = null;
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}

function createExtraActions() {
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/api/v1/authorize/login`;
    return {
        login: login()
    };
    function login() {
        return createAsyncThunk(
            `${name}/login`,
            async ({ username, password }) => await fetchWrapper.post(`${baseUrl}`, { username, password })
        );
    }
}

function createExtraReducers(builder) {
    var { pending, fulfilled, rejected } = extraActions.login;

    builder
        .addCase(pending, (state) => {
            state.error = null;
        })
        .addCase(fulfilled, (state, action) => {
            const user = action.payload;
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                state.user = user;
                const { from } = history.location ? history.location.state : { from: { pathname: '/bill' } };
                window.location.href = from.pathname;
                NotiAfterConfirm('success', 'เข้าสู่ระบบสำเร็จ', 'ยินดีต้อนรับเข้าสู่ระบบ');
                return user;
            } else {
                NotiAfterConfirm('error', 'เข้าสู่ระบบไม่สำเร็จ', 'กรุณาตรวจสอบชื่อผู้ใช้งานหรือรหัสผ่าน');
            }
        })
        .addCase(rejected, (state, action) => {
            state.error = action.error;
        });
}
