import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const researches = [
  {
    id: 1,
    title:
      "Impact of Accounting Information System on Organization Performance of Co-operative of Nepal",
    journal:
      "Indian Journal of Applied Business and Economic Research, Vol. 5, No. 1, 2024, pp. 81-103",
    year: 2024,
    doi: "https://DOI:10.47509/IJABER.2024.v05i01.05",
    tags: ["Accounting", "AIS", "Co-operatives"],
  },
  {
    id: 2,
    title: "Women Entrepreneurs' Success in Gorkha Municipality, Gorkha",
    journal: "The Journal of DMC, Vol. 3, No. 3",
    year: 2022,
    tags: ["Entrepreneurship", "Women", "Management"],
  },
  {
    id: 3,
    title: "Value Added Tax (VAT) in Nepal: A Conceptual Review",
    journal: "The Journal of DMC, Vol. 1, No. 1",
    year: 2073,
    tags: ["Taxation", "VAT", "Nepal"],
  },
  {
    id: 4,
    title:
      "Accounting Information System on the Effectiveness of Financial Performance of Banking Industries: An Empirical Evidence from Gorkha District",
    journal: "M.Phil. Project Report",
    year: null, // convert empty string to null
    tags: ["Banking", "AIS", "Performance"],
  },
  {
    id: 5,
    title:
      "Accounting Information System and Organizational Performance of Co-operatives",
    journal: "M.Phil. Dissertation",
    year: null,
    tags: ["AIS", "Organizational Performance"],
  },
];

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Seeding research articles...");

  for (const research of researches) {
    await prisma.researchArticle.upsert({
      where: { id: research.id },
      update: research, // if exists, update it
      create: research, // if not exists, create it
    });
  }

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
