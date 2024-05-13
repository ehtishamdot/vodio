export type conversationSegment= {
    dialogue: string;
    start_time: string;
    end_time: string;
}

export type conversationType= {
    [key: string]: conversationSegment;
}

export type  articleType= {
    publication: string;
    date_published: string;
    words: number;
    reading_time: string;
    link_to_article: string;
    topics: string[];
}

export type featureType ={
    id: string;
    name: string;
    isPublic:boolean;
    userId: string;
    categoryIDs: string[];
}

export type vodioPodcastType= {
    id: string;
    openingSentence: string;
    audioFile: string;
    conversation: conversationType;
    summary: string;
    article: articleType;
    length: string;
    hosts: string[];
    featureId: string;
    feature: featureType;
    img:string;
}

export type fetchAllBlogVodiosApiResponse={
    yourVodios:{
        id:string;
        name: string;
        userId: string;
        podcasts:vodioPodcastType[];
    }[],
    trendingVodio:{
        id:string;
        name: string;
        userId: string;
        podcasts:vodioPodcastType[];
    }
}