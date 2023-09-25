'use client'

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"

import axios, { AxiosError } from "axios"
import { CreateSubredditPayload } from "@/lib/validators/subreddit"
import { toast } from "@/hooks/use-toast"
import { useCustomToast } from "@/hooks/use-custom-toast"

export default function Create() {
    const [input, setInput] = useState<string>('')
    const router = useRouter()

    const { loginToast } = useCustomToast()

    const { mutate: createCommunity, isLoading } = useMutation({
        mutationFn: async () => {
            const payload: CreateSubredditPayload = {
                name: input
            }

            const { data } = await axios.post('/api/subreddit', payload)

            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: 'Este Subreddit já existe.',
                        description: 'Por favor escolha outro nome para o seu Subreddit.',
                        variant: "destructive"
                    })
                }

                if (err.response?.status === 422) {
                    return toast({
                        title: 'Nome Subreddit inválido.',
                        description: 'Por favor escolha um nome entre 3 e 21 caracteres.',
                        variant: "destructive"
                    })
                }

                if (err.response?.status === 401) {
                    return loginToast()
                }
            }

            return toast({
                title: 'Ocorreu um erro.',
                description: 'Não foi possível criar o Subreddit.',
                variant: "destructive"
            })
        },
        onSuccess: (data) => {
            router.push(`/r/${data}`)
        }
    })

    return (
        <div className="container flex items-center h-full max-w-3xl mx-auto">
            <div className="relative w-full h-fit p-4 rounded-lg space-y-6 bg-slate-50 dark:bg-gray-900">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-semibold">
                        Criar uma comunidade
                    </h1>
                </div>

                <hr className="h-px bg-zinc-500" />

                <div>
                    <p className="text-lg font-medium">
                        Nome
                    </p>
                    <p className="text-xs pb-2">
                        Os nomes das comunidades, incluindo letras maiúsculas, não podem ser alterados.
                    </p>

                    <div className="relative">
                        <p className="absolute grid place-items-center left-0 w-8 text-sm inset-y-0 text-zinc-400">
                            r/
                        </p>

                        <Input
                            className="pl-6"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button
                        variant='subtle'
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => createCommunity()}
                        isLoading={isLoading}
                        disabled={input.length === 0}
                    >
                        Criar comunidade
                    </Button>
                </div>
            </div>
        </div>
    )
}