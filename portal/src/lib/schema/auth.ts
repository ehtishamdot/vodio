import {z} from "zod";

export const loginFormSchema = z.object({
    input: z.string(),
    password: z.string(),

})

export const signupFormSchema = z.object({
    username: z.string(),
    password: z.string(),
    email:z.string().email()
})
