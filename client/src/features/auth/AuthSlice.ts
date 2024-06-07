import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

interface IUser {
    email: string;
    role: number[];
}

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    user: IUser | null;
    error: any;
}

interface UserData {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
    role?: number[];
}

const initialState: AuthState = {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem("token");
            state.token = null;
            state.loading = true;
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state, action) => {
                localStorage.setItem("token", action.payload.accessToken);
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                console.log(action.payload);
            })
            .addCase(register.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.loading = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                localStorage.setItem("token", action.payload.accessToken);
                state.isAuthenticated = true;
                state.loading = false;
                state.error = null;
                state.user = action.payload.user;
                console.log(action.payload);
            })
            .addCase(login.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export const register = createAsyncThunk(
    "auth/register",
    async (userData: UserData) => {
        try {
            const response = await axiosInstance.post(
                "/user/register",
                userData
            );
            return response.data;
        } catch (error: any) {
            return error.stack;
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (userData: UserData) => {
        try {
            const response = await axiosInstance.post("/user/login", userData);
            return response.data;
        } catch (error: any) {
            return error.message;
        }
    }
);

export const { logout } = authSlice.actions;
export default authSlice.reducer;
