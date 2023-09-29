'use client'

import { useRef } from "react"
import { Comment, CommentVote, User } from "@prisma/client"
import { formatTimeToNow } from "@/lib/utils"
import UserAvatar from "../UserAvatar"
import { CommentVotes } from "./CommentVotes"
import { Button } from "../ui/Button"
import { MessageSquare } from "lucide-react"

type ExtendedComment = Comment & {
    votes: CommentVote[]
    author: User
}

interface PostCommentProps {
    comment: ExtendedComment
    postId: string
    votesAmount: number
    currentVote: CommentVote | undefined
}

export function PostComment({ comment, postId, votesAmount, currentVote }: PostCommentProps) {
    const commentRef = useRef<HTMLDivElement>(null)

    return (
        <div
            ref={commentRef}
            className="flex flex-col"
        >
            <div className="flex items-center">
                <UserAvatar
                    user={{
                        name: comment.author.name || null,
                        image: comment.author.image || null
                    }}
                    className="h-6 w-6"
                />

                <div className="flex items-center gap-x-2 ml-2">
                    <p className="text-sm font-medium">
                        u/{comment.author.username}
                    </p>

                    <p className="max-h-40 truncate text-xs text-zinc-500">
                        {formatTimeToNow(new Date(comment.createdAt))}
                    </p>
                </div>
            </div>

            <p className="text-sm mt-2">
                {comment.text}
            </p>

            <div className="flex gap-2 items-center">
                <CommentVotes
                    commentId={comment.id}
                    initialVotesAmount={votesAmount}
                    initialVote={currentVote}
                />


                <Button
                    variant='ghost'
                    size='xs'
                    className="dark:text-white rounded-md"
                >
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    Responder
                </Button>
            </div>
        </div>
    )
}
