import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) return new Response('Unauthorized', { status: 401 })

        const body = await req.json()
        const { subredditId } = SubredditSubscriptionValidator.parse(body)

        const subscriptionExists = await db.subscription.findFirst({
            where: {
                subredditId,
                userId: session.user.id
            }
        })

        if (!subscriptionExists) return new Response('Você não é inscrito nesta comunidade', { status: 400 })

        const subredditCreator = await db.subreddit.findFirst({
            where: {
                id: subredditId,
                creatorId: session.user.id
            }
        })

        if (subredditCreator) return new Response('Você não pode se desinscrever na comunidade que criou', { status: 400 })

        await db.subscription.delete({
            where: {
                userId_subredditId: {
                    subredditId,
                    userId: session.user.id
                }
            }
        })

        return new Response(subredditId)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Dados inválidos passados na requisição', { status: 422 })
        }

        return new Response('Não foi possível desinscrever-se na comunidade, por favor tente novamente mais tarde', { status: 500 })
    }

}