import { prisma } from "@/db/config";
import ServerError, { JWTPayload } from "@/lib/types";
import { decryptToken, errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  featureId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { featureId } = bodySchema.parse(await req.json());
    const authorizationHeader = req.headers.get("Cookie");
    const refreshTokenStartIndex =
      authorizationHeader?.match(/refreshToken=([^;]*)/)?.[1];

    if (!refreshTokenStartIndex) {
      throw new ServerError("Unauthorized", 401);
    }

    const accessToken = refreshTokenStartIndex;
    const dbToken = await prisma.token.findFirst({
      where: {
        token: accessToken,
      },
    });

    // Retrieve the feature associated with the provided featureId
    const feature = await prisma.feature.findUnique({
      where: {
        id: featureId,
      },
    });

    if (!feature) {
      throw new ServerError("Feature not found", 404);
    }

    await prisma.trending.upsert({
      where: { id: featureId },
      update: { clicks: { increment: 1 } },
      create: {
        date: new Date(),
        clicks: 1,
        feature: { connect: { id: featureId } },
      },
    });
    if (!dbToken) throw new ServerError("Invalid token provided", 409);
    const { id } = decryptToken(accessToken, process.env.JWT_REFRESH_SECRET!);

    // return NextResponse.json(createdPodcast);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const featureId = req.nextUrl.searchParams.get("featureId") as string;
    const blogs = await prisma.feature.findMany({
      where: {
        name: "BLOG",
      },
      include: {
        podcasts: true,
      },
    });
    const pdfs = await prisma.feature.findMany({
      where: {
        name: "PDF",
      },
      include: {
        podcasts: true,
      },
    });

    const blogsFlatMapped = blogs.flatMap((item) => item.podcasts);
    const pdfsFlatMapped = pdfs.flatMap((item) => item.podcasts);

    return NextResponse.json({ blogs: blogsFlatMapped, pdfs: pdfsFlatMapped });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
