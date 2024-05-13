export type userType = {
    createdAt: string;
    email: string;
    emailVerified: null | string;
    id: string;
    image: null | string;
    updatedAt: string;
    username: string;
};

export type ChromeMessage = {
    type: string;
    data: any; // eslint-disable-line
    ticker?: string;
    error?: string;
};
export type pageDetailsType={
    url:string;
    title:string;
}

export type blogType={
    content:string;
    title:string;
    web_url:string;
    web_name:string;
    to:string;
    img:string;
}