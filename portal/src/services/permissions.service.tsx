
import { useMutation } from "@tanstack/react-query";
import {toast} from "sonner";
import {viewError} from "@/lib/helpers";
import {errorType} from "@/lib/types";
import {signupResponse} from "@/lib/types/user";
import httpRequest from "@/lib/config/axios-instance";
export default function PermissionsService() {
    const useHandleUpdateFeaturePermissions = () => {
        function handleSignupRequest(
            data: {featureId:string;isPublic:boolean;},
        ): Promise<signupResponse> {
            return httpRequest.put("/api/permissions", data).then((res) => res.data);
        }

        const onSuccess = async (response: signupResponse) => {
            toast.success("Permissions Updated Successfully");
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
        useHandleUpdateFeaturePermissions,
    };
}
