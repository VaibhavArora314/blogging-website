import zod from "zod";

export const signUpSchema = zod.object({
    email: zod.string().email().max(100),
    password: zod.string().min(8).max(50),
    username: zod.string().min(3).max(100)
})

export type signUpType = zod.infer<typeof signUpSchema>;

export const signInSchema = zod.object({
    email: zod.string().email().max(100),
    password: zod.string().min(8).max(50),
})

export type signInType = zod.infer<typeof signInSchema>;