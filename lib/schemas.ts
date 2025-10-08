import z from "zod"

export const PostFormSchema = z.object({
  title: z
    .string()
    .min(10, { error: "Title must be at least 10 characters long" })
    .max(200, { error: "Title must not be longer than 200 characters" }),
  content: z
    .string()
    .min(200, { error: "Content must be at least 200 characters long" })
    .max(20000, { error: "Content must not be longer than 20000 characters" }),
  published: z.boolean(),
})
