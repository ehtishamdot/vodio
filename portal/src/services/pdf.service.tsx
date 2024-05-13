
import {useMutation, useQuery} from "@tanstack/react-query";
import {toast} from "sonner";
import {viewError} from "@/lib/helpers";
import {errorType} from "@/lib/types";
import {signupResponse} from "@/lib/types/user";
import {z} from "zod";
import httpRequest from "@/lib/config/axios-instance";
import {pdfChatInitSchema, pdfChatResponseSchema, pdfChatSchema, pdfVodioFormSchema} from "@/lib/schema/pdf";
import {fetchAllBlogVodiosApiResponse, vodioPodcastType} from "@/lib/types/vodio";
import axios from "@/lib/config/axios-instance";
import {axiosInstance} from "@/lib/interceptor";
import {usePDFChatStore} from "@/store/pdf-chat.store";
import {useRouter} from "next/navigation";
export default function PdfService() {
    const router=useRouter();
    const useHandleCreatePDFVodio = () => {
        function handleCreatePDFVodio(
            data: z.infer<typeof pdfVodioFormSchema>,
        ): Promise<signupResponse> {
            return httpRequest.post("/api/pdf", data).then((res) => res.data);
        }

        const onSuccess = async (response: signupResponse) => {
            toast.success("Vodio Created Successfully");
            router.push("/pdf-vodio")
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleCreatePDFVodio,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    const useFetchAllPDFVodios = () => {
        function fetchPatients(): Promise<fetchAllBlogVodiosApiResponse> {
            return axios.get("/api/pdf/all").then((res) => res.data);
        }
        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`pdf-vodios`],
            retry: 0,
        });
    };
    const useFetchPDFVodioDetails = (id:string) => {
        function fetchPatients(): Promise<vodioPodcastType> {
            return axios.get(`/api/pdf?podcastId=${id}`).then((res) => res.data);
        }
        return useQuery({
            queryFn: fetchPatients,
            queryKey: [`pdf-vodio`,id],
            retry: 0,
        });
    };
    const useHandleCreatePDFChat = () => {
        const {setStep,step}=usePDFChatStore();

        function handleCreatePDFVodio(
            data: z.infer<typeof pdfChatInitSchema>,
        ): Promise<signupResponse> {
            return axiosInstance.post("/api/create/vector/pdf", data).then((res) => res.data);
        }

        const onSuccess = async (response: signupResponse) => {
            toast.success("PDF Uploaded Successfully");
            setStep(step+1);
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleCreatePDFVodio,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    const useHandleChatWithPDF = () => {
        const {setChatResponse}=usePDFChatStore();

        function handleCreatePDFVodio(
            data: z.infer<typeof pdfChatSchema>,
        ): Promise<z.infer<typeof pdfChatResponseSchema>> {
            return axiosInstance.post("/api/bot/chat/pdf", data).then((res) => res.data);
        }

        const onSuccess = async (response: z.infer<typeof pdfChatResponseSchema>) => {
            setChatResponse(response)

        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleCreatePDFVodio,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    return {
      useHandleCreatePDFVodio,
        useFetchAllPDFVodios,
        useFetchPDFVodioDetails,
        useHandleCreatePDFChat,
        useHandleChatWithPDF
    };
}
