'use client'

import { useMutation } from "@tanstack/react-query"
import { Button } from "./ui/Button"
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit"
import axios, { AxiosError } from "axios"
import { useCustomToast } from "@/hooks/use-custom-toast"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { startTransition } from "react"

interface SubscribeLeaveToggleProps {
    subredditId: string
    subredditName: string
    isSubscribed: boolean
}

export function SubscribeLeaveToggle({ subredditId, subredditName, isSubscribed }: SubscribeLeaveToggleProps) {
    const { loginToast } = useCustomToast()
    const router = useRouter()

    const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId,
            }

            const { data } = await axios.post('/api/subreddit/subscribe', payload)

            return data as string
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
            startTransition(() => {
                return router.refresh()
            })

            return toast({
                title: 'Inscrito',
                description: `Você agora está inscrito em r/${subredditName}`
            })
        }
    })

    const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId,
            }

            const { data } = await axios.post('/api/subreddit/unsubscribe', payload)

            return data as string
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
            startTransition(() => {
                return router.refresh()
            })

            return toast({
                title: 'Inscrição desfeita',
                description: `Você não está mais inscrito em r/${subredditName}`
            })
        }
    })

    return isSubscribed ? (
        <Button
            onClick={() => unsubscribe()}
            isLoading={isUnsubLoading}
            className="w-full mt-2 mb-4"
        >
            Sair da comunidade
        </Button>
    ) : (
        <Button
            onClick={() => subscribe()}
            isLoading={isSubLoading}
            className="w-full mt-2 mb-4"
        >
            Inscreva-se para postar
        </Button>
    )
}