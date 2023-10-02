'use client'

import { useRef, useState } from "react"
import { Comment, CommentVote, User } from "@prisma/client"
import { formatTimeToNow } from "@/lib/utils"
import UserAvatar from "../UserAvatar"
import { CommentVotes } from "./CommentVotes"
import { Button } from "../ui/Button"
import { MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Label } from "../ui/Label"
import { Textarea } from "../ui/Textarea"
import { useMutation } from "@tanstack/react-query"
import { CommentRequest } from "@/lib/validators/comment"
import axios, { AxiosError } from "axios"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"

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
    const [isReplying, setIsReplying] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')

    const commentRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { data: session } = useSession()

    const { loginToast } = useCustomToast()

    const { mutate: postComment, isLoading } = useMutation({
        mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
            const payload: CommentRequest = {
                postId,
                text,
                replyToId
            }

            const { data } = await axios.patch(`/api/subreddit/post/comment`, payload)

            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'Houve um problema',
                description: 'Alguma coisa deu errado, por favor tente novamente',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            router.refresh()

            setIsReplying(false)
            setInput('')
        }
    })

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

            <div className="flex flex-wrap gap-2 items-center">
                <CommentVotes
                    commentId={comment.id}
                    initialVotesAmount={votesAmount}
                    initialVote={currentVote}
                />


                <Button
                    variant='ghost'
                    size='xs'
                    className="dark:text-white rounded-md"
                    onClick={() => {
                        if (!session) return router.push('/sign-in')
                        setIsReplying(!isReplying)
                    }}
                >
                    <MessageSquare className="w-4 h-4 mr-1.5" />
                    Responder
                </Button>

                {isReplying ? (
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="comment">Seu comentário</Label>
                        <div className="mt-2">
                            <Textarea
                                id="comment"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                rows={1}
                                placeholder="Postar sua resposta"
                                className="resize-none dark:ring-zinc-400"
                            />

                            <div className="flex justify-end mt-2 gap-2">
                                <Button
                                    tabIndex={-1}
                                    variant='subtle'
                                    onClick={() => setIsReplying(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    isLoading={isLoading}
                                    disabled={input.length === 0}
                                    onClick={() => {
                                        if (!input) return

                                        postComment({
                                            postId,
                                            text: input,
                                            replyToId: comment.replyToId ?? comment.id
                                        })
                                    }}
                                >
                                    Enviar
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
