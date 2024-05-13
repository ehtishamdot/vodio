export const FEATURES_LIST=[
    {
        title:"Blog Vodios",
        description:"Effortlessly convert your favorite written content into engaging audio experiences with our innovative AI-powered feature.",
        action:"Go To Blog Vodios",
        uri:"/blog-vodio",
        disabled:false
    },
    {
        title:"Doc Vodios",
        description:"Effortlessly convert your favorite written content into engaging audio experiences with our innovative AI-powered feature.",
        action:"Go To Doc Vodios",
        uri:"/pdf-vodio",
        disabled:false
    },
    {
        title:"PDF Chatbot",
        description:"Effortlessly convert your favorite written content into engaging audio experiences with our innovative AI-powered feature.",
        action:"Chat With PDF",
        uri:"/pdf-vodio/chat",
        disabled:false
    },
    {
        title:"Youtube Vodio",
        description:"Experience natural, engaging audio readings with our AI. Copy your YouTube link, and we&apos;ll convert it to audio for you.",
        action:"Coming Soon...",
        uri:"/pdf-vodio",
        disabled:true
    },
    {
        title:"Speech Cut Vodio",
        description:"Effortlessly transform your preferred written content into captivating audio experiences using our innovative AI-driven speech cut feature.",
        action:"Coming Soon...",
        uri:"/pdf-vodio",
        disabled:true
    },
    {
        title:"Subtitle Vodio",
        description:"Effortlessly create captivating videos with our innovative AI-powered feature, now available for video-to-video with subtitles.",
        action:"Coming Soon...",
        uri:"/pdf-vodio",
        disabled:true
    },
    {
        title:"ASMR Vodio",
        description:" Experience relaxation with our ASMR-ready videos, featuring smooth audio from our AI, now equipped for video-to-video with subtitles.",
        action:"Coming Soon...",
        uri:"/pdf-vodio",
        disabled:true
    }
] as const;



export const BASE_URL="http://localhost:3000"
export const EXTENSION_ID='adjminohacgmegmojfonfjmlnhfjgobb'

export const PUBLIC_ENDPOINTS=["/api/auth/signup","/api/auth/login"]