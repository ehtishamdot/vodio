import * as sgMail from "@sendgrid/mail";
import { prisma } from "@/db/config";
import ServerError, { JWTPayload } from "@/lib/types";
import { decryptToken, errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

interface VodioInfo {
  length: string;
  hosts: string[];
}

interface MiscellaneousInfo {
  summary: string;
  article: any;
  Vodio: VodioInfo;
}

interface PodcastInterface {
  opening_sentence: string;
  conversation: any;
  miscellaneous: MiscellaneousInfo;
  audio_file: string;
}

interface MailDataWithOptionalContentAndTemplate
  extends Omit<sgMail.MailDataRequired, "content"> {
  templateId?: string;
  dynamicTemplateData?: {
    uri: string;
  };
}

const podcastSchema = z.object({
  content: z.string(),
  to: z.string(),
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
export async function POST(req: NextRequest) {
  try {
    const { to, content } = podcastSchema.parse(await req.json());
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

    if (!dbToken) throw new ServerError("Invalid token provided", 409);
    const { id } = decryptToken(accessToken, process.env.JWT_REFRESH_SECRET!);
    const existingFeature = await prisma.feature.findUnique({
      where: {
        name: "PDF",
        userId: id,
      },
    });
    let featureId;
    if (existingFeature) {
      featureId = existingFeature.id;
    } else {
      const newFeature = await prisma.feature.create({
        data: {
          name: "PDF",
          userId: id,
        },
      });
      featureId = newFeature.id;
    }

    let body = { content };
    const apiUrl = `${process.env.NEXT_PUBLIC_AI_URL}/api/bot/pdf`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const podcastData = await response.json();
      console.log(podcastData);

      const createdPodcast = await prisma.podcast.create({
        data: {
          openingSentence: podcastData?.opening_sentence,
          audioFile: podcastData?.audio_file,
          conversation: podcastData?.conversation,
          summary: podcastData?.miscellaneous?.summary,
          article: podcastData?.miscellaneous?.article,
          length: podcastData?.miscellaneous?.Vodio?.length,
          hosts: podcastData?.miscellaneous?.Vodio?.hosts,
          feature: {
            connect: {
              id: featureId,
            },
          },
        },
      });
      const uri = `${process.env.NEXT_PUBLIC_API_URL}blog-vodio/${createdPodcast.id}`;
      const msg: MailDataWithOptionalContentAndTemplate = {
        to,
        from: "contact@seedinov.com",
        subject: `PDF is Compiled into Vodio`,
        templateId: process.env.SENDGRID_VODIO_TEMPLATE_ID,
        dynamicTemplateData: {
          uri,
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
      return NextResponse.json(createdPodcast);
    }
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const podcastId = req.nextUrl.searchParams.get("podcastId") as string;
    const podcast = await prisma.podcast.findUnique({
      where: {
        id: podcastId as string,
      },
      include: {
        feature: true,
      },
    });

    if (!podcast) {
      return NextResponse.json({ error: "Podcast not found" }, { status: 404 });
    }

    return NextResponse.json(podcast);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
