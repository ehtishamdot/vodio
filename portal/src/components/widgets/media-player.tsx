
"use client"
import dynamic from 'next/dynamic'

const AudioPlayer = dynamic(
    () => import("react-modern-audio-player"),
    { ssr: false}
  );
  const ActiveUI = dynamic(
    () => import("react-modern-audio-player").then((mod) => mod.ActiveUI),
    {
      ssr: false
    }
  );
  const InterfaceGridTemplateArea = dynamic(
    () => import("react-modern-audio-player").then((mod) => mod.InterfaceGridTemplateArea),
    {
      ssr: false
    }
  );
  const PlayListPlacement = dynamic(
    () => import("react-modern-audio-player").then((mod) => mod.PlayListPlacement),
    {
      ssr: false
    }
  );
  const ProgressUI = dynamic(
    () => import("react-modern-audio-player").then((mod) => mod.ProgressUI),
    {
      ssr: false
    }
  );
  const VolumeSliderPlacement = dynamic(
    () => import("react-modern-audio-player").then((mod) => mod.VolumeSliderPlacement),
    {
      ssr: false
    }
  );
import {MutableRefObject, useEffect, useRef, useState} from "react";
import {useMediaPlayerStore, usePlayerStore} from "@/store/player.store";
import useMediaQuery from "@/hooks/use-media-query";
import {playerMode} from "@/components/widgets/player-mode";


export default function MediaPlayer() {
    const {playList,currentId,setCurrentTime,currentTime}=usePlayerStore();
    const {isPlaying}=useMediaPlayerStore();

    const [progressType, setProgressType] = useState<ProgressUI>("bar");

    const [playerPlacement, setPlayerPlacement] = useState<PlayListPlacement>(
        // @ts-ignore
        "bottom-left"
    );
    const [interfacePlacement, setInterfacePlacement] = useState<
        InterfaceGridTemplateArea<any>
    >();
    const [playListPlacement, setPlayListPlacement] = useState<PlayListPlacement>(
        "bottom"
    );
    const [volumeSliderPlacement, setVolumeSliderPlacement] = useState<
        VolumeSliderPlacement
    >();
    const [theme, setTheme] = useState<"dark" | "light" | undefined>("dark");
    const [width, setWidth] = useState("100%");
    const [activeUI, setActiveUI] = useState<ActiveUI>({ all: true });
    const isMobile = useMediaQuery(768);
    useEffect(() => {
        if(isMobile){
            setInterfacePlacement(playerMode[2].interfacePlacement);
            setProgressType(playerMode[2].progressType);
            setPlayListPlacement(playerMode[2].playListPlacement);
            setVolumeSliderPlacement(playerMode[2].volumeSliderPlacement);
            setWidth("100%");
            setActiveUI(playerMode[2].activeUI ?? { all: true });
        }
        else{
            setInterfacePlacement(playerMode[0].interfacePlacement);
            setProgressType("bar");
            setPlayListPlacement(playerMode[0].playListPlacement);
            setVolumeSliderPlacement(playerMode[0].volumeSliderPlacement);
            setWidth("100%");
            setActiveUI(playerMode[0].activeUI ?? { all: true });
        }
    }, [isMobile]);
    return (
        <main className="z-20">
            <div className="player-container z-[999999]">
                {playList&&playList.length>0&&<AudioPlayer
                    audioInitialState={{
                        isPlaying:isPlaying,
                        curPlayId:playList[0].id,
                        repeatType:"NONE",
                    }}
                    playList={playList}
                    activeUI={{
                        ...activeUI,
                        progress: progressType
                    }}
                    placement={{
                        player: playerPlacement,
                        interface: {
                            templateArea: interfacePlacement
                        },
                        playList: playListPlacement,
                        volumeSlider: volumeSliderPlacement
                    }}
                    rootContainerProps={{
                        colorScheme: theme,
                        width
                    }}
                />}
            </div>
        </main>
    );
}
