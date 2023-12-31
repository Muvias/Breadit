import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) return new Response('Unauthorized', { status: 401 })

        const body = await req.json()

        const { postId, text, replyToId } = CommentValidator.parse(body)

        await db.comment.create({
            data: {
                text,
                postId,
                authorId: session.user.id,
                replyToId
            }
        })

        return new Response('OK')
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Dados inválidos passados na requisição', { status: 422 })
        }

        return new Response('Não foi possível gerar o seu comentário, por favor tente novamente mais tarde', { status: 500 })
    }
}