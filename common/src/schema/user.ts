import zod from "zod";
import { ACCEPTED_FILE_TYPES, MAX_UPLOAD_SIZE } from "./const";

export const signUpSchema = zod.object({
  email: zod.string().email().max(100),
  password: zod.string().min(8).max(50),
  username: zod.string().min(3).max(100),
  image: zod
    .instanceof(File)
    .optional()
    .refine((file) => {
      return !file || file.size <= MAX_UPLOAD_SIZE;
    }, `File Size must be less than ${MAX_UPLOAD_SIZE/(1024*1024)}MB`)
    .refine((file) => {
      return !file || ACCEPTED_FILE_TYPES.includes(file.type);
    }, "File must be a PNG or JPEG or JPG"),
});

export type signUpType = zod.infer<typeof signUpSchema>;

export const signInSchema = zod.object({
  email: zod.string().email().max(100),
  password: zod.string().min(8).max(50),
});

export type signInType = zod.infer<typeof signInSchema>;
