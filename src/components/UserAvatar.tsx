import Image from "next/image"

import { User } from "next-auth"
import { Avatar, AvatarFallback } from "./ui/Avatar"

import { User as IconUser } from "lucide-react"
import { AvatarProps } from "@radix-ui/react-avatar"

interface UserAvatarProps extends AvatarProps {
    user: Pick<User, 'name' | 'image'>
}

export default function UserAvatar({ user, ...props }: UserAvatarProps) {
    return (
        <Avatar {...props}>
            {user.image ? (
                <div className="relative aspect-square h-full w-full">
                    <Image
                        src={user.image}
                        alt="Imagem de perfil"
                        referrerPolicy="no-referrer"
                        fill
                    />
                </div>
            ) : (
                <AvatarFallback>
                    <span className="sr-only">
                        {user?.name}
                    </span>
                    <IconUser />
                </AvatarFallback>
            )}
        </Avatar>
    )
}