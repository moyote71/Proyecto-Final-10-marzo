import { http } from "./http";

export const fetchUsers = async () => {
    try {
        const response = await http.get("/users");
        return response.data?.data || response.data || [];
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const searchUsers = async (query) => {
    try {
        const response = await http.get(`/users/search?q=${query}`);
        return response.data?.data || response.data || [];
    } catch (error) {
        console.error("Error searching users:", error);
        return [];
    }
};

export const getUserById = async (userId) => {
    try {
        const response = await http.get(`/users/${userId}`);
        return response.data?.data || response.data || null;
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        return null;
    }
};
