"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {Button} from "@/components/ui/button";
import AuthServices from "@/services/auth.service";
import {useSearchParams} from "next/navigation";
import {useEffect} from "react";
import DefaultLoader from "@/components/common/loaders/default-loader";
import LoadingPage from "@/components/common/loaders/loading-page";

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

export function UserVerificationForm() {
    const {useHandle2FA,useHandleVerifyUser}=AuthServices()
    const {mutate:handle2FA,isPending:isHandle2FAPending} = useHandle2FA();
    const {mutate:handleVerify,isPending:isUserVerificationPending} = useHandleVerifyUser();
    const searchParams = useSearchParams()
    const email = searchParams.get('email');
    useEffect(()=>{
        if(email){
            handle2FA({input:email});
        }
    },[email])
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
       handleVerify(data);
    }
    if(isHandle2FAPending){
        return <LoadingPage/>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                  className="flex h-screen w-full flex-col justify-center items-center">
                <div className={`lg:pt-[31px] w-[196px] flex flex-col justify-center items-center !font-bebasNeue`}>
                    <h1 className={"text-brand-two text-center text-[56px] font-[400] !font-bebasNeue leading-[64px]"}>ACCOUNT VERIFICATION</h1>
                </div>
                <FormField
                    control={form.control}
                    name="pin"
                    render={({field}) => (
                        <FormItem>
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot className={"border  border-[#9AA2FB] lg:w-20 lg:h-20 text-white"}
                                                      index={0}/>
                                        <InputOTPSlot className={"border border-[#9AA2FB] lg:w-20 lg:h-20 text-white"}
                                                      index={1}/>
                                        <InputOTPSlot className={"border border-[#9AA2FB] lg:w-20 lg:h-20 text-white"}
                                                      index={2}/>
                                        <InputOTPSlot className={"border border-[#9AA2FB] lg:w-20 lg:h-20 text-white"}
                                                      index={3}/>
                                        <InputOTPSlot className={"border border-[#9AA2FB] lg:w-20 lg:h-20 text-white"}
                                                      index={4}/>
                                        <InputOTPSlot className={"border border-[#9AA2FB] lg:w-20 lg:h-20 text-white"}
                                                      index={5}/>
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                {isUserVerificationPending?<DefaultLoader/>:<Button disabled={isUserVerificationPending} className={"bg-brand-two mt-4 xl:w-[250px] text-white"}>Verify</Button>}
            </form>
        </Form>
    )
}
