"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { PostFormSchema } from "@/lib/schemas"
import { createPost, deletePost, updatePost } from "@/lib/actions"
import { useParams } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type PostFormType = z.infer<typeof PostFormSchema>

export default function PostForm({
  mode = "create",
  initialValues,
}: {
  mode?: "create" | "update"
  initialValues?: Partial<PostFormType>
}) {
  const form = useForm({
    resolver: zodResolver(PostFormSchema),
    defaultValues: initialValues as PostFormType,
  })

  const params = useParams()
  const postId = params.id as string

  function onSubmit(data: PostFormType) {
    if (mode === "create") createPost(data)
    else if (mode === "update") updatePost.bind(null, data, postId)()
  }

  function onDeletePost() {
    deletePost.bind(null, postId)()
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
          {mode === "update" && <DeleteButton onClick={onDeletePost} />}
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
          <Button type="submit">{mode === "create" ? "Create" : "Update"}</Button>
        </div>
      </form>
    </Form>
  )
}

function DeleteButton({ onClick }: { onClick: React.MouseEventHandler }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" type="button" className="me-auto">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can`t be undone. This will permamently delete this your post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
