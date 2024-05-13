import { cookieRefresh, cookieData, cookieAuth, tokenRetries } from "@/lib/cookies";
import {userType} from "@/lib/types";

class TokenService {
    getLocalAccessToken = async () => {
        return new Promise<string>((resolve, reject) => {
            chrome.storage.local.get([cookieAuth], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result[cookieAuth]);
                }
            });
        });
    };

    saveLocalAccessToken = async (token: string) => {
        return new Promise<void>((resolve, reject) => {
            const data = { [cookieAuth]: token };
            chrome.storage.local.set(data, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    console.log("access token is set");
                    resolve();
                }
            });
        });
    };
    getContent = async () => {
        return new Promise<{content:string;img:string}>((resolve, reject) => {
            chrome.storage.local.get(["content"], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result["content"]);
                }
            });
        });
    };
    setContent = async (content: {content:string;img:string}) => {
        return new Promise<void>((resolve, reject) => {
            const data = { ['content']: content };
            chrome.storage.local.set(data, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    console.log("access token is set");
                    resolve();
                }
            });
        });
    };

    getLocalRefreshToken = async () => {
        return new Promise<string>((resolve, reject) => {
            chrome.storage.local.get([cookieRefresh], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result[cookieRefresh]);
                }
            });
        });
    };

    saveLocalRefreshToken = async (token: string) => {
        return new Promise<void>((resolve, reject) => {
            const data = { [cookieRefresh]: token };
            chrome.storage.local.set(data, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    console.log("refresh token is set");
                    resolve();
                }
            });
        });
    };

    getUser = async (): Promise<userType | null> => {
        return new Promise<userType | null>((resolve, reject) => {
            chrome.storage.local.get([cookieData], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(result[cookieData]);
                }
            });
        });
    };



    updateUser = async <T extends keyof userType>(
        key: T,
        value: userType[T]
    ) => {
        const userObject = await this.getUser();
        if (userObject) {
            userObject[key] = value;
            await this.setUser(userObject);
        } else {
            throw new Error("Error");
        }
    };
    setUser = async (user: userType) => {
        return new Promise<void>((resolve, reject) => {
            const data = { [cookieData]: user };
            chrome.storage.local.set(data, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    console.log("user is set");
                    resolve();
                }
            });
        });
    };
    setTokenRetries = async (retries: number) => {
        return new Promise<void>((resolve, reject) => {
            const data = { [tokenRetries]: retries.toString() };
            console.log(data,'data')
            chrome.storage.local.set(data, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    console.log("token retries is set");
                    resolve();
                }
            });
        });
    };

    getTokenRetries = async (): Promise<number> => {
        return new Promise<number>((resolve, reject) => {
            chrome.storage.local.get([tokenRetries], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(parseInt(result[tokenRetries]));
                }
            });
        });
    };

    clearStorage = () => {
        chrome.storage.local.remove(cookieData);
        chrome.storage.local.remove(cookieAuth);
        chrome.storage.local.remove(cookieRefresh);
    };
}

export default new TokenService();
