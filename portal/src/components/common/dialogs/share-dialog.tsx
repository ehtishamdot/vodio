"use client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {FacebookShareButton, LinkedinShareButton,TwitterShareButton} from "react-share";
import { FaFacebook,FaLinkedin } from "react-icons/fa";
import {FaSquareXTwitter} from "react-icons/fa6";
import { LuClipboardCopy } from "react-icons/lu";
import {Input} from "@/components/ui/input";
import {copyToClipboard} from "@/lib/helpers";
const ShareDialog=({url}:{url:string})=>{
    return(
        <Dialog>
            <DialogTrigger>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                     fill="none">
                    <path
                        d="M15 18.3333C14.3056 18.3333 13.7153 18.0903 13.2292 17.6042C12.7431 17.118 12.5 16.5278 12.5 15.8333C12.5 15.7361 12.5069 15.6353 12.5208 15.5308C12.5347 15.4264 12.5556 15.3328 12.5833 15.25L6.70833 11.8333C6.47222 12.0417 6.20833 12.205 5.91667 12.3233C5.625 12.4417 5.31944 12.5005 5 12.5C4.30556 12.5 3.71528 12.2569 3.22917 11.7708C2.74306 11.2847 2.5 10.6944 2.5 9.99999C2.5 9.30555 2.74306 8.71527 3.22917 8.22916C3.71528 7.74305 4.30556 7.49999 5 7.49999C5.31944 7.49999 5.625 7.55916 5.91667 7.67749C6.20833 7.79582 6.47222 7.95888 6.70833 8.16666L12.5833 4.74999C12.5556 4.66666 12.5347 4.57305 12.5208 4.46916C12.5069 4.36527 12.5 4.26443 12.5 4.16666C12.5 3.47221 12.7431 2.88193 13.2292 2.39582C13.7153 1.90971 14.3056 1.66666 15 1.66666C15.6944 1.66666 16.2847 1.90971 16.7708 2.39582C17.2569 2.88193 17.5 3.47221 17.5 4.16666C17.5 4.8611 17.2569 5.45138 16.7708 5.93749C16.2847 6.4236 15.6944 6.66666 15 6.66666C14.6806 6.66666 14.375 6.60777 14.0833 6.48999C13.7917 6.37221 13.5278 6.20888 13.2917 5.99999L7.41667 9.41666C7.44444 9.49999 7.46528 9.59388 7.47917 9.69832C7.49306 9.80277 7.5 9.90332 7.5 9.99999C7.5 10.0972 7.49306 10.198 7.47917 10.3025C7.46528 10.4069 7.44444 10.5005 7.41667 10.5833L13.2917 14C13.5278 13.7917 13.7917 13.6286 14.0833 13.5108C14.375 13.393 14.6806 13.3339 15 13.3333C15.6944 13.3333 16.2847 13.5764 16.7708 14.0625C17.2569 14.5486 17.5 15.1389 17.5 15.8333C17.5 16.5278 17.2569 17.118 16.7708 17.6042C16.2847 18.0903 15.6944 18.3333 15 18.3333Z"
                        fill="#FFF0EE"/>
                </svg>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Share Your Vodios</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <div className={"flex gap-4"}>
                    <FacebookShareButton url={url}>
                        <FaFacebook size={30}/>
                    </FacebookShareButton>
                    <LinkedinShareButton url={url}>
                        <FaLinkedin size={30}/>
                    </LinkedinShareButton>
                    <TwitterShareButton url={url}>
                        <FaSquareXTwitter size={30}/>
                    </TwitterShareButton>
                </div>
                <div className={"flex gap-2 items-center"}>
                    <Input disabled={true} value={url}></Input>
                    <LuClipboardCopy onClick={()=>copyToClipboard(url)} className={"cursor-pointer"} size={25}/>
                </div>


            </DialogContent>
        </Dialog>
    )
}
export default ShareDialog;