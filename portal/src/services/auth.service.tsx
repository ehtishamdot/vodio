import { useMutation } from "@tanstack/react-query";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {sendTokenToChromeExtension, viewError} from "@/lib/helpers";
import {errorType} from "@/lib/types";
import {signupResponse, userType} from "@/lib/types/user";
import tokenService from "@/services/token.service";
import {z} from "zod";
import {loginFormSchema, signupFormSchema} from "@/lib/schema/auth";
import httpRequest from "@/lib/config/axios-instance";
import {EXTENSION_ID} from "@/lib/constants";
import {usePlayerStore} from "@/store/player.store";
export default function AuthServices() {
    const router=useRouter();
    const useHandleSignUpService = () => {
        function handleSignupRequest(
            data: z.infer<typeof signupFormSchema>,
        ): Promise<signupResponse> {
            return httpRequest.post("/api/auth/signup", data).then((res) => res.data);
        }

        const onSuccess = async (response: signupResponse) => {
            toast.success("Account Created Successfully");
            router.push(`/verify?email=${response?.email}`);
            // tokenService.setUser(response);
            // await sendTokenToChromeExtension({ extensionId: EXTENSION_ID, response: response})
            // router.push(`/`);
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleSignupRequest,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    const useHandleLoginService = () => {
        function handleSignupRequest(
            data: z.infer<typeof loginFormSchema>,
        ): Promise<userType> {
            return httpRequest.post("/api/auth/login", data).then((res) => res.data);
        }

        const onSuccess = async (response: userType) => {
            toast.success("Logged In Successfully");
            if(response?.userCopy?.isVerified){
                tokenService.setUser(response);
                router.push(`/`);
                await sendTokenToChromeExtension({ extensionId: EXTENSION_ID, response: response})
            }
            else{
                router.push(`/verify?email=${response?.userCopy?.email}`)
            }
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleSignupRequest,
            onError,
            onSuccess,
            retry: 0,
        });
    };

    const useHandle2FA = () => {
        function handleSignupRequest(
            data: {input:string},
        ): Promise<userType> {
            return httpRequest.post("/api/auth/2fa", data).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("Email Sent Successfully");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleSignupRequest,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    const useHandleVerifyUser = () => {
        const router = useRouter();
        function handleSignupRequest(
            data: {pin:string},
        ): Promise<userType> {
            return httpRequest.get(`/api/auth/2fa?token=${data.pin}`).then((res) => res.data);
        }

        const onSuccess = async () => {
            toast.success("User Verified Successfully");
            router.push("/login");
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleSignupRequest,
            onError,
            onSuccess,
            retry: 0,
        });
    };


    const useHandleLogOutService = () => {
        const {reset}=usePlayerStore();
        function handleSignupRequest(): Promise<userType> {
            return httpRequest.delete("/api/auth/logout").then((res) => res.data);
        }

        const onSuccess = async (response: userType) => {
            toast.success("Logged Out Successfully");
            tokenService.clearStorage();
            reset();
            router.push(`/login`);
        };
        const onError = (error: errorType) => {
            toast.error(viewError(error));
        };

        return useMutation({
            mutationFn: handleSignupRequest,
            onError,
            onSuccess,
            retry: 0,
        });
    };
    return {
        useHandleSignUpService,
        useHandleLogOutService,
        useHandleLoginService,
        useHandle2FA,
        useHandleVerifyUser
    };
}
