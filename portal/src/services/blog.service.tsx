"use client"
import {useQuery} from "@tanstack/react-query";
import axios from "@/lib/config/axios-instance";
import {fetchAllBlogVodiosApiResponse, vodioPodcastType} from "@/lib/types/vodio";

export default function BlogsService() {
    const useFetchAlLBlogVodios = () => {
        function fetchPatients(): Promise<fetchAllBlogVodiosApiResponse> {
            return axios.get("/api/blog/all").then((res) => res.data);
        }
        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`blog-vodios`],
            retry: 0,
        });
    };
    const useFetchBlogVodioDetails = (id:string) => {
        function fetchPatients(): Promise<vodioPodcastType> {
            return axios.get(`/api/blog?podcastId=${id}`).then((res) => res.data);
        }
        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`blog-vodio`,id],
            retry: 0,
        });
    };

    return {
      useFetchAlLBlogVodios,
        useFetchBlogVodioDetails
    };
}
