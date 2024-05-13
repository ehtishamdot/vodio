"use client";
import Link from "next/link";
import BaseLoader from "@/components/common/loaders/base-loader";
import {Button} from "@/components/ui/button";
import PdfService from "@/services/pdf.service";
import VodioCard from "@/components/common/cards/vodio-card";
const AllPDFVodios = () => {
    const {useFetchAllPDFVodios}=PdfService();
    const {data:blogData,isLoading:isBlogDataPending}=useFetchAllPDFVodios();
    if(isBlogDataPending){
        return <div className={"p-[16px] w-full flex items-center justify-center min-h-[832px] bg-[#0B0A0A]"}>
            <BaseLoader/>
        </div>
    }
    return (
        <div className={"w-full bg-[#0B0A0A]"}>
            <div className={"flex justify-between items-center"}>
                <h2 className={"p-[16px] text-[16px] font-semibold text-[#FFF0EE]"}>
                    Your Vodios
                </h2>
                <Link href={"/pdf-vodio/new"}>
                    <Button variant={"brand"} className={"mr-4 font-[400]"}>Add New</Button>
                </Link>
            </div>
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
export default AllPDFVodios;
