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
  console.log({ alice, bob })
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
