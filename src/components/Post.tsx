import { formatTimeToNow } from "@/lib/utils"
import { Post, User, Vote } from "@prisma/client"
import { MessageSquare } from "lucide-react"
import { useRef } from "react"
import { EditorOutput } from "./EditorOutput"

interface PostProps {
    subredditName: string
    post: Post & {
        author: User,
        votes: Vote[]
    }
    commentAmount: number
}

export function Post({ subredditName, post, commentAmount }: PostProps) {
    const postRef = useRef<HTMLDivElement>(null)

    return (
        <div className="rounded-md shadow dark:border dark:shadow-white/30 bg-card">
            <div className="flex justify-between px-6 py-4">
                {/* PostVotes */}

                <div className="flex-1 w-0">
                    <div className="max-h-40 mt-1 text-xs text-gray-500">
                        {subredditName ? (
                            <>
                                <a
                                    href={`/r/${subredditName}`}
                                    className="underline text-sm underline-offset-2 text-zinc-900 dark:text-white"
                                >
                                    r/{subredditName}
                                </a>

                                <span className="px-1">•</span>
                            </>
                        ) : null}

                        <span className="px-1">Postado por u/{post.author.name}</span>{' '}
                        {formatTimeToNow(new Date(post.createdAt))}
                    </div>

                    <a
                        href={`/r/${subredditName}/post/${post.id}`}
                    >
                        <h1 className="py-2 text-lg font-semibold leading-6">
                            {post.title}
                        </h1>
                    </a>

                    <div
                        className="relative max-h-40 w-full text-sm overflow-clip"
                        ref={postRef}
                    >
                        <EditorOutput content={post.content} />

                        {postRef.current?.clientHeight === 160 ? (
                            <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent" />
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="z-20 p-4 sm:px-6 text-sm bg-gray-50 dark:bg-[#030A1F]">
                <a
                    href={`/r/${subredditName}/post/${post.id}`}
                    className="w-fit flex items-center gap-2 dark:font-semibold"
                >
                    <MessageSquare
                        className="h-4 w-4"
                    />

                    {commentAmount} comentários
                </a>
            </div>
        </div>
    )
}