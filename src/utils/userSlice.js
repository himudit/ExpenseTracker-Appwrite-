import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { account } from "../appwrite/appwriteConfig";

export const fetchUserProfile = createAsyncThunk(
    "user/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const response = await account.get();
            return response;
        } catch (error) {
            console.error("Error fetching user:", error.message);
            return rejectWithValue(error.message || "Failed to fetch user profile");
        }
    }
);

const initialState = {
    user: null,
    loading: false,
    error: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        removeUser: (state) => {
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                console.error("Profile fetch failed:", action.payload);
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
