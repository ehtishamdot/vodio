import * as sgMail from "@sendgrid/mail";
import { prisma } from "@/db/config";
import ServerError, { JWTPayload } from "@/lib/types";
import { decryptToken, errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const podcastSchema = z.object({
  articleContent: z.string(),
  articleTitle: z.string(),
  webName: z.string(),
  webUrl: z.string().url(),
  to: z.string(),
});

export async function GET(req: NextRequest) {
  try {
    const authorizationHeader = req.headers.get("Cookie");
    console.log(authorizationHeader);
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
    if (!dbToken) throw new ServerError("Invalid token provided", 409);
    const { id } = decryptToken(accessToken, process.env.JWT_REFRESH_SECRET!);

    const podcasts = await prisma.feature.findMany({
      where: {
        name: "BLOG",
        userId: id as string,
      },
      include: {
        podcasts: true,
      },
    });

    const allPodcasts = await prisma.feature.findMany({
      where: {
        name: "BLOG",
      },
      include: {
        podcasts: true,
      },
    });

    const allPodcastsFlatMapped = allPodcasts.flatMap((item) => item.podcasts);

    return NextResponse.json({
      yourVodios: podcasts,
      trendingVodio: allPodcastsFlatMapped,
    });
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
// export async function GET(req: NextRequest) {
//   try {
//     const authorizationHeader = req.headers.get("Cookie");
//     console.log(authorizationHeader);
//     const refreshTokenStartIndex =
//       authorizationHeader?.match(/refreshToken=([^;]*)/)?.[1];
//     if (!refreshTokenStartIndex) {
//       throw new ServerError("Unauthorized", 401);
//     }
//     const accessToken = refreshTokenStartIndex;
//     const dbToken = await prisma.token.findFirst({
//       where: {
//         token: accessToken,
//       },
//     });
//     if (!dbToken) throw new ServerError("Invalid token provided", 409);
//     const { id } = decryptToken(accessToken, process.env.JWT_REFRESH_SECRET!);
//     let result = await prisma.$transaction([
//       prisma.user.findFirst({
//         where: {
//           id,
//         },
//       }),
//       prisma.assistant.findFirst({
//         where: {
//           id,
//         },
//         include: {
//           user: true,
//         },
//       }),
//     ]);
//     let user = result[0] || result[1];
//     let userPatients;
//     let addedByUserId = user?.id;
//     if (user?.role === "ASSISTANT") {
//       addedByUserId = user?.user?.id;
//     } else {
//       addedByUserId = user?.id;
//     }
//     userPatients = await prisma.patient.findMany({
//       where: {
//         addedByUserId,
//       },
//     });
//     return NextResponse.json(userPatients);
//   } catch (err) {
//     console.error(err);
//     return errorHandler(err);
//   }
// }
