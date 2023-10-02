'use client'

import { useCustomToast } from "@/hooks/use-custom-toast"
import { usePrevious } from "@mantine/hooks"
import { VoteType } from "@prisma/client"
import { useEffect, useState } from "react"
import { Button } from "../ui/Button"
import { ArrowBigDown, ArrowBigUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { PostVoteRequest } from "@/lib/validators/vote"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"

interface PostVoteClientProps {
    postId: string
    initialVotesAmount: number
    initialVote?: VoteType | null
}

export function PostVoteClient({ postId, initialVotesAmount, initialVote }: PostVoteClientProps) {
    const { loginToast } = useCustomToast()

    const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount)
    const [currentVote, setCurrentVote] = useState(initialVote)

    const prevVote = usePrevious(currentVote)

    useEffect(() => {
        setCurrentVote(initialVote)
    }, [initialVote])

    const { mutate: vote } = useMutation({
        mutationFn: async (voteType: VoteType) => {
            const payload: PostVoteRequest = {
                postId,
                voteType
            }

            await axios.patch(`/api/subreddit/post/vote`, payload)
        },
        onError: (err, VoteType) => {
            if (VoteType === 'UP') setVotesAmount((prev) => prev - 1)
            else setVotesAmount((prev) => prev + 1)

            setCurrentVote(prevVote)

            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'Algo deu errado',
                description: 'Não foi possível registrar seu voto, por favor tente novamente',
                variant: 'destructive'
            })
        },
        onMutate: (type: VoteType) => {
            if (currentVote === type) {
                setCurrentVote(undefined)
                
                if (type === 'UP') setVotesAmount((prev) => prev - 1)
                else if (type === 'DOWN') setVotesAmount((prev) => prev + 1)
            } else {
                setCurrentVote(type)

                if (type === 'UP') setVotesAmount((prev) => prev + (currentVote ? 2 : 1))
                else if (type === 'DOWN') setVotesAmount((prev) => prev - (currentVote ? 2 : 1))
            }
        }
    })

    return (
        <div className="flex flex-col sm:w-20 gap-2 sm:gap-0 pr-6 pb-4 sm:pb-0">
            <Button
                onClick={() => {
                    vote('UP')
                    console.log(votesAmount)
                }}
                size='sm'
                variant='ghost'
                aria-label="upvote"
            >
                <ArrowBigUp className={cn('h-5 w-5 text-zinc-700 dark:text-zinc-400', {
                    'text-emerald-500 dark:text-emerald-500 fill-emerald-500': currentVote === 'UP'
                })} />
            </Button>

            <p className="py-2 text-center text-sm font-medium text-zinc-900 dark:text-white">
                {votesAmount}
            </p>

            <Button
                onClick={() => {
                    vote('DOWN')
                    console.log(votesAmount)
                }}
                size='sm'
                variant='ghost'
                aria-label="downvote"
            >
                <ArrowBigDown className={cn('h-5 w-5 text-zinc-700 dark:text-zinc-400', {
                    'text-red-500 dark:text-red-500 fill-red-500': currentVote === 'DOWN'
                })} />
            </Button>
        </div>
    )
}
