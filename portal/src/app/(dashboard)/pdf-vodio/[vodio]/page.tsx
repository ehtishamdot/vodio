import {notFound} from "next/navigation";
import PDFVodioDetails from "@/components/modules/pdf/pdf-vodio-details";

const VodioPage=({params}:{params:{vodio:string}})=>{
    const {vodio} = params;
    if(!vodio){
        notFound();
    }
    return (
        <PDFVodioDetails id={vodio}/>
    )
}
export default VodioPage;
