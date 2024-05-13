import { prisma } from "@/db/config";
import { errorHandler } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  featureId: z.string(),
  isPublic: z.boolean(),
});
export async function PUT(req: NextRequest) {
  try {
    const { featureId, isPublic } = bodySchema.parse(await req.json());
    const updatedFeature = await prisma.feature.update({
      where: {
        id: featureId,
      },
      data: {
        isPublic,
      },
    });

    if (!updatedFeature) {
      return NextResponse.json({ error: "feature not found" }, { status: 404 });
    }

    return NextResponse.json(updatedFeature);
  } catch (err) {
    console.error(err);
    return errorHandler(err);
  }
}
