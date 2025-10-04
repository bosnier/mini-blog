import { PrismaClient } from "../generated/prisma/index.js"
import { sentence, article } from "txtgen"

const prisma = new PrismaClient()
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "Alice",
      posts: {
        create: [
          { title: sentence(), content: article(10) },
          { title: sentence(), content: article(20) },
          { title: sentence(), content: article(15), published: false },
          { title: sentence(), content: article(1), published: false },
          { title: sentence(), content: article(2), published: false },
          { title: sentence(), content: article(3), createdAt: new Date(2025, 7, 18) },
          { title: sentence(), content: article(2), createdAt: new Date(2024, 5, 5) },
          { title: sentence(), content: article(4), createdAt: new Date(2024, 6, 7) },
          { title: sentence(), content: article(5), createdAt: new Date(2023, 4, 10) },
        ],
      },
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      name: "Bob",
      posts: {
        create: [
          { title: sentence(), content: article(20) },
          { title: sentence(), content: article(1) },
          { title: sentence(), content: article(5) },
          { title: sentence(), content: article(5) },
          { title: sentence(), content: article(5) },
        ],
      },
    },
  })
  const eve = await prisma.user.upsert({
    where: { email: "eve@prisma.io" },
    update: {},
    create: {
      email: "eve@prisma.io",
      name: "Eve",
      posts: {
        create: [
          { title: sentence(), content: article(20) },
          { title: sentence(), content: article(1), createdAt: new Date(2024, 2, 9) },
          { title: sentence(), content: article(3), createdAt: new Date(2025, 5, 18) },
          { title: sentence(), content: article(2), createdAt: new Date(2024, 3, 5) },
          { title: sentence(), content: article(4), createdAt: new Date(2024, 4, 7) },
          { title: sentence(), content: article(5), createdAt: new Date(2023, 0, 10) },
          { title: sentence(), content: article(2) },
          { title: sentence(), content: article(5) },
          { title: sentence(), content: article(5) },
          { title: sentence(), content: article(5) },
        ],
      },
    },
  })
  console.log({ alice, bob, eve })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
