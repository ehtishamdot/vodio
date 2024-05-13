import {useEffect, useState} from "react";
import tokenService from "@/services/token.service.ts";
import CreateVodio from "@/pages/popup/create-vodio.tsx";
import GetStarted from "@/pages/popup/get-started.tsx";
import {userType} from "@/lib/types";


function App() {
    chrome?.runtime?.connect({name: "POPUP"});
    const [user,setUser]=useState<userType>();
    useEffect(() => {
        async function checkUser() {
            const user = await tokenService.getUser();
            console.log(user)
            if(user){
                setUser(user);
            }
        }
        checkUser();
    }, []);

  return (
     <div>
         {user?<CreateVodio user={user}/>:<GetStarted/>}
     </div>
  )
}

export default App
