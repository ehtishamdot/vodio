import axiosInstance from "@/lib/config/axios-instance.ts";
import {blogType} from "@/lib/types";


export const ApiService = {
    blog: async (blog:blogType) =>
        axiosInstance.post<blogType>(`/api/blog`,blog).then(({ data }) => {
            return data;
        }),
};
