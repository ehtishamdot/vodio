import type { Metadata } from "next";
import {Bebas_Neue, Poppins} from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/auth-provider";
import ReactQueryProvider from "@/providers/react-query-provider";
import {Toaster} from "@/components/ui/sonner";
import InterceptorInitialization from "@/lib/config/interceptor-initialization";
import Script from "next/script";

const inter = Poppins({ subsets: ["latin"],weight:["300","400","500","600","700"] });
const bebasNeue=Bebas_Neue({ subsets: ["latin"],weight:["400"],  variable: "--font-bebasNeue",})

export const metadata: Metadata = {
  title: "Vodio.AI",
  description: "AI Generated Audio Books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className+" "+bebasNeue.variable+" bg-[#100f0f]"}>
      <Script id="chat-widget" type="module">
        {`
         import Chatbot from "https://cdn.jsdelivr.net/gh/Alectorlab/RefusionChatEmbed@latest/dist/web.js"
         Chatbot.init({
             chatflowid: "3286b4f4-75c5-4a0c-838d-a54c1374cd99",
             apiHost: "https://www.brainbee.live",
         }) 
        `}
      </Script>
      <AuthProvider>
        <ReactQueryProvider>
            <InterceptorInitialization/>
            <Toaster/>
          {children}
        </ReactQueryProvider>
      </AuthProvider>
      </body>
    </html>
  );
}
