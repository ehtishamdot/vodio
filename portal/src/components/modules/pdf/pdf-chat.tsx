"use client";
import {useEffect, useState} from "react";
import { FaCirclePause } from "react-icons/fa6";

import { useSpeechRecognition } from "react-speech-kit";
import {Button} from "@/components/ui/button";
import {PuffLoader} from "react-spinners";
import PdfService from "@/services/pdf.service";
import TokenService from "@/services/token.service";
import {usePDFChatStore} from "@/store/pdf-chat.store";
import useAudio from "@/hooks/use-audio";
import TypeOnce from "@/components/common/typewriter/type-once";
import { FaCirclePlay } from "react-icons/fa6";
import { MdReplayCircleFilled } from "react-icons/md";
import {Spotlight} from "@/components/ui/spotlight";

const PdfChat=()=>{
    const [speech,setSpeech]=useState("");
    const {useHandleChatWithPDF}=PdfService();
    const {mutate:handleChatWithPDF,isPending:isHandleChatWithPDFPending,isSuccess}=useHandleChatWithPDF();
    const { listen, listening, stop } = useSpeechRecognition({
        onResult: (result: string) => {
            setSpeech(result);
            console.log(result,'res')
        },
    });
    const {chatResponse,setChatResponse}=usePDFChatStore();
    const [playing, toggle,replay] = useAudio(chatResponse?.audio_file||"");
    useEffect(() => {
        if(isSuccess){
            toggle();
        }
    }, [isSuccess]);

    return(
        <div className={"flex flex-col justify-center items-center h-full  min-h-[80vh]"}>
            {(listening || isHandleChatWithPDFPending) && <div className={"flex flex-col justify-center items-center"}>
                <PuffLoader size={200} color="#9AA2FB"/>
                <div>
                    {!isHandleChatWithPDFPending &&
                        <p className={"mt-2 text-white text-3xl font-semibold"}>Ask Your Question.....</p>}
                    {isHandleChatWithPDFPending &&
                        <p className={"mt-2 text-white text-3xl font-semibold"}>Processing.....</p>}
                </div>
            </div>}
            {chatResponse && <div className={"flex gap-4 items-center my-4"}>
                {!playing &&
                    <FaCirclePlay onClick={() => toggle()} size={40} className={"cursor-pointer  text-brand-one"}/>}
                {playing &&
                    <FaCirclePause onClick={() => toggle()} size={40} className={"cursor-pointer text-brand-one"}/>}
                <MdReplayCircleFilled onClick={() => replay()} size={40} className={"cursor-pointer text-brand-one"}/>
            </div>}
            {chatResponse && <div className={"mt-4 !text-center text-white"}>
                <TypeOnce>{chatResponse.content}</TypeOnce>
            </div>}
            {!isHandleChatWithPDFPending&&(chatResponse||listening) && <Button className={"mt-6"} variant={"brand"} onClick={() => {
                if (!listening) {
                    if (playing) {
                        toggle();
                    }
                    listen();
                    if (chatResponse) {
                        setChatResponse(undefined);
                    }
                } else {
                    stop();
                    handleChatWithPDF({
                        role: "user",
                        content: speech,
                        user_id: TokenService.getUser()?.userCopy.id || ''
                    })
                }
            }}>
                {listening ? "Iam Done Speaking" : chatResponse ? "Ask Another Question" : "Ask A Question"}
            </Button>}
            {!listening&&!isHandleChatWithPDFPending&&!chatResponse&&<div
                className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center  antialiased bg-grid-white/[0.02] relative overflow-hidden">
                <Spotlight
                    className="-top-40 left-0 md:left-60 md:-top-20"
                    fill="white"
                />
                <div className=" flex flex-col justify-center items-center p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
                    <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                        Welcome <br/>  To The Vodio Chat
                    </h1>
                    <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
                        You can ask anything about the document which you uploaded
                    </p>
                    {!isHandleChatWithPDFPending && <Button className={"mt-6"} variant={"brand"} onClick={() => {
                        if (!listening) {
                            if (playing) {
                                toggle();
                            }
                            listen();
                            if (chatResponse) {
                                setChatResponse(undefined);
                            }
                        } else {
                            stop();
                            handleChatWithPDF({
                                role: "user",
                                content: speech,
                                user_id: TokenService.getUser()?.userCopy.id || ''
                            })
                        }
                    }}>
                        {listening ? "Iam Done Speaking" : chatResponse ? "Ask Another Question" : "Ask A Question"}
                    </Button>}
                </div>
            </div>}


        </div>
    )
}
export default PdfChat;