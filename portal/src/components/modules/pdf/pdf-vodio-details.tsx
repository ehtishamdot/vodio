"use client";
import {Chrono} from "react-chrono";
import {useMemo} from "react";
import Link from "next/link";
import {useMediaPlayerStore, usePlayerStore} from "@/store/player.store";
import {toast} from "sonner";
import {ScrollArea} from "@/components/ui/scroll-area";
import ShareDialog from "@/components/common/dialogs/share-dialog";
import BaseLoader from "@/components/common/loaders/base-loader";
import {truncateString} from "@/lib/helpers";
import PdfService from "@/services/pdf.service";
import {Badge} from "@/components/ui/badge";
import {Switch} from "@/components/ui/switch";
import PermissionsService from "@/services/permissions.service";
import Placeholder from "@/assets/playlist-placeholder.svg";
import Image from "next/image";
const PDFVodioDetails=({id}:{id:string})=>{
    const {useFetchPDFVodioDetails}=PdfService();
    const {data:blogDetails,isLoading:isBlogDetailsPending}=useFetchPDFVodioDetails(id);
    const {useHandleUpdateFeaturePermissions}=PermissionsService()
    const {mutate:handleUpdateFeature,isPending:isHandleUpdateFeaturePending}=useHandleUpdateFeaturePermissions();
    const conversationItems = useMemo(()=>{
        if(blogDetails&&blogDetails?.conversation){
            return Object.keys(blogDetails?.conversation).map(key => {
                const segment = blogDetails?.conversation[key];
                const title = segment?.start_time;
                const cardDetailedText = segment?.dialogue;
                return { title, cardDetailedText };
            });
        }
        return [];
    },[blogDetails,isBlogDetailsPending])
    const {playList,setPlayList,metadata,setMetadata,currentTime}=usePlayerStore();
    const {setIsPlaying}=useMediaPlayerStore();

    if(isBlogDetailsPending){
        return <div className={"p-[16px] w-full flex items-center justify-center min-h-[832px] bg-[#0B0A0A]"}>
            <BaseLoader/>
        </div>
    }
    return (
        <div className={"p-[16px] w-full min-h-[832px] bg-[#0B0A0A]"}>
            <div className={"inline-flex items-center gap-[24px] flex-col md:flex-row"}>
                <Image src={Placeholder} objectFit={"cover"} alt={"dummy"} className={"w-4/5 md:w-[140px] md:h-[140px] object-cover rounded-[4px]"} width={140} height={140}/>
                <div className={"flex flex-col items-start gap-[8px]"}>
                    <Badge className={"text-white"}>{blogDetails?.feature.name}</Badge>
                    <h2 className={"text-[#FFF0EE] font-semibold text-[20px] md:text-[24px]"}>{blogDetails?.openingSentence}</h2>
                    <div className={"flex flex-wrap justify-between items-center"}>
                        <div className={"flex items-center gap-[16px]"}>
                            <svg className={"cursor-pointer"}
                                 onClick={() => {
                                     setIsPlaying(true);
                                     setPlayList([{
                                         id: 1,
                                         src: blogDetails?.audioFile || "",
                                         img: blogDetails?.img ?? "",
                                         name: blogDetails?.openingSentence,
                                         writer: blogDetails?.hosts[0] || ""
                                     },
                                     ])
                                     setMetadata([{
                                         id: blogDetails?.id || "",
                                         reading_time: blogDetails?.article?.reading_time || "",
                                         length: blogDetails?.length || "",
                                         summary: blogDetails?.summary || "",
                                         feature: blogDetails?.feature.name || ""
                                     }])
                                 }}

                                 xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"
                                 fill="none">
                                <rect width="40" height="40" rx="20" fill="#FFF0EE"/>
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M28.7921 19.8547L14.9995 11.8914C14.8734 11.8179 14.7301 11.779 14.5842 11.7785H14.5818C14.4357 11.7791 14.2924 11.818 14.1662 11.8914C14.039 11.9639 13.9335 12.069 13.8604 12.1957C13.7872 12.3225 13.7491 12.4665 13.75 12.6128V28.5393C13.7494 28.6857 13.7876 28.8297 13.8605 28.9567C13.9335 29.0837 14.0387 29.1891 14.1656 29.2623C14.2924 29.3356 14.4363 29.374 14.5827 29.3737C14.7292 29.3734 14.873 29.3344 14.9995 29.2607L28.7921 21.2974C28.9187 21.2243 29.0239 21.1192 29.097 20.9925C29.1701 20.8659 29.2086 20.7223 29.2086 20.576C29.2086 20.4298 29.1701 20.2862 29.097 20.1596C29.0239 20.0329 28.9187 19.9278 28.7921 19.8547Z"
                                      fill="#664EF8"/>
                            </svg>
                            <svg className={"cursor-pointer"} onClick={() => {
                                if (playList && metadata) {
                                    setPlayList([...playList, {
                                        id: playList?.length+1,
                                        src: blogDetails?.audioFile || "",
                                        img: blogDetails?.img ?? "",
                                        name: blogDetails?.openingSentence,
                                        writer: blogDetails?.hosts[0] || ""
                                    }])
                                    setMetadata([...metadata, {
                                        id: blogDetails?.id || "",
                                        reading_time: blogDetails?.article?.reading_time || "",
                                        length: blogDetails?.length || "",
                                        summary: blogDetails?.summary || "",
                                        feature: blogDetails?.feature.name || ""
                                    }])
                                } else {
                                    setPlayList([
                                        {
                                            id: 1,
                                            src: blogDetails?.audioFile || "",
                                            img: blogDetails?.img ?? "",
                                            name: blogDetails?.openingSentence,
                                            writer: blogDetails?.hosts[0] || ""
                                        }
                                    ])
                                    setMetadata([{
                                        id: blogDetails?.id || "",
                                        reading_time: blogDetails?.article?.reading_time || "",
                                        length: blogDetails?.length || "",
                                        summary: blogDetails?.summary || "",
                                        feature: blogDetails?.feature.name || ""
                                    }])
                                }
                                toast("Vodio Added To Playlist")

                            }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                                 fill="none">
                                <path
                                    d="M2.5 5C2.5 4.83424 2.56585 4.67527 2.68306 4.55806C2.80027 4.44085 2.95924 4.375 3.125 4.375H16.875C17.0408 4.375 17.1997 4.44085 17.3169 4.55806C17.4342 4.67527 17.5 4.83424 17.5 5C17.5 5.16576 17.4342 5.32473 17.3169 5.44194C17.1997 5.55915 17.0408 5.625 16.875 5.625H3.125C2.95924 5.625 2.80027 5.55915 2.68306 5.44194C2.56585 5.32473 2.5 5.16576 2.5 5ZM10.625 9.375H3.125C2.95924 9.375 2.80027 9.44085 2.68306 9.55806C2.56585 9.67527 2.5 9.83424 2.5 10C2.5 10.1658 2.56585 10.3247 2.68306 10.4419C2.80027 10.5592 2.95924 10.625 3.125 10.625H10.625C10.7908 10.625 10.9497 10.5592 11.0669 10.4419C11.1842 10.3247 11.25 10.1658 11.25 10C11.25 9.83424 11.1842 9.67527 11.0669 9.55806C10.9497 9.44085 10.7908 9.375 10.625 9.375ZM10.625 14.375H3.125C2.95924 14.375 2.80027 14.4408 2.68306 14.5581C2.56585 14.6753 2.5 14.8342 2.5 15C2.5 15.1658 2.56585 15.3247 2.68306 15.4419C2.80027 15.5592 2.95924 15.625 3.125 15.625H10.625C10.7908 15.625 10.9497 15.5592 11.0669 15.4419C11.1842 15.3247 11.25 15.1658 11.25 15C11.25 14.8342 11.1842 14.6753 11.0669 14.5581C10.9497 14.4408 10.7908 14.375 10.625 14.375ZM19.0813 11.9703L14.0813 8.84531C13.9867 8.7862 13.878 8.75347 13.7665 8.75053C13.655 8.74759 13.5447 8.77454 13.4472 8.82858C13.3496 8.88263 13.2683 8.9618 13.2116 9.05789C13.155 9.15397 13.1251 9.26346 13.125 9.375V15.625C13.1251 15.7365 13.155 15.846 13.2116 15.9421C13.2683 16.0382 13.3496 16.1174 13.4472 16.1714C13.5447 16.2255 13.655 16.2524 13.7665 16.2495C13.878 16.2465 13.9867 16.2138 14.0813 16.1547L19.0813 13.0297C19.171 12.9735 19.245 12.8954 19.2963 12.8027C19.3476 12.7101 19.3745 12.6059 19.3745 12.5C19.3745 12.3941 19.3476 12.2899 19.2963 12.1973C19.245 12.1046 19.171 12.0265 19.0813 11.9703Z"
                                    fill="#FFF0EE"/>
                            </svg>
                            <ShareDialog url={`${process.env.NEXT_PUBLIC_API_URL}/blog-vodio/${blogDetails?.id}`}/>
                        </div>
                    </div>
                    <div className={"text-white flex gap-4 items-center"}>
                        <p className={"text-[#505161] font-[400] text-[14px]"}>Make Vodio visible to others</p>
                        <Switch onCheckedChange={(e) => {
                            handleUpdateFeature({isPublic: e, featureId: blogDetails?.featureId || ""})
                        }} defaultChecked={blogDetails?.feature?.isPublic}/>
                    </div>
                </div>
            </div>

            <div className={"flex flex-col xl:flex-row gap-[16px] mt-[16px]"}>
                <div
                    className={"w-full xl:max-w-[440px] flex p-[16px 14px 240px 16px] flex-col items-start rounded-[8px] border border-[#1C1E30] bg-[#050505] pb-4"}>
                    <div className={" px-[16px] pt-[16px] flex flex-col items-start gap-[8px]"}>
                        <h4 className={"text-[#9AA2FB] font-semibold text-[16px] "}>Summary</h4>
                        <p className={"w-full xl:w-[410px] text-[#FFF0EE] text-[14px] font-[400]"}>{blogDetails?.summary}</p>
                    </div>
                    <div className={" px-[16px] pt-[16px] flex flex-col items-start gap-[8px]"}>
                        <h4 className={"text-[#9AA2FB] font-semibold text-[16px] "}>Article</h4>
                        <div className={"flex flex-col items-start flex-wrap gap-[4px]"}>
                            <p className={"text-[#505161] font-[400] text-[14px]"}>Publication: <span
                                className={"text-white "}> {blogDetails?.article.publication}</span></p>
                            <p className={"text-[#505161] font-[400] text-[14px]"}>Date Published: <span
                                className={"text-white "}> {blogDetails?.article.date_published}</span></p>
                            <p className={"text-[#505161] font-[400] text-[14px]"}>Words: <span
                                className={"text-white "}> {blogDetails?.article.words}</span></p>
                            <p className={"text-[#505161] font-[400] text-[14px]"}>Reading Time: <span
                                className={"text-white "}> {blogDetails?.article.reading_time}</span></p>
                            <p className={"text-[#505161] font-[400] text-[14px]"}>Link to article: <Link
                                className={"text-white "}
                                href={blogDetails?.article.link_to_article || ""}>{truncateString(blogDetails?.article.link_to_article || "", 30)}</Link>
                            </p>
                            <p className={"text-[#505161] font-[400] text-[14px] flex"}>Topics: <span
                                className={"text-white flex px-2 gap-x-2 gap-y-0 flex-wrap"}>{blogDetails?.article.topics.map((el, index) => {
                                return (
                                    <p key={index}>{el}</p>
                                )
                            })}</span></p>
                        </div>
                    </div>

                    <div className={" px-[16px] pt-[16px] flex flex-col items-start gap-[8px]"}>
                        <h4 className={"text-[#9AA2FB] font-semibold text-[16px] "}>Vodio</h4>
                        <div className={"flex flex-col items-start gap-[4px]"}>
                            <p className={"text-[#505161] font-[400] text-[14px]"}>Length: <span
                                className={"text-white "}>{blogDetails?.length || ""}</span></p>
                            <p className={"text-[#505161] font-[400] text-[14px]"}>Channel: <span
                                className={"text-white "}> </span></p>
                            <p className={"text-[#505161] flex gap-2 font-[400] text-[14px]"}>Hosts: <span
                                className={"text-white flex gap-2 "}> {blogDetails?.hosts.map((el, index) => {
                                return (
                                    <p key={index}>{el}</p>
                                )
                            })}</span></p>
                        </div>
                    </div>

                </div>

                <ScrollArea
                    className={"w-full flex p-[16px 14px 240px 16px] h-[664px] flex-col items-start rounded-[8px] border border-[#1C1E30] bg-[#050505]"}>
                    <div className={" px-[16px] pt-[16px] flex flex-col items-start gap-[8px]"}>
                        <h4 className={"text-[#9AA2FB] font-semibold text-[16px] "}>Script</h4>
                    </div>
                    {!isBlogDetailsPending && <div className={"pt-[16px]"}>
                        <Chrono
                            theme={{
                                primary: 'white',
                                secondary: 'blue',
                                cardBgColor: 'transparent',
                                titleColor: 'white',
                                titleColorActive: 'white',
                                cardTextColor: 'white',
                            }}
                            classNames={{
                                card: 'bg-[#050505] !text-white',
                                cardDetailedText: "!text-white",
                                cardMedia: 'my-card-media',
                                cardSubTitle: 'my-card-subtitle',
                                cardText: '!text-white',
                                cardTitle: 'my-card-title',
                                title: '!text-[#FFF0EE] !text-end !text-[12px] !bg-transparent !font-[400]',
                            }}
                            useReadMore={false}

                            cardHeight={100} lineWidth={1} borderLessCards={true} disableToolbar={true}
                            mode={"VERTICAL"}
                            items={conversationItems}>
                        </Chrono>
                    </div>}
                </ScrollArea>
            </div>
        </div>
    )
}
export default PDFVodioDetails;

//
// "use client";
// import {Chrono} from "react-chrono";
// import {useMemo} from "react";
// import Link from "next/link";
// import {usePlayerStore} from "@/store/player.store";
// import {toast} from "sonner";
// import {ScrollArea} from "@/components/ui/scroll-area";
// import ShareDialog from "@/components/common/dialogs/share-dialog";
// import BaseLoader from "@/components/common/loaders/base-loader";
// import {convertToSeconds, truncateString} from "@/lib/helpers";
// import PdfService from "@/services/pdf.service";
// import {Badge} from "@/components/ui/badge";
// import {Switch} from "@/components/ui/switch";
// import PermissionsService from "@/services/permissions.service";
// import Placeholder from "@/assets/playlist-placeholder.svg";
// import Image from "next/image";
// const PDFVodioDetails=({id}:{id:string})=>{
//     const {useFetchPDFVodioDetails}=PdfService();
//     const {data:blogDetails,isLoading:isBlogDetailsPending}=useFetchPDFVodioDetails(id);
//     const {useHandleUpdateFeaturePermissions}=PermissionsService()
//     const {mutate:handleUpdateFeature,isPending:isHandleUpdateFeaturePending}=useHandleUpdateFeaturePermissions();
//     const conversationItems = useMemo(()=>{
//         if(blogDetails&&blogDetails?.conversation){
//             return Object.keys(blogDetails?.conversation).map(key => {
//                 const segment = blogDetails?.conversation[key];
//                 const title = segment?.start_time;
//                 const cardDetailedText = segment?.dialogue;
//                 return { title, cardDetailedText };
//             });
//         }
//         return [];
//     },[blogDetails,isBlogDetailsPending])
//     const {playList,setPlayList,metadata,setMetadata,currentTime}=usePlayerStore();
//     if(isBlogDetailsPending){
//         return <div className={"p-[16px] w-full flex items-center justify-center min-h-[832px] bg-[#0B0A0A]"}>
//             <BaseLoader/>
//         </div>
//     }
//     return (
//         <div className={"p-[16px] w-full min-h-[832px] bg-[#0B0A0A]"}>
//             <div className={"inline-flex items-center gap-[24px] flex-col md:flex-row"}>
//                 <Image src={Placeholder} objectFit={"cover"} alt={"dummy"} className={"w-4/5 md:w-[140px] md:h-[140px] object-cover rounded-[4px]"} width={140} height={140}/>
//                 <div className={"flex flex-col items-start gap-[8px]"}>
//                     <Badge className={"text-white"}>{blogDetails?.feature.name}</Badge>
//                     <h2 className={"text-[#FFF0EE] font-semibold text-[20px] md:text-[24px]"}>{blogDetails?.openingSentence}</h2>
//                     <div className={"flex flex-wrap justify-between items-center"}>
//                         <div className={"flex items-center gap-[16px]"}>
//                             <svg className={"cursor-pointer"}
//                                  onClick={() => {
//                                      setPlayList([{
//                                          id: 1,
//                                          src: blogDetails?.audioFile || "",
//                                          img: blogDetails?.img ?? "",
//                                          name: blogDetails?.openingSentence,
//                                          writer: blogDetails?.hosts[0] || ""
//                                      },
//                                      ])
//                                      setMetadata([{
//                                          id: blogDetails?.id || "",
//                                          reading_time: blogDetails?.article?.reading_time || "",
//                                          length: blogDetails?.length || "",
//                                          summary: blogDetails?.summary || "",
//                                          feature: blogDetails?.feature.name || ""
//                                      }])
//                                  }}
//
//                                  xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"
//                                  fill="none">
//                                 <rect width="40" height="40" rx="20" fill="#FFF0EE"/>
//                                 <path fill-rule="evenodd" clip-rule="evenodd"
//                                       d="M28.7921 19.8547L14.9995 11.8914C14.8734 11.8179 14.7301 11.779 14.5842 11.7785H14.5818C14.4357 11.7791 14.2924 11.818 14.1662 11.8914C14.039 11.9639 13.9335 12.069 13.8604 12.1957C13.7872 12.3225 13.7491 12.4665 13.75 12.6128V28.5393C13.7494 28.6857 13.7876 28.8297 13.8605 28.9567C13.9335 29.0837 14.0387 29.1891 14.1656 29.2623C14.2924 29.3356 14.4363 29.374 14.5827 29.3737C14.7292 29.3734 14.873 29.3344 14.9995 29.2607L28.7921 21.2974C28.9187 21.2243 29.0239 21.1192 29.097 20.9925C29.1701 20.8659 29.2086 20.7223 29.2086 20.576C29.2086 20.4298 29.1701 20.2862 29.097 20.1596C29.0239 20.0329 28.9187 19.9278 28.7921 19.8547Z"
//                                       fill="#664EF8"/>
//                             </svg>
//                             <svg className={"cursor-pointer"} onClick={() => {
//                                 if (playList && metadata) {
//                                     setPlayList([...playList, {
//                                         id: playList?.length,
//                                         src: blogDetails?.audioFile || "",
//                                         img: blogDetails?.img ?? "",
//                                         name: blogDetails?.openingSentence,
//                                         writer: blogDetails?.hosts[0] || ""
//                                     }])
//                                     setMetadata([...metadata, {
//                                         id: blogDetails?.id || "",
//                                         reading_time: blogDetails?.article?.reading_time || "",
//                                         length: blogDetails?.length || "",
//                                         summary: blogDetails?.summary || "",
//                                         feature: blogDetails?.feature.name || ""
//                                     }])
//                                 } else {
//                                     setPlayList([
//                                         {
//                                             id: 1,
//                                             src: blogDetails?.audioFile || "",
//                                             img: blogDetails?.img ?? "",
//                                             name: blogDetails?.openingSentence,
//                                             writer: blogDetails?.hosts[0] || ""
//                                         }
//                                     ])
//                                     setMetadata([{
//                                         id: blogDetails?.id || "",
//                                         reading_time: blogDetails?.article?.reading_time || "",
//                                         length: blogDetails?.length || "",
//                                         summary: blogDetails?.summary || "",
//                                         feature: blogDetails?.feature.name || ""
//                                     }])
//                                 }
//                                 toast("Vodio Added To Playlist")
//
//                             }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
//                                  fill="none">
//                                 <path
//                                     d="M2.5 5C2.5 4.83424 2.56585 4.67527 2.68306 4.55806C2.80027 4.44085 2.95924 4.375 3.125 4.375H16.875C17.0408 4.375 17.1997 4.44085 17.3169 4.55806C17.4342 4.67527 17.5 4.83424 17.5 5C17.5 5.16576 17.4342 5.32473 17.3169 5.44194C17.1997 5.55915 17.0408 5.625 16.875 5.625H3.125C2.95924 5.625 2.80027 5.55915 2.68306 5.44194C2.56585 5.32473 2.5 5.16576 2.5 5ZM10.625 9.375H3.125C2.95924 9.375 2.80027 9.44085 2.68306 9.55806C2.56585 9.67527 2.5 9.83424 2.5 10C2.5 10.1658 2.56585 10.3247 2.68306 10.4419C2.80027 10.5592 2.95924 10.625 3.125 10.625H10.625C10.7908 10.625 10.9497 10.5592 11.0669 10.4419C11.1842 10.3247 11.25 10.1658 11.25 10C11.25 9.83424 11.1842 9.67527 11.0669 9.55806C10.9497 9.44085 10.7908 9.375 10.625 9.375ZM10.625 14.375H3.125C2.95924 14.375 2.80027 14.4408 2.68306 14.5581C2.56585 14.6753 2.5 14.8342 2.5 15C2.5 15.1658 2.56585 15.3247 2.68306 15.4419C2.80027 15.5592 2.95924 15.625 3.125 15.625H10.625C10.7908 15.625 10.9497 15.5592 11.0669 15.4419C11.1842 15.3247 11.25 15.1658 11.25 15C11.25 14.8342 11.1842 14.6753 11.0669 14.5581C10.9497 14.4408 10.7908 14.375 10.625 14.375ZM19.0813 11.9703L14.0813 8.84531C13.9867 8.7862 13.878 8.75347 13.7665 8.75053C13.655 8.74759 13.5447 8.77454 13.4472 8.82858C13.3496 8.88263 13.2683 8.9618 13.2116 9.05789C13.155 9.15397 13.1251 9.26346 13.125 9.375V15.625C13.1251 15.7365 13.155 15.846 13.2116 15.9421C13.2683 16.0382 13.3496 16.1174 13.4472 16.1714C13.5447 16.2255 13.655 16.2524 13.7665 16.2495C13.878 16.2465 13.9867 16.2138 14.0813 16.1547L19.0813 13.0297C19.171 12.9735 19.245 12.8954 19.2963 12.8027C19.3476 12.7101 19.3745 12.6059 19.3745 12.5C19.3745 12.3941 19.3476 12.2899 19.2963 12.1973C19.245 12.1046 19.171 12.0265 19.0813 11.9703Z"
//                                     fill="#FFF0EE"/>
//                             </svg>
//                             <ShareDialog url={`${process.env.NEXT_PUBLIC_API_URL}/blog-vodio/${blogDetails?.id}`}/>
//                         </div>
//                     </div>
//                     <div className={"text-white flex gap-4 items-center"}>
//                         <p className={"text-[#505161] font-[400] text-[14px]"}>Make Vodio visible to others</p>
//                         <Switch onCheckedChange={(e) => {
//                             handleUpdateFeature({isPublic: e, featureId: blogDetails?.featureId || ""})
//                         }} defaultChecked={blogDetails?.feature?.isPublic}/>
//                     </div>
//                 </div>
//             </div>
//
//             <div className={"flex flex-col xl:flex-row gap-[16px] mt-[16px]"}>
//                 <div
//                     className={"w-full xl:max-w-[440px] flex p-[16px 14px 240px 16px] flex-col items-start rounded-[8px] border border-[#1C1E30] bg-[#050505] pb-4"}>
//                     <div className={" px-[16px] pt-[16px] flex flex-col items-start gap-[8px]"}>
//                         <h4 className={"text-[#9AA2FB] font-semibold text-[16px] "}>Summary</h4>
//                         <p className={"w-full xl:w-[410px] text-[#FFF0EE] text-[14px] font-[400]"}>{blogDetails?.summary}</p>
//                     </div>
//                     <div className={" px-[16px] pt-[16px] flex flex-col items-start gap-[8px]"}>
//                         <h4 className={"text-[#9AA2FB] font-semibold text-[16px] "}>Article</h4>
//                         <div className={"flex flex-col items-start flex-wrap gap-[4px]"}>
//                             <p className={"text-[#505161] font-[400] text-[14px]"}>Publication: <span
//                                 className={"text-white "}> {blogDetails?.article.publication}</span></p>
//                             <p className={"text-[#505161] font-[400] text-[14px]"}>Date Published: <span
//                                 className={"text-white "}> {blogDetails?.article.date_published}</span></p>
//                             <p className={"text-[#505161] font-[400] text-[14px]"}>Words: <span
//                                 className={"text-white "}> {blogDetails?.article.words}</span></p>
//                             <p className={"text-[#505161] font-[400] text-[14px]"}>Reading Time: <span
//                                 className={"text-white "}> {blogDetails?.article.reading_time}</span></p>
//                             <p className={"text-[#505161] font-[400] text-[14px]"}>Link to article: <Link
//                                 className={"text-white "}
//                                 href={blogDetails?.article.link_to_article || ""}>{truncateString(blogDetails?.article.link_to_article || "", 30)}</Link>
//                             </p>
//                             <p className={"text-[#505161] font-[400] text-[14px] flex"}>Topics: <span
//                                 className={"text-white flex px-2 gap-x-2 gap-y-0 flex-wrap"}>{blogDetails?.article.topics.map((el, index) => {
//                                 return (
//                                     <p key={index}>{el}</p>
//                                 )
//                             })}</span></p>
//                         </div>
//                     </div>
//
//                     <div className={" px-[16px] pt-[16px] flex flex-col items-start gap-[8px]"}>
//                         <h4 className={"text-[#9AA2FB] font-semibold text-[16px] "}>Vodio</h4>
//                         <div className={"flex flex-col items-start gap-[4px]"}>
//                             <p className={"text-[#505161] font-[400] text-[14px]"}>Length: <span
//                                 className={"text-white "}>{blogDetails?.length || ""}</span></p>
//                             <p className={"text-[#505161] font-[400] text-[14px]"}>Channel: <span
//                                 className={"text-white "}> </span></p>
//                             <p className={"text-[#505161] flex gap-2 font-[400] text-[14px]"}>Hosts: <span
//                                 className={"text-white flex gap-2 "}> {blogDetails?.hosts.map((el, index) => {
//                                 return (
//                                     <p key={index}>{el}</p>
//                                 )
//                             })}</span></p>
//                         </div>
//                     </div>
//
//                 </div>
//
//                 <ScrollArea
//                     className={"w-full flex p-[16px 14px 240px 16px] h-[664px] flex-col items-start rounded-[8px] border border-[#1C1E30] bg-[#050505]"}>
//                     <div className={" px-[16px] pt-[16px] flex flex-col items-start gap-[8px]"}>
//                         <h4 className={"text-[#9AA2FB] font-semibold text-[16px] "}>Script</h4>
//                     </div>
//                     {!isBlogDetailsPending && <div className={"pt-[16px]"}>
//                         <Chrono
//                             theme={{
//                                 primary: 'white',
//                                 secondary: 'blue',
//                                 cardBgColor: 'transparent',
//                                 titleColor: 'white',
//                                 titleColorActive: 'white',
//                                 cardTextColor: 'white',
//                             }}
//                             classNames={{
//                                 card: 'bg-[#050505] !text-white',
//                                 cardDetailedText: "!text-white",
//                                 cardMedia: 'my-card-media',
//                                 cardSubTitle: 'my-card-subtitle',
//                                 cardText: '!text-white',
//                                 cardTitle: 'my-card-title',
//                                 title: '!text-[#FFF0EE] !text-end !text-[12px] !bg-transparent !font-[400]',
//                             }}
//                             useReadMore={false}
//
//                             cardHeight={100} lineWidth={1} borderLessCards={true} disableToolbar={true}
//                             mode={"VERTICAL"}
//                             items={conversationItems}>
//                             {blogDetails?.conversation.map((el,index)=>{
//                                 return(
//                                     <div className={currentTime>=convertToSeconds(el.start_time)&&currentTime<=convertToSeconds(el.end_time)?"bg-red":""} key={index}>
//                                         <p>{el.dialogue}</p>
//                                     </div>
//                                 )
//                             })}
//                         </Chrono>
//                     </div>}
//                 </ScrollArea>
//             </div>
//         </div>
//     )
// }
// export default PDFVodioDetails;