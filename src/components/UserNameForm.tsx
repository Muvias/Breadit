'use client'

import { toast } from "@/hooks/use-toast"
import { UserNameRequest, UserNameValidator } from "@/lib/validators/userame"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "./ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/Card"
import { Input } from "./ui/Input"
import { Label } from "./ui/Label"

interface UserNameFormProps {
    user: Pick<User, 'id' | 'username'>
}

export function UserNameForm({ user }: UserNameFormProps) {
    const router = useRouter()

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<UserNameRequest>({
        resolver: zodResolver(UserNameValidator),
        defaultValues: {
            name: user?.username || ''
        }
    })

    const { mutate: updateUserName, isLoading } = useMutation({
        mutationFn: async ({ name }: UserNameRequest) => {
            const payload: UserNameRequest = { name }

            const { data } = await axios.patch(`/api/username`, payload)

            return data
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: 'Este nome de usuário já existe.',
                        description: 'Por favor escolha outro nome.',
                        variant: "destructive"
                    })
                }
            }

            return toast({
                title: 'Ocorreu um erro.',
                description: 'Não foi possível criar o Subreddit.',
                variant: "destructive"
            })
        },
        onSuccess: () => {
            toast({
                description: 'Seu nome de usuário foi atualizado.',
            })

            router.refresh()
        }
    })

    return (
        <form
            onSubmit={handleSubmit((e) => updateUserName(e))}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Seu nome de usuário</CardTitle>
                    <CardDescription>Por favor escolha um nome que te deixe confortável</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="relative grid gap-1">
                        <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
                            <span className="text-sm text-zinc-400">
                                u/
                            </span>
                        </div>

                        <Label
                            className="sr-only"
                            htmlFor="name"
                        >
                            Nome
                        </Label>

                        <Input
                            id="name"
                            size={32}
                            className="w-[400px] pl-6"
                            {...register('name')}
                        />

                        {errors?.name && (
                            <p className="px-1 text-xs text-red-600">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        isLoading={isLoading}
                    >
                        Mudar nome
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
