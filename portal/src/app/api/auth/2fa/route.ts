import * as sgMail from "@sendgrid/mail";
import { prisma } from "@/db/config";
import ServerError from "@/lib/types";
import { errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  input: z.string(),
});

export interface MailDataWithOptionalContentAndTemplate
  extends Omit<sgMail.MailDataRequired, "content"> {
  templateId?: string;
  dynamicTemplateData?: {
    token: string;
  };
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
export async function POST(req: NextRequest) {
  try {
    const { input } = loginSchema.parse(await req.json());
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: input }, { username: input }],
      },
    });
    if (!user) throw new ServerError("User does not exist or Forbidden", 409);
    const verificationToken = await prisma.verificationToken.create({
      data: {
        token: Math.floor(100000 + Math.random() * 900000).toString(),
        userId: user?.id,
      },
    });
    const msg: MailDataWithOptionalContentAndTemplate = {
      to: input,
      from: "contact@seedinov.com",
      templateId: process.env.SENDGRID_VODIO_VERIFICATION_TEMPLATE_ID,
      dynamicTemplateData: {
        token: verificationToken.token,
      },
    };
    await sgMail
      .send(msg as any)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        throw new Error(err);
      });
    return NextResponse.json({ status: 200 });
  } catch (err) {
    console.log(err);
    return errorHandler(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") as string;
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
      },
    });

    if (token && verificationToken?.token === token) {
      const user = await prisma.user.update({
        where: { id: verificationToken?.userId },
        data: { isVerified: true },
      });
      console.log(user);
      if (!user.isVerified) {
        throw new ServerError("Verification failed", 400);
      }
      return NextResponse.json({
        status: 200,
        message: "Verification successful!",
      });
    } else {
      throw new ServerError("Verification failed", 400);
    }
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
