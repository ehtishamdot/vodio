import {useEffect, useState} from "react";
const ContentScript=()=>{
    const [blogContent,setBlogContent]=useState("");
    useEffect(() => {
        const blogContent=document.querySelector("article");
        const img=document.querySelectorAll("article img")[1] as HTMLImageElement;

        (async () => {
            await chrome.runtime.sendMessage({
                msg:"CONTENT_SIGNAL",
                data:{
                    content:blogContent?.innerText??"",
                    img:img?.src||""
                }
            });
        })();
        setBlogContent(blogContent?.innerText??"")
    }, []);
    return(
        <div>
            <p>{blogContent}</p>
        </div>

    )
}
export default ContentScript;
