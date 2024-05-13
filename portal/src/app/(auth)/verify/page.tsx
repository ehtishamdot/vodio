"use client"
import dynamic from "next/dynamic";

  const UserVerificationForm = dynamic(
    () => import("@/components/modules/auth/user-verification-form").then((mod) => mod.UserVerificationForm),
    {
      ssr: false
    }
  );
  
const VerificationPage=()=>{
    return(
        <UserVerificationForm/>
    )
}
export default VerificationPage;
