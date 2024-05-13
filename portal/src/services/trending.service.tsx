import {useQuery} from "@tanstack/react-query";
import {fetchAllBlogVodiosApiResponse} from "@/lib/types/vodio";
import axios from "@/lib/config/axios-instance";
export default function TrendingService() {
    const useFetchAllTrendingVodios = () => {
        function fetchPatients(): Promise<fetchAllBlogVodiosApiResponse> {
            return axios.get("/api/trending").then((res) => res.data);
        }
        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`trending-vodios`],
            retry: 0,
        });
    };

    return {
        useFetchAllTrendingVodios,
    };
}
