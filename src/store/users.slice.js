import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchWrapper } from '../helpers';

// create slice

const name = 'users';
const initialState = createInitialState();
const extraActions = createExtraActions();
// const extraReducers = createExtraReducers();
const slice = createSlice({ 
    name, 
    initialState, 
    extraReducers: (builder) => {
        builder
            .addCase(extraActions.getAll.pending, (state) => {
                state.users = { loading: true };
            })
            .addCase(extraActions.getAll.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(extraActions.getAll.rejected, (state, action) => {
                state.users = { error: action.error };
            });
    }, 
});

// exports

export const userActions = { ...slice.actions, ...extraActions };
export const usersReducer = slice.reducer;

// implementation

function createInitialState() {
    return {
        users: {}
    }
}

function createExtraActions() {
    const baseUrl = `${import.meta.env.VITE_BASE_API_URL}/users`;

    return {
        getAll: getAll()
    };    

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async () => await fetchWrapper.get(`${baseUrl}`)
        );
    }
}
