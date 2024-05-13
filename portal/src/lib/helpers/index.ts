
import {errorType} from "@/lib/types";
import {toast} from "sonner";
export function viewError(err: errorType) {
    if (Array.isArray(err.response.data.message)) {
        return err.response.data.message[0];
    } else {
        return err.response.data.message;
    }
}

export function truncateString(str: string, maxLength: number) {

    if (str?.length <= maxLength) {
        return str;
    } else {
        return str?.slice(0, maxLength) + "...";
    }
}

export function truncateDocs(str:string, maxLength:number) {
    if (str.length <= maxLength) {
        return str;
    } else {
        return str.slice(0, maxLength);
    }
}


export const sendTokenToChromeExtension = async({ extensionId, response}:{extensionId:string,response:any}) => {
    console.log('extension',extensionId)
      await chrome.runtime.sendMessage(extensionId, {
        msg:"LOGIN_SIGNAL",
        data:response
    })
    console.log('abc')
}

export const  copyToClipboard=(text:string)=>{
    if(text){
        navigator.clipboard.writeText(text)
            .then(() => {
                toast.success("Copied To The Clipboard")
            })
            .catch((error) => {
                console.error("Unable to copy text to clipboard: " + error);
            });
    }

}

export function convertToSeconds(timeStr:string) {
    // Convert time string (HH:MM:SS) to seconds
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}


export function moveIndexToFirst(array:any, currentIndex:number) {
    // Check if currentIndex is valid
    if (currentIndex < 0 || currentIndex >= array.length) {
        return array; // Return the array unchanged if currentIndex is invalid
    }

    // Swap the elements at currentIndex and the first index
    let temp = array[currentIndex];
    array[currentIndex] = array[0];
    array[0] = temp;

    return array;
}