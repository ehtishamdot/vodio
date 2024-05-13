import tokenService from "@/services/token.service.ts";
import {SIGNALS} from "@/lib/enums";

export const backgroundMethods = () => {
    chrome.runtime.onInstalled.addListener(()=>{
        void chrome.tabs.create({ url: `http://localhost:3000/login`})
    })

    chrome.runtime.onMessage.addListener(async (request) => {
        if (request.msg===SIGNALS.CONTENT) {
            console.log("got msg")
            await tokenService.setContent(request.data);
        }
    });

    chrome.runtime.onMessageExternal.addListener(async (request, sender, sendResponse) => {
        if (request.msg===SIGNALS.LOGIN) {
            console.log(sender)
            console.log('USER ::: ', request.data);
            await tokenService.saveLocalAccessToken(request.data.accessToken);
            await tokenService.saveLocalRefreshToken(request.data.refreshToken);
            await tokenService.setUser(request.data.userCopy);
            await tokenService.setTokenRetries(5);
            sendResponse({ success: true, message: 'Token has been received' });
        }
    });
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        console.log(tabId)
        console.log(tab)
        if (changeInfo.url) {
            chrome.storage.local.set({ tabs: changeInfo.url }, () => {
                console.log('URL is set:', changeInfo.url);
            });
        }
    });
    (async () => {
        const response = await chrome.runtime.sendMessage({extensionId: chrome.runtime.id});
        // do something with response here, not outside the function
        console.log(response);
    })();
}

if (chrome.runtime.id){
    backgroundMethods();
}
