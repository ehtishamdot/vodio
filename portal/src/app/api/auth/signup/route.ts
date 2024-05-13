import { prisma } from "@/db/config";
import { errorHandler } from "@/lib/utils";
import { NextRequest } from "next/server";
import { hashSync } from "bcrypt";
import { z } from "zod";
import { sign } from "jsonwebtoken";
import ServerError, { JWTPayload } from "@/lib/types";

const signupSchema = z
  .object({
    email: z.string().email(),
    username: z.string(),
    password: z.string(),
  })
  .strict();

export async function POST(req: NextRequest) {
  try {
    const { email, password, username } = signupSchema.parse(await req.json());
    let userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    let userWithUsername = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (userWithEmail || userWithUsername)
      throw new ServerError("User already exist", 409);
    let user = await prisma.user.create({
      data: {
        email,
        password: hashSync(password, 10),
        username,
      },
    });
    const payload: JWTPayload = { id: user.id };
    const accessToken = sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "50m",
    });
    const refreshToken = sign({ id: user.id }, process.env.JWT_REFRESH_SECRET!);
    await prisma.token.create({
      data: {
        token: refreshToken,
      },
    });
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Set-Cookie": `accessToken=${accessToken};Secure;HttpOnly;path=/,refreshToken=${refreshToken};Secure;HttpOnly;path=/`,
      },
    });
  } catch (err) {
    return errorHandler(err);
  }
}
