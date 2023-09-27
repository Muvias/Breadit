'use client'

import { Session } from "next-auth"
import { usePathname, useRouter } from "next/navigation"
import UserAvatar from "./UserAvatar"
import { Input } from "./ui/Input"
import { Button } from "./ui/Button"
import { ImageIcon, Link2 } from "lucide-react"

interface MiniCreatePostProps {
    session: Session | null
}

export function MiniCreatePost({ session }: MiniCreatePostProps) {
    const router = useRouter()
    const pathname = usePathname()

    return (
        <li className="overflow-hidden list-none rounded-md shadow dark:border bg-card">
            <div className="flex justify-between h-full px-6 py-4 gap-6">
                <div className="relative">
                    <UserAvatar
                        user={{
                            name: session?.user.name || null,
                            image: session?.user.image || null,
                        }}
                    />

                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 outline outline-2 outline-white" />
                </div>

                <Input
                    readOnly
                    onClick={() => router.push(pathname + '/submit')}
                    placeholder="Criar post"
                    className="cursor-pointer"
                />

                <Button
                    onClick={() => router.push(pathname + '/submit')}
                    variant='ghost'
                >
                    <ImageIcon className="text-zinc-600 dark:text-white" />
                </Button>

                <Button
                    onClick={() => router.push(pathname + '/submit')}
                    variant='ghost'
                >
                    <Link2 className="text-zinc-600 dark:text-white" />
                </Button>
            </div>
        </li>
    )
}