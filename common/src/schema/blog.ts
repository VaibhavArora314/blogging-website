import zod from "zod";

export const createBlogSchema = zod.object({
    title: zod.string().min(5).max(200),
    content: zod.string().min(5).max(1000)
})

export type createBlogType = zod.infer<typeof createBlogSchema>

export const updateBlogSchema = zod.object({
    title: zod.string().max(200).optional(),
    content: zod.string().max(1000).optional()
})

export type updateBlogType = zod.infer<typeof updateBlogSchema>
