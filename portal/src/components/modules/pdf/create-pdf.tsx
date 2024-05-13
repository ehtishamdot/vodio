'use client';

import {useEffect, useRef, useState} from 'react';
import {Document, Page, pdfjs} from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import {FilePond} from 'react-filepond';
import 'filepond/dist/filepond.min.css';

import type {PDFDocumentProxy} from 'pdfjs-dist';
import PdfService from "@/services/pdf.service";
import {Button} from "@/components/ui/button";
import TokenService from "@/services/token.service";
import DefaultLoader from "@/components/common/loaders/default-loader";
import {PDF_TYPES} from "@/lib/enums";
import { IpynbRenderer } from "react-ipynb-renderer";
import "react-ipynb-renderer/dist/styles/monokai.css";
import {truncateDocs, truncateString} from "@/lib/helpers";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

const options = {
    cMapUrl: '/cmaps/',
    standardFontDataUrl: '/standard_fonts/',
};

const resizeObserverOptions = {};

const maxWidth = 800;

type PDFFile = string | File | null;

export default function CreatePdf({type}:{type:PDF_TYPES}) {
    const [file, setFile] = useState<PDFFile>();
    const [numPages, setNumPages] = useState<number>();
    const [selectedPages,setSelectedPages] = useState<number[]>([1]);
    const [textContent,setTextContent]=useState<string>('');
    const {useHandleCreatePDFVodio,useHandleCreatePDFChat}=PdfService();
    const {mutate:handleCreatePDFVodio,isPending}=useHandleCreatePDFVodio();
    const renderedContentRef = useRef(null);
    const {mutate:handleCreatePDFChat,isPending:isCreatePDFChatPending}=useHandleCreatePDFChat();
    const [isPDF,setIsPDF]=useState(false);
    async function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy) {
        setNumPages(nextNumPages);
    }
    useEffect(()=>{
        if(file&&isPDF){
            (async () => {
                const pdfUrl= URL.createObjectURL(file as Blob)
                const loadingTask = pdfjs.getDocument(pdfUrl);
                const pdf = await loadingTask.promise;
                let text = '';
                for (const el of selectedPages) {
                    const page = await pdf.getPage(el);
                    const content = await page.getTextContent();
                    //@ts-ignore
                    const pageText = content.items.map(item => item.str).join(' ');
                    text += pageText;
                }
                setTextContent(text);
            })();
        }
        else{
            let text=""
            file?.content?.cells?.forEach((el)=>{
               el?.source.forEach((innerEl)=>{
                   text+=innerEl;
               })
            })
            setTextContent(text);
        }
    },[selectedPages,file,isPDF])
    return (
        <div className="Example">
            <div className="Example__container">
                <div className="border-2 border-brand-two border-dashed w-full lg:w-1/2 m-auto">
                    <FilePond
                        stylePanelLayout={"integrated"}
                        onupdatefiles={(fileItems) => {
                            const uploadedFile=fileItems[0].file;
                            const fileName = uploadedFile.name;
                            if (fileName.endsWith(".pdf")) {
                                setFile(uploadedFile);
                                setIsPDF(true);
                            } else {
                                setIsPDF(false);

                                const reader = new FileReader();
                                reader.onload = (event) => {
                                    const content = event.target.result;
                                    const jsonContent = JSON.parse(content);
                                    setFile({
                                        ...uploadedFile,
                                        name: fileName.replace(".ipynb", ".json"),
                                        content: jsonContent,
                                    });
                                };
                                reader.readAsText(uploadedFile);
                            }
                        }}
                        allowMultiple={false}
                        maxFiles={1}
                        name="file"
                        labelIdle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'

                    />
                </div>
                {file&&isPDF&&<div className="mt-6 flex flex-col justify-center items-center">
                    <Document className={"flex gap-2 flex-wrap"} file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
                        {Array.from(new Array(numPages), (el, index) => (
                            <Page
                                className={`border-4 ${selectedPages.includes(index+1)&&"border-brand-two"} `}
                                onClick={()=>{
                                    const pageIndex = index + 1;
                                    if (selectedPages.includes(pageIndex)) {
                                        setSelectedPages(selectedPages.filter(page => page !== pageIndex));
                                    } else {
                                        setSelectedPages([...selectedPages, pageIndex]);
                                    }
                                }}
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                width={180}
                            />
                        ))}
                    </Document>
                </div>}
                {file&&!isPDF&&<div ref={renderedContentRef} className="mt-6 scale-x-[30%] md:scale-x-[100%] flex flex-col justify-center items-center">
                    <IpynbRenderer
                        ipynb={file.content}
                        onLoad={() => {
                            console.log("File loaded:", file.content);
                        }}
                    />
                </div>}
                <div className={'flex justify-center items-center mt-4'}>
                    {file&&selectedPages.length>0&&<Button disabled={isPending} onClick={()=>{
                        if(type===PDF_TYPES.VODIO){
                            handleCreatePDFVodio({
                                to:TokenService.getUser()?.userCopy.email||"",
                                content:truncateDocs(textContent||"",10000)
                            })
                        }
                        else{
                            handleCreatePDFChat({
                                user_id:TokenService.getUser()?.userCopy.id||"",
                                content:truncateDocs(textContent||"",10000)
                            })
                        }

                    }} variant={"brand"}>{isPending?<DefaultLoader/>:"Create Vodio"}</Button>}
                </div>
                {isPending&&type===PDF_TYPES.VODIO&&<div className={"flex flex-col justify-center items-center mt-4"}>
                    <h1 className={"text-brand-two text-center text-[32px] font-[400] !font-bebasNeue leading-[64px]"}>We are processing your Vodio...</h1>
                    <p className={"text-white"}>You can leave this page, We will email you the link of the Vodio</p>
                </div>}
            </div>
        </div>
    );
}