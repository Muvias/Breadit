'use client'

import { useState } from "react";
import { Label } from "../ui/Label";
import { Textarea } from "../ui/Textarea";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
    postId: string
    replyToId?: string
}

export function CreateComment({ postId, replyToId }: CreateCommentProps) {
    const [input, setInput] = useState<string>('')

    const { loginToast } = useCustomToast()

    const router = useRouter()

    const { mutate: comment, isLoading } = useMutation({
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

            setInput('')
        }
    })

    return (
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

                <div className="flex justify-end mt-2">
                    <Button
                        isLoading={isLoading}
                        disabled={input.length === 0}
                        onClick={() => comment({ postId, text: input, replyToId })}
                    >
                        Enviar
                    </Button>
                </div>
            </div>
        </div>
    )
}
