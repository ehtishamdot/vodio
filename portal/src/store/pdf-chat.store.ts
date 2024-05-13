import { create } from "zustand";
import {z} from "zod";
import {pdfChatResponseSchema} from "@/lib/schema/pdf";

export type State = {
    step:number;
    chatResponse:z.infer<typeof pdfChatResponseSchema>|undefined
};

export type Actions = {
    setStep: (step: number) => void;
    setChatResponse: (chatResponse: z.infer<typeof pdfChatResponseSchema>|undefined) => void;
};

export const usePDFChatStore = create<State & Actions>((set) => ({
    step:1,
    chatResponse:undefined,
    setStep: (step) => set(() => ({ step: step })),
    setChatResponse: (res) => set(() => ({ chatResponse: res })),
}));


