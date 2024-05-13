"use client";
import {usePlayerStore} from "@/store/player.store";
import {toast} from "sonner";
import Image from "next/image";
import {truncateString} from "@/lib/helpers";
import ShareDialog from "@/components/common/dialogs/share-dialog";
import {usePathname} from "next/navigation";
import Link from "next/link";
import BaseLoader from "@/components/common/loaders/base-loader";
import TrendingService from "@/services/trending.service";
import VodioCard from "@/components/common/cards/vodio-card";

const TrendingVodios = () => {
    const {useFetchAllTrendingVodios}=TrendingService();
    const {data:blogData,isLoading:isBlogDataPending}=useFetchAllTrendingVodios();
    const {setPlayList,playList,metadata,setMetadata}=usePlayerStore();
    const pathname=usePathname();
    if(isBlogDataPending){
        return <div className={"p-[16px] w-full flex items-center justify-center min-h-[832px] bg-[#0B0A0A]"}>
            <BaseLoader/>
        </div>
    }
    return (
        <div className={"w-full bg-[#0B0A0A]"}>
            <h2 className={"p-[16px] text-[16px] font-semibold text-[#FFF0EE]"}>
                Trending Vodios
            </h2>
            <h2 className={"p-[16px] text-[16px] font-semibold text-[#FFF0EE]"}>
                Blog Vodios
            </h2>
            <VodioCard data={blogData?.blogs} feature={"Blog"}/>
            <h2 className={"p-[16px] text-[16px] font-semibold text-[#FFF0EE]"}>
                Doc  Vodios
            </h2>
            <VodioCard data={blogData?.pdfs} feature={"Doc"}/>
        </div>
    );
};
export default TrendingVodios;
