import * as sgMail from "@sendgrid/mail";
import { prisma } from "@/db/config";
import ServerError, { JWTPayload } from "@/lib/types";
import { decryptToken, errorHandler, getOpenAIApiInstance } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
interface ConversationItem {
  host: string;
  dialogue: string;
  start_time: string;
  end_time: string;
}
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
  title: z.string(),
  content: z.string(),
  web_name: z.string(),
  web_url: z.string().url(),
  to: z.string(),
  img: z.string().default(""),
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
export async function POST(req: NextRequest) {
  try {
    const { to, title, content, web_name, web_url, img } = podcastSchema.parse(
      await req.json()
    );
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
        name: "BLOG",
        userId: id,
      },
    });
    let featureId;
    if (existingFeature) {
      featureId = existingFeature.id;
    } else {
      const newFeature = await prisma.feature.create({
        data: {
          name: "BLOG",
          userId: id,
        },
      });
      featureId = newFeature.id;
    }

    let body = { title, content, web_name, web_url };
    const apiUrl = `${process.env.NEXT_PUBLIC_AI_URL}/api/bot/article`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const podcastData = (await response.json()) as PodcastInterface;
    const createdPodcast = await prisma.podcast.create({
      data: {
        openingSentence: podcastData?.opening_sentence,
        audioFile: podcastData?.audio_file,
        conversation: podcastData?.conversation,
        summary: podcastData?.miscellaneous?.summary,
        article: podcastData?.miscellaneous?.article,
        length: podcastData?.miscellaneous?.Vodio?.length,
        hosts: podcastData?.miscellaneous?.Vodio?.hosts,
        img,
        feature: {
          connect: {
            id: featureId,
          },
        },
      },
    });
    console.log(to);
    const uri = `${process.env.NEXT_PUBLIC_API_URL}/api/blog-vodio/${createdPodcast.id}`;
    const msg: MailDataWithOptionalContentAndTemplate = {
      to,
      from: "contact@seedinov.com",
      subject: `Blog is Compiled into Vodio`,
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
