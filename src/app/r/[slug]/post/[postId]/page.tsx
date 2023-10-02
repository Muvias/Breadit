import { CommentsSection } from "@/components/comments/CommentsSection"
import { EditorOutput } from "@/components/EditorOutput"
import { PostVoteServer } from "@/components/post-vote/PostVoteServer"
import { buttonVariants } from "@/components/ui/Button"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { formatTimeToNow } from "@/lib/utils"
import { CachedPost } from "@/types/redis"
import { Post, User, Vote } from "@prisma/client"
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react"
import { notFound } from "next/navigation"
import { Suspense } from "react"

interface PageProps {
    params: {
        postId: string
    }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function page({ params }: PageProps) {
    const cachedPost = await redis.hgetall(`post:${params.postId}`) as CachedPost

    let post: (Post & { votes: Vote[]; author: User }) | null = null

    if (!cachedPost) {
        post = await db.post.findFirst({
            where: {
                id: params.postId
            },
            include: {
                votes: true,
                author: true,
            }
        })
    }

    if (!post && !cachedPost) return notFound()

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between h-full">
                <Suspense fallback={<PostVoteShell />}>
                    <PostVoteServer
                        postId={post?.id ?? cachedPost.id}
                        getData={async () => {
                            return await db.post.findUnique({
                                where: {
                                    id: params.postId
                                },
                                include: {
                                    votes: true
                                }
                            })
                        }}
                    />
                </Suspense>

                <div className="sm:w-0 w-full flex-1 p-4 shadow rounded-sm bg-card dark:border dark:border-white/30 dark:shadow-white/50">
                    <p className="max-h-40 mt-1 truncate text-sm text-gray-500">
                        Postado por u/{post?.author.username ?? cachedPost.authorUsername}{' '}

                        {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
                    </p>

                    <h1 className="text-xl font-semibold py-2 leading-6">
                        {post?.title ?? cachedPost.title}
                    </h1>

                    <EditorOutput content={post?.content ?? cachedPost.content} />

                    <Suspense fallback={<Loader2 className="animate-spin h-5 w-5 text-zinc-500 dark:text-zinc-400" />}>
                        <CommentsSection postId={post?.id ?? cachedPost.id} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}

function PostVoteShell() {
    return (
        <div className="flex flex-col items-center pr-6 w-20">
            <div className={buttonVariants({ variant: 'ghost' })}>
                <ArrowBigUp className="h-5 w-5 text-zinc-700" />
            </div>

            <div className="text-center py-2 font-medium text-sm text-zinc-900">
                <Loader2 className="animate-spin h-3 w-3" />
            </div>

            <div className={buttonVariants({ variant: 'ghost' })}>
                <ArrowBigDown className="h-5 w-5 text-zinc-700" />
            </div>
        </div>
    )
}
