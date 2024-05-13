"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { loginFormSchema } from "@/lib/schema/auth";
import AuthServices from "@/services/auth.service";
import DefaultLoader from "@/components/common/loaders/default-loader";
import { signIn } from "next-auth/react";
import Link from "next/link";

const LoginForm = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      input: "",
      password: "",
    },
  });
  const { useHandleLoginService } = AuthServices();
  const { mutate: handleSignup, isPending: isHandleSignupPending } =
    useHandleLoginService();
  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    handleSignup(values);
  }

  return (
    <div
      className={
        "w-[90%] max-w-[530px] lg:w-[530px] p-4 lg:p-[31px 32px] flex flex-col justify-center items-center rounded-[12px] border border-brand-two shadow-login"
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={
            "flex flex-col items-center gap-3 md:gap-[16px] w-full max-w-[466px]"
          }
        >
          <div
            className={`lg:pt-[16px] w-[196px] flex flex-col justify-center items-center !font-bebasNeue`}
          >
            <h2
              className={
                "text-brand-two text-center text-2xl md:text-[32px] font-[400] !font-bebasNeue leading-[48px] md:leading-[64px]"
              }
            >
              SIGN IN TO
            </h2>
            <h1
              className={
                "text-brand-two text-center text-4xl md:text-[56px] font-[400] !font-bebasNeue leading-[48px] md:leading-[64px]"
              }
            >
              VODIO.AI
            </h1>
          </div>
          <div>
            <Separator
              className={"mb-2 lg:w-[466px] w-72 h-[1px] bg-[#272942]"}
            />
          </div>
          <div className={"w-full"}>
            <div
              className={"flex flex-col gap-[16px]"}
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="input"
                render={({ field }) => (
                  <FormItem className={"flex flex-col items-start gap-[6px]"}>
                    <FormLabel
                      className={
                        " text-[#FFF0EE] font-poppins text-sm md:text-[16px] font-semibold "
                      }
                    >
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        className={
                          "focus:shadow-login focus:border-[#272942] placeholder:font-[500] font-[500] text-[#9D9D9D] text-[14px] md:text-[16px]  bg-transparent placeholder:text-[#9D9D9D] placeholder:text-[16px] md:placeholder:text-[14px] flex p-[25px 273px 20px 24px] h-[48px] md:h-[56px] items-center rounded-md border border-[#272942]"
                        }
                        placeholder="Enter Your Username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem
                    className={"mt-[14px] md:mt-[16px] flex flex-col items-start gap-[6px]"}
                  >
                    <FormLabel
                      className={
                        "text-[#FFF0EE] font-poppins text-sm md:text-[16px] font-semibold  "
                      }
                    >
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={"password"}
                        className={
                          "focus:shadow-login focus:border-[#272942] placeholder:font-[500] font-[500] text-[#9D9D9D] text-[14px] md:text-[16px]  bg-transparent placeholder:text-[#9D9D9D] placeholder:text-[16px] md:placeholder:text-[14px] flex p-[25px 273px 20px 24px] h-[48px] md:h-[56px] items-center rounded-md border border-[#272942]"
                        }
                        placeholder="Enter Your Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </div>
          </div>
          <div>
            <Button
                disabled={isHandleSignupPending}
              variant={"brand"}
              className={"w-[120px] md:w-[154px] h-[48px] md:h-[56px] text-center "}
            >
              {isHandleSignupPending ? <DefaultLoader /> : "Sign In"}
            </Button>
          </div>
          <div>
            <Separator
              className={"mt-2 w-72 lg:w-[466px] h-[1px] bg-[#272942]"}
            />
          </div>
          <div>
            <p
              className={
                "text-[#9D9D9D]  font-poppins text-[14px] font-semibold text-center"
              }
            >
              Or
            </p>
          </div>
          {/*<div className={"pb-[2px]"}>*/}
          {/*  <Button*/}
          {/*    type={"button"}*/}
          {/*    onClick={() => {*/}
          {/*      signIn("google");*/}
          {/*    }}*/}
          {/*    variant={"google"}*/}
          {/*    className={"lg:w-[262px] h-[48px] md:h-[55px] text-center gap-[16px] "}*/}
          {/*  >*/}
          {/*    <Image*/}
          {/*      src={"/icons/google.svg"}*/}
          {/*      alt={"google"}*/}
          {/*      width={20}*/}
          {/*      height={20}*/}
          {/*    />*/}
          {/*    <p>Sign In With Google</p>*/}
          {/*  </Button>*/}
          {/*</div>*/}
          <Link
              href={"/signup"}
              className={
                "pb-[31px] text-[#9D9D9D] underline font-poppins text-[14px] font-semibold text-end"
              }
          >
            Dont have an account? Signup
          </Link>
        </form>
      </Form>
    </div>
  );
};
export default LoginForm;
