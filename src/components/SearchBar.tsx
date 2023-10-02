'use client'

import { useQuery } from "@tanstack/react-query";
import { Command, CommandInput, CommandEmpty, CommandList, CommandGroup, CommandItem } from "./ui/Command";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { usePathname, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface SearchBarProps { }

export function SearchBar({ }: SearchBarProps) {
    const [input, setInput] = useState<string>('')

    const router = useRouter()
    const pathname = usePathname()

    const commandRef = useRef<HTMLDivElement>(null)

    const {
        data: queryResults,
        refetch,
        isFetched,
        isFetching
    } = useQuery({
        queryFn: async () => {
            if (!input) return []

            const { data } = await axios.get(`/api/search?q=${input}`)

            return data as (Subreddit & { _count: Prisma.SubredditCountOutputType })[]
        },
        queryKey: ['search-query'],
        enabled: false,
    })

    const request = debounce(() => {
        refetch()
    }, 500)

    const debounceRequest = useCallback(async () => {
        request()
    }, [])

    useOnClickOutside(commandRef, () => {
        setInput('')
    })

    useEffect(() => {
        setInput('')
    }, [pathname])

    return (
        <Command
            ref={commandRef}
            className="relative max-w-lg rounded-lg border z-50 overflow-visible"
        >
            <CommandInput
                value={input}
                onValueChange={(text) => {
                    setInput(text)
                    debounceRequest()
                }}
                isLoading={isFetching}
                placeholder="Procurar comunidade..."
                className="outline-none border-none ring-0 focus:border-none focus:outline-none"
            />

            {input.length > 0 ? (
                <CommandList
                    className="absolute top-full inset-x-0 shadow rounded-b-md bg-card"
                >
                    {isFetched && <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>}
                    {(queryResults?.length ?? 0) > 0 ? (
                        <CommandGroup heading='Comunidades'>
                            {queryResults?.map((subreddit) => (
                                <CommandItem
                                    key={subreddit.id}
                                    onSelect={(e) => {
                                        router.push(`/r/${e}`)
                                        router.refresh()
                                    }}
                                    value={subreddit.name}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    <a
                                        href={`/r/${subreddit.name}`}
                                    >
                                        r/{subreddit.name}
                                    </a>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ) : null}
                </CommandList>
            ) : null}
        </Command>
    )
}
