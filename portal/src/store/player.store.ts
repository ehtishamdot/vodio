"use client"
import { create } from "zustand";

import dynamic from 'next/dynamic'
const AudioData = dynamic(
    () => import("react-modern-audio-player").then((mod) => mod.AudioData),
    {
      ssr: false
    }
  );
import {persist} from "zustand/middleware";

type metadataType={
    id:string;
    length:string;
    reading_time:string;
    summary:string;
    feature:string;
}

export type State = {
    playList: AudioData[]|undefined;
    metadata: metadataType[]|undefined;
    currentId:number;
    currentTime:number;

};

export type Actions = {
    setPlayList: (playList: AudioData[]) => void;
    setMetadata: (metadata: metadataType[]) => void;
    setCurrentId: (current: number) => void;
    setCurrentTime: (current: number) => void;

};

const initialState={
    playList:undefined,
    currentId:0,
    currentTime:0,
    metadata:undefined,
}


export const usePlayerStore = create<State & Actions>()(
    persist(
        (set,get) => ({
            ...initialState,
            setPlayList: (playList) => set(() => ({ playList: playList })),
            setMetadata: (metadata) => set(() => ({ metadata: metadata })),
            setCurrentId: (id:number) => set(() => ({ currentId: id })),
            setCurrentTime: (id:number) => set(() => ({ currentTime: id })),
            reset: () => set(initialState),
        }),
        { name: 'task-store', skipHydration: true }
    ),
)


export const useMediaPlayerStore = create((set) => ({
    isPlaying:false,
    setIsPlaying: (isPlaying) => set(() => ({ isPlaying: isPlaying })),
}));


