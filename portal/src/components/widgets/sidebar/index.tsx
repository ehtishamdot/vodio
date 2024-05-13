"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {useMediaPlayerStore, usePlayerStore} from "@/store/player.store";
import {moveIndexToFirst, truncateString} from "@/lib/helpers";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import {Badge} from "@/components/ui/badge";
import PlaylistPlaceholder from "@/assets/playlist-placeholder.svg"
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);
  const playList = usePlayerStore(state => state.playList)
  const setCurrentId = usePlayerStore(state => state.setCurrentId)
  const metadata = usePlayerStore(state => state.metadata)
  const setPlaylist = usePlayerStore(state => state.setPlayList)
  const setMetadata = usePlayerStore(state => state.setMetadata)
  const {setIsPlaying}=useMediaPlayerStore()

  useEffect(() => {
    usePlayerStore.persist.rehydrate()
  }, [])
  console.log({sidebarOpen});

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const updatedPlaylist=[...playList];
    const updatedMeta=[...metadata];
    const [reorderedItem] = updatedPlaylist.splice(result.source.index, 1);
    updatedPlaylist.splice(result.destination.index, 0, reorderedItem);
    const [reorderedMeta] = updatedMeta.splice(result.source.index, 1);
    updatedMeta.splice(result.destination.index, 0, reorderedMeta);
    setPlaylist(updatedPlaylist);
    setMetadata(updatedMeta);
  }
  return (
    <aside
      ref={sidebar}
      className={`bg-[#0B0A0A] fixed md:absolute lg:max-h-[calc(100vh-67px)] left-0 top-14 z-99 lg:z-0 flex flex-col overflow-y-hidden lg:bg-transparent w-auto duration-300 ease-linear lg:translate-x-0 lg:static ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div
          className={
            "flex  flex-col p-[16px] text-white m-[24px] gap-[32px] w-[320px] p-[16px 207px 16px 16px]  bg-[#0B0A0A] rounded-md"
          }
      >
        <div>
          <Link
              href={"/"}
              className={`${
                  pathname === "/"
                      ? "text-brand-two font-[600] "
                      : "text-[#505161] font-[400]"
              } text-[16px] `}
          >
            Home
          </Link>
        </div>
        <div>
          <Link
              href={"/trending"}
              className={`${
                  pathname === "/trending"
                      ? "text-brand-two font-[600] "
                      : "text-[#505161] font-[400]"
              } text-[16px] `}
          >
            Trending
          </Link>
        </div>
      </div>

      <div
          className={
            "flex  w-[320px] overflow-hidden h-[693px] p-[16px 16px 609px 16px ml-[24px] flex-col items-start gap-[24px] rounded-md bg-[#0B0A0A]"
          }
      >
        <div
            className={
              "p-[16px] flex overflow-hidden gap-[16px] text-[#505161] font-[400] text-[16px]"
          }
        >
          <Image
            src={"/icons/playlist.svg"}
            alt={"playlist"}
            width={20}
            height={20}
          />
          <p>Up Next</p>
        </div>
        <div
          className={
            "text-[#505161] flex gap-8 w-full  lg:w-[288px] text-[12px] font-[400] mx-[16px]"
          }
        >
          <p>Processing</p>
          <p>Queued</p>
          <p>Failed</p>
        </div>
        {playList&&metadata&&<ScrollArea className={"h-full w-full"}>

          <DragDropContext style={{overflow:"hidden"}} onDragEnd={handleOnDragEnd}>
            <Droppable direction={"vertical"} droppableId="droppable" style={{overflow:"hidden"}}>
              {(provided,snapshot) => (
                  <div className={"overflow-hidden"} {...provided.droppableProps} ref={provided.innerRef}>
                    {playList?.map((el, index) => {
                      return (
                          <Draggable  key={index.toString()} draggableId={index.toString()} index={index}>
                            {(provided) => (
                              <div onClick={()=>{
                                // const updatedPlaylist=moveIndexToFirst(playList,index)
                                // const updatedMeta=moveIndexToFirst(metadata,index)
                                //  setPlaylist(updatedPlaylist);
                                //  setMetadata(updatedMeta);
                                setCurrentId(el.id)
                                setIsPlaying(true);
                              }} ref={provided.innerRef} style={{transform:"none !important"}} {...provided.draggableProps}  variant={snapshot.isDragging ? "elevation" : "outlined"}
                                   elevation={4} {...provided.dragHandleProps} className={"flex overflow-hidden flex-col"}>
                            <div
                                key={index}
                                className={
                                  "p-[16px] flex flex-col w-full lg:w-full overflow-hidden justify-center items-start gap-[8px]"
                                }
                            >
                              <div className={"flex items-center gap-[8px]"}>
                                {el?.img !== "" && <Image
                                    src={el?.img || ""}
                                    alt={"img"}
                                    width={53}
                                    className={"bg-red w-[53px] h-[53px]  rounded-[4px]"}
                                    height={53}
                                />}
                                {el?.img === "" && <Image
                                    src={PlaylistPlaceholder}
                                    alt={"img"}
                                    width={53}
                                    className={"bg-red w-[53px] h-[53px]  rounded-[4px]"}
                                    height={53}
                                />}
                                <div className={"flex items-center gap-[12px]"}>
                                  <div className={"flex flex-col items-start gap-[4px] "}>
                                    <h2
                                        className={
                                          "text-[#FFF0EE] w-[208px] leading-normal text-[14px] font-[500] "
                                        }
                                    >
                                      {truncateString(el?.name?.toString() ?? "", 50)}
                                    </h2>
                                    {/*<div className={"flex items-center gap-[4px] "}>*/}
                                    {/*  <p className={"text-[#A3A3A3] text-[12px] font-[400]"}>News Week</p>*/}
                                    {/*  <div className={"rounded-full w-[4px] h-[4px] bg-[#A3A3A3]"}></div>*/}
                                    {/*  <p className={"text-[#A3A3A3] text-[12px] font-[400]"}>2w agp</p>*/}
                                    {/*</div>*/}
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger>
                                      <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="8"
                                          height="21"
                                          viewBox="0 0 8 21"
                                          fill="none"
                                      >
                                        <g clip-path="url(#clip0_239_537)">
                                          <path
                                              d="M4.00016 14.6667C4.44219 14.6667 4.86611 14.8423 5.17867 15.1548C5.49123 15.4674 5.66683 15.8913 5.66683 16.3333C5.66683 16.7754 5.49123 17.1993 5.17867 17.5118C4.86611 17.8244 4.44219 18 4.00016 18C3.55814 18 3.13421 17.8244 2.82165 17.5118C2.50909 17.1993 2.3335 16.7754 2.3335 16.3333C2.3335 15.8913 2.50909 15.4674 2.82165 15.1548C3.13421 14.8423 3.55814 14.6667 4.00016 14.6667ZM4.00016 8.83333C4.44219 8.83333 4.86611 9.00893 5.17867 9.32149C5.49123 9.63405 5.66683 10.058 5.66683 10.5C5.66683 10.942 5.49123 11.366 5.17867 11.6785C4.86611 11.9911 4.44219 12.1667 4.00016 12.1667C3.55814 12.1667 3.13421 11.9911 2.82165 11.6785C2.50909 11.366 2.3335 10.942 2.3335 10.5C2.3335 10.058 2.50909 9.63405 2.82165 9.32149C3.13421 9.00893 3.55814 8.83333 4.00016 8.83333ZM4.00016 3C4.44219 3 4.86611 3.1756 5.17867 3.48816C5.49123 3.80072 5.66683 4.22464 5.66683 4.66667C5.66683 5.10869 5.49123 5.53262 5.17867 5.84518C4.86611 6.15774 4.44219 6.33333 4.00016 6.33333C3.55814 6.33333 3.13421 6.15774 2.82165 5.84518C2.50909 5.53262 2.3335 5.10869 2.3335 4.66667C2.3335 4.22464 2.50909 3.80072 2.82165 3.48816C3.13421 3.1756 3.55814 3 4.00016 3Z"
                                              fill="#FFF0EE"
                                          />
                                        </g>
                                        <defs>
                                          <clipPath id="clip0_239_537">
                                            <rect
                                                width="20"
                                                height="8"
                                                fill="white"
                                                transform="matrix(0 -1 1 0 0 20.5)"
                                            />
                                          </clipPath>
                                        </defs>
                                      </svg>


                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                      <DropdownMenuItem onClick={()=>{
                                        const updatedPlaylist=[...playList]
                                        updatedPlaylist.splice(index,1)
                                        setPlaylist(updatedPlaylist)

                                        const updatedMeta=[...metadata]
                                        updatedMeta.splice(index,1)
                                        setMetadata(updatedMeta)
                                      }}>Remove From Playlist</DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>

                                </div>
                              </div>
                              <div className={"flex justify-between w-full items-center gap-[4px] "}>
                                <div className={"flex items-center gap-[4px]"}>
                                  <p className={"text-[#FFF0EE] text-[12px] font-[400]"}>
                                    {metadata[index]?.reading_time}
                                  </p>
                                  <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="13"
                                      height="10"
                                      viewBox="0 0 13 10"
                                      fill="none"
                                  >
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M7.59229 0.162257C7.69675 0.0583586 7.83837 0 7.98602 0C8.13366 0 8.27528 0.0583586 8.37974 0.162257L12.8371 4.60077C12.9414 4.7048 13 4.84581 13 4.99284C13 5.13986 12.9414 5.28088 12.8371 5.3849L8.37974 9.82342C8.32874 9.87793 8.26723 9.92165 8.19888 9.95197C8.13054 9.9823 8.05676 9.9986 7.98195 9.99991C7.90714 10.0012 7.83283 9.98752 7.76345 9.95962C7.69407 9.93172 7.63105 9.89018 7.57814 9.8375C7.52524 9.78481 7.48353 9.72206 7.4555 9.65298C7.42748 9.58389 7.41372 9.5099 7.41504 9.4354C7.41636 9.3609 7.43273 9.28744 7.46319 9.21938C7.49364 9.15132 7.53755 9.09007 7.59229 9.03928L11.0987 5.54765H0.557164C0.409395 5.54765 0.267678 5.4892 0.163189 5.38515C0.058701 5.2811 0 5.13998 0 4.99284C0 4.84569 0.058701 4.70457 0.163189 4.60052C0.267678 4.49648 0.409395 4.43802 0.557164 4.43802H11.0987L7.59229 0.946394C7.48795 0.842366 7.42934 0.701352 7.42934 0.554326C7.42934 0.4073 7.48795 0.266285 7.59229 0.162257Z"
                                        fill="#FFF0EE"
                                    />
                                  </svg>

                                  <p className={"text-[#FFF0EE] text-[12px] font-[400]"}>
                                     {metadata[index].length}
                                  </p>

                                </div>
                                {metadata && <Badge className={"text-white"}>{metadata[index].feature}</Badge>}
                              </div>

                            </div>
                            <div>
                              <Separator
                                  className={"mb-2 w-72 h-[1px] lg:w-full bg-[#272942]"}
                              />
                            </div>
                          </div>
                      )
                    }
                    </Draggable>

                    )
                      ;
                    })}
                    {provided.placeholder}
                  </div>
              )}
            </Droppable>
          </DragDropContext>

        </ScrollArea>}
      </div>
    </aside>
  );

}
export default Sidebar;
