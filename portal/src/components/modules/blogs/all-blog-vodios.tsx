"use client";
import BlogsService from "@/services/blog.service";
import BaseLoader from "@/components/common/loaders/base-loader";
import VodioCard from "@/components/common/cards/vodio-card";

const AllBlogVodios = () => {
    const {useFetchAlLBlogVodios}=BlogsService();
    const {data:blogData,isLoading:isBlogDataPending}=useFetchAlLBlogVodios();
    if(isBlogDataPending){
        return <div className={"p-[16px] w-full flex items-center justify-center min-h-[832px] bg-[#0B0A0A]"}>
            <BaseLoader/>
        </div>
    }
    return (
        <div className={"w-full bg-[#0B0A0A]"}>
            <h2 className={"p-[16px] text-[16px] font-semibold text-[#FFF0EE]"}>
                Your Vodios
            </h2>
            <VodioCard feature={blogData?.yourVodios[0]?.name} data={blogData?.yourVodios[0]?.podcasts}></VodioCard>
            <h2 className={"p-[16px] text-[16px] font-semibold text-[#FFF0EE]"}>
                Trending Vodios
            </h2>
            <VodioCard feature={blogData?.yourVodios[0]?.name} data={blogData?.yourVodios[0]?.podcasts}></VodioCard>
            <div className="pb-30 md:pb-0">
            <h2 className={"p-[16px] text-[16px] font-semibold text-[#FFF0EE]"}>
                Latest Vodios
            </h2>
            <VodioCard feature={blogData?.yourVodios[0]?.name} data={blogData?.yourVodios[0]?.podcasts}></VodioCard>
            </div>
        </div>
    );
};
export default AllBlogVodios;
