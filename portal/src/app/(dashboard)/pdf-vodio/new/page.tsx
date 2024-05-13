import CreatePdf from "@/components/modules/pdf/create-pdf";
import {PDF_TYPES} from "@/lib/enums";

const NewPDFVodio=()=>{
    return <CreatePdf type={PDF_TYPES.VODIO}/>
}
export default NewPDFVodio;