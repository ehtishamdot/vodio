
const SuccessPage=()=>{
    return (
        <div className={"flex text-white  flex-col justify-center items-center"}>
            <div className={"flex w-full items-center px-4 justify-between py-4"}>
                <h2 className={"text-brand-two text-3xl  font-bold"}>Vodio.ai</h2>
            </div>

            <p className={"mt-20 text-base"}>Vodio Created Successfully</p>
            <div className={"mt-2"}>
                <h4 className={"text-xl mb-1 font-bold  text-brand-two text-center"}>Please Check Your Email</h4>
            </div>
            {/*<div className={"flex flex-col w-full justify-center items-center mt-10"}>*/}
            {/*    <Button*/}
            {/*        onClick={()=>{*/}
            {/*            void chrome.tabs.create({ url: `http://localhost:3000/login` })*/}
            {/*        }}*/}
            {/*        className={"bg-brand-one border-brand-one border text-white py-[20px] w-[60%]  hover:bg-brand-one/80 hover:text-white"}*/}
            {/*        variant="outline">Get Started</Button>*/}
            {/*</div>*/}
        </div>
    )
}
export default SuccessPage;

