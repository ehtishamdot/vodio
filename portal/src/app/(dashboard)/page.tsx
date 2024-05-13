"use client";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {FEATURES_LIST} from "@/lib/constants";



const Home = () => {
  return (
      <div className={"w-full lg:h-[832px] bg-[#0B0A0A]"}>
          <h2 className={"p-[16px] text-[16px] font-semibold text-[#FFF0EE]"}>
              Vodio Features
          </h2>
          <section className={"w-full gap-[16px] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4"}>
              {FEATURES_LIST.map((el,index)=>{
                  return (
                      <div
                          key={index}
                          className={
                              "mx-[16px] max-w-full sm:max-w-[328px]  p-[16px 19px 37px 16px] justify-center items-center rounded-[8px] border border-[#1C1E30] bg-[#050505]"
                          }
                      >
                          <div className={" p-[16px]"}>
                              <h2 className={"text-[20px] md:text-[24px] text-brand-two font-bold"}>
                                  {el.title}
                              </h2>
                              <p
                                  className={
                                      "mb- md:mb-[32px] text-[#9D9D9D] h-[84px] text-[14px] font-[400px] mt-[16px]"
                                  }
                              >
                                  {el.description}
                              </p>
                              {el.disabled && <Button disabled={el?.disabled} className={"font-[600]"} variant={"brand"}>{el.action}</Button>}
                              {!el.disabled&&<Link href={el.uri}>
                                  <Button disabled={el.disabled} className={"font-[600]"} variant={"brand"}>{el.action}</Button>
                              </Link>}
                          </div>
                      </div>
                  )
              })}
          </section>
      </div>
  );
};
export default Home;
