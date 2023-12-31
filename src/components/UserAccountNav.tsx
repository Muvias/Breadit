'use client'

import Link from "next/link"

import { User } from "next-auth"
import { signOut } from "next-auth/react"
import UserAvatar from "./UserAvatar"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/DropdownMenu"
import { ToggleThemeButton } from "./ToggleThemeButton"

interface UserAccountNavProps {
    user: Pick<User, 'name' | 'image' | 'email'>
}

export default function UserAccountNav({ user }: UserAccountNavProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar
                    user={user}
                    className="h-8 w-8"
                />
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
            >
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium">{user.name}</p>}
                        {user.email && <p className="w-[200px] truncate text-sm text-primary/70">{user.email}</p>}
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href='/'>
                        Feed
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href='/r/create'>
                        Criar comunidade
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href='/settings'>
                        Configurações
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <ToggleThemeButton />
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onSelect={(e) => {
                        e.preventDefault()
                        signOut({
                            callbackUrl: `${window.location.origin}/sign-in`
                        })
                    }}
                    className="cursor-pointer"
                >
                    Sair
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}