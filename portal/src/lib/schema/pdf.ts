import {z} from "zod";

export const pdfVodioFormSchema=z.object({
    content:z.string(),
    to:z.string().email()
})

export const pdfChatInitSchema=z.object({
    content:z.string(),
    user_id:z.string()
})

export const pdfChatSchema=z.object({
    role:z.string(),
    user_id:z.string(),
    content:z.string()
})

export const pdfChatResponseSchema=z.object({
    role:z.string(),
    audio_file:z.string(),
    content:z.string()
})