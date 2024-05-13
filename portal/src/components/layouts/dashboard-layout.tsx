
"use client";
import React, { useState } from "react";
import Sidebar from "@/components/widgets/sidebar";
import Header from "@/components/widgets/header";
import MediaPlayer from "@/components/widgets/media-player";
export default function DefaultLayout({
                                          children,
                                      }: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* <!-- ===== Page Wrapper Start ===== --> */}
            <div className="flex items-start  overflow-hidden">

                {/* <!-- ===== sidebar Start ===== --> */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                {/* <!-- ===== sidebar End ===== --> */}

                {/* <!-- ===== Content Area Start ===== --> */}
                <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                    {/* <!-- ===== header Start ===== --> */}
                    {/* <!-- ===== header End ===== --> */}

                    {/* <!-- ===== Main Content Start ===== --> */}
                    <main className="grow">
                        <div className="p-4 md:p-6 mx-auto max-w-screen-2xl 2xl:px-10">
                            {children}
                            <br/><br/>
                            <MediaPlayer/>
                        </div>
                    </main>
                    {/* <!-- ===== Main Content End ===== --> */}
                </div>
                {/* <!-- ===== Content Area End ===== --> */}
            </div>
            {/* <!-- ===== Page Wrapper End ===== --> */}
        </>
    );
}
