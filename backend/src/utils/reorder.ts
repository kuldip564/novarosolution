import { prisma } from "../lib/prisma.js";

type OrderModel =
  | "project"
  | "service"
  | "testimonial"
  | "teamMember"
  | "clientLogo"
  | "faq";

type ReorderDelegate = {
  update: (args: { where: { id: string }; data: { order: number } }) => Promise<unknown>;
};

export async function applyReorder(
  delegate: ReorderDelegate,
  ids: string[],
): Promise<void> {
  await Promise.all(
    ids.map((id, index) =>
      delegate.update({
        where: { id },
        data: { order: index },
      }),
    ),
  );
}

export async function nextOrder(model: OrderModel): Promise<number> {
  switch (model) {
    case "project": {
      const latest = await prisma.project.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      return (latest?.order ?? -1) + 1;
    }
    case "service": {
      const latest = await prisma.service.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      return (latest?.order ?? -1) + 1;
    }
    case "testimonial": {
      const latest = await prisma.testimonial.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      return (latest?.order ?? -1) + 1;
    }
    case "teamMember": {
      const latest = await prisma.teamMember.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      return (latest?.order ?? -1) + 1;
    }
    case "clientLogo": {
      const latest = await prisma.clientLogo.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      return (latest?.order ?? -1) + 1;
    }
    case "faq": {
      const latest = await prisma.faq.findFirst({
        orderBy: { order: "desc" },
        select: { order: true },
      });
      return (latest?.order ?? -1) + 1;
    }
    default:
      return 0;
  }
}
