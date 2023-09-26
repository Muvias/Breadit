import { z } from "zod";

export const PostValidator = z.object({
    title: z
        .string()
        .min(3, { message: 'Título precisa ter mais de 3 caracteres.' })
        .max(128, { message: 'Título não pode ter mais de 128 caracteres.' }),
    subredditId: z.string(),
    content: z.any(),
})

export type PostCreationRequest = z.infer<typeof PostValidator>