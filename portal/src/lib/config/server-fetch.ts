import {cookies} from "next/headers";

import {BASE_URL} from "@/lib/constants";

const cookieAuth="accessToken";

export default async function serverFetch<T>(
    url: string,
    tags: string[],
    revalidate?: number,
    custom?: boolean,
): Promise<T> {
    const authorization = cookies().get(cookieAuth)?.value;

    const res = await fetch(custom ? url : `${BASE_URL}${url}`, {
        headers: { authorization: `Bearer ${authorization}` },
        next: { tags: tags, revalidate: revalidate || 3600 },
    });
    console.log(res.status, "status");
    return (await res.json()) as T;
}
