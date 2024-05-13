import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useEffect, useState} from "react";
import {pageDetailsType, userType} from "@/lib/types";
import {ApiService} from "@/services/api.service.ts";
import tokenService from "@/services/token.service.ts";
import LoadingPage from "@/pages/popup/loading-page.tsx";
import SuccessPage from "@/pages/popup/success.tsx";
import {truncateString} from "@/lib/utils.ts";


const CreateVodio=({user}:{user:userType})=>{
    const [details,setDetails]=useState<pageDetailsType>();
    const [blogContent,setContent]=useState<{content:string;img:string}>();
    const [isLoading,setIsLoading]=useState(false);
    const [isSuccess,setIsSuccess]=useState(false);
    const [isError,setIsError]=useState(false);
    useEffect(() => {
        (async () => {
           const content=await tokenService.getContent();
           setContent(content);
           console.log(content);
        })();

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0];
            console.log(activeTab)
            setDetails({
                url:activeTab.url||"",
                title:activeTab.title||""
            })
        });
    }, []);
    if(isLoading){
        return  <LoadingPage/>
    }
    if(isSuccess&&!isError){
        return <SuccessPage/>
    }
    return (
        <div className={"flex text-white  flex-col justify-center items-center"}>
            <div className={"flex w-full items-center px-4 justify-between py-4"}>
                <h2 className={"text-brand-two text-3xl  font-bold"}>Vodio.ai</h2>
                <div className={"flex gap-1 items-center"}>
                    <Avatar>
                        <AvatarImage src={user.image||"https://github.com/shadcn.png"}/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className={"text-white font-semibold"}>{user.username}</p>
                </div>
            </div>

            <p className={"mt-20 text-base"}>Turn This Website Into Vodio</p>
            <div className={"mt-2"}>
                <h4 className={"text-xl mb-1 font-bold  text-brand-two text-center"}>{truncateString(details?.title||"",20)}</h4>
                <p className={"text-base text-center"}>{truncateString(details?.url||"",30)}</p>
            </div>
            <div className={"flex flex-col w-full justify-center items-center mt-10"}>
                <Button
                    onClick={async ()=>{
                        try{
                            setIsLoading(true);
                            await ApiService.blog({
                                content:blogContent?.content||"",
                                img:blogContent?.img||"",
                                title:details?.title||"",
                                web_name:details?.title||"",
                                web_url:details?.url||"",
                                to:user.email||""
                            })
                        }
                        catch (e) {
                            console.log(e)
                            setIsError(true);
                        }
                        finally {
                            setIsLoading(false);
                            setIsSuccess(true);
                        }
                    }}
                    className={"bg-brand-one border-brand-one border text-white py-[20px] w-[60%]  hover:bg-brand-one/80 hover:text-white"}
                    variant="outline">Create Vodio</Button>
            </div>
        </div>
    )
}
export default CreateVodio;
