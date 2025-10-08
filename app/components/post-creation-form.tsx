"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { PostFormSchema } from "@/lib/schemas"
import { createPost } from "@/lib/actions"

export default function PostCreationForm() {
  const form = useForm({
    resolver: zodResolver(PostFormSchema),
    defaultValues: { published: true },
  })

  function onSubmit(data: z.infer<typeof PostFormSchema>) {
    createPost(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="title"
          defaultValue=""
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Textarea placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          defaultValue=""
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Content" className="min-h-72" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3 justify-end">
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="p-3 gap-3 h-9 rounded-md outline hover:bg-card">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  Make public
                </FormLabel>
              </FormItem>
            )}
          />
          <FormItem>
            <FormControl>
              <Button type="submit">Create</Button>
            </FormControl>
          </FormItem>
        </div>
      </form>
    </Form>
  )
}
