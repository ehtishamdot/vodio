import {notFound} from "next/navigation";
import VodioDetails from "@/components/modules/vodios/vodio-details";

const VodioPage=({params}:{params:{vodio:string}})=>{
    const {vodio} = params;
    if(!vodio){
        notFound();
    }
    return (
        <VodioDetails id={vodio}/>
    )
}
export default VodioPage;
