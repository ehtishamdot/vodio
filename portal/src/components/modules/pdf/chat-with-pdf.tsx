"use client";
import {PDF_TYPES} from "@/lib/enums";
import CreatePdf from "@/components/modules/pdf/create-pdf";
import PdfChat from "@/components/modules/pdf/pdf-chat";
import {usePDFChatStore} from "@/store/pdf-chat.store";

const ChatWithPdf=()=>{
    const {step}=usePDFChatStore();
    return(
        <>
            {step===1&&<CreatePdf type={PDF_TYPES.CHAT}/>}
            {step===2&&<PdfChat/>}
        </>
    )
}
export default ChatWithPdf;