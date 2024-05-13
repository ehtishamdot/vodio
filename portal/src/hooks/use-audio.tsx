import { useState, useEffect } from "react";

const useAudio = (url: string) => {
    const [audio, setAudio] = useState(new Audio(url));
    useEffect(() => {
        setAudio(new Audio(url));
    }, [url]);

    const [playing, setPlaying] = useState(false);
    const toggle = () => setPlaying(!playing);

    const play = () => {
        setPlaying(true);
        audio.play();
    };

    const pause = () => {
        setPlaying(false);
        audio.pause();
    };

    const replay = () => {
        audio.currentTime = 0;
        play();
    };

    useEffect(() => {
        playing ? audio.play() : audio.pause();
        }, [playing]);

    useEffect(() => {
        audio.addEventListener('ended', () => setPlaying(false));
        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
        };
    }, []);

    return [playing, toggle, replay];
};

export default useAudio;
