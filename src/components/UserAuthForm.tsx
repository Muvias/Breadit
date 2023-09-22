'use client'

import { useState } from "react";
import { signIn } from "next-auth/react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/Button";

import { Icons } from "./Icons";

import { useToast } from "@/hooks/use-toast"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export default function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { toast } = useToast()

    const loginWithGoogle = async () => {
        setIsLoading(true)

        try {
            await signIn('google')
        } catch (error) {
            toast({
                title: "Houve um problema",
                description: "Ocorreu um erro ao fazer login com o Google",
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn('flex justify-center', className)} {...props}>
            <Button
                onClick={loginWithGoogle}
                size="sm"
                className="w-full"
                disabled={isLoading}
            >
                {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
                Google
            </Button>
        </div>
    )
}