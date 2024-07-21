import zod from "zod";
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "./const";

export const createBlogSchema = zod.object({
    title: zod.string().min(5).max(200),
    content: zod.string().min(5).max(5000),
    image: zod
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, "File Size must be less than 1MB")
    .refine((file) => {
      return !file || ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be a PNG or JPEG or JPG"),
})

export type createBlogType = zod.infer<typeof createBlogSchema>

export const updateBlogSchema = zod.object({
    title: zod.string().min(5).max(200).optional(),
    content: zod.string().min(5).max(5000).optional(),
})

export type updateBlogType = zod.infer<typeof updateBlogSchema>
