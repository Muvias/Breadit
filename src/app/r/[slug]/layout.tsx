import { SubscribeLeaveToggle } from "@/components/SubscribeLeaveToggle"
import { buttonVariants } from "@/components/ui/Button"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function Layout({ children, params: { slug } }: { children: React.ReactNode, params: { slug: string } }) {
    const session = await getAuthSession()

    const subreddit = await db.subreddit.findFirst({
        where: {
            name: slug,
        },
        include: {
            posts: {
                include: {
                    author: true,
                    votes: true,
                },
            }
        }
    })

    const subscription = !session?.user ? undefined : await db.subscription.findFirst({
        where: {
            subreddit: {
                name: slug,
            },
            user: {
                id: session.user.id
            }
        }
    })

    const isSubscribed = !!subscription

    if (!subreddit) return notFound()

    const memberCount = await db.subscription.count({
        where: {
            subreddit: {
                name: slug,
            }
        }
    })

    return (
        <div className="sm:container max-w-7xl h-full mx-auto pt-12">
            <div>
                {/* Button */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                    <div className="flex flex-col col-span-2 space-y-6">
                        {children}
                    </div>

                    {/* sidebar */}

                    <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
                        <div className="px-6 py-4">
                            <p className="font-semibold py-3">
                                Sobre r/{subreddit.name}
                            </p>
                        </div>

                        <dl className="px-6 py-4 text-sm leading-6 divide-y divide-gray-100">
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500 dark:text-gray-400">
                                    Criado em
                                </dt>
                                <dd className="text-gray-700 dark:text-gray-400">
                                    <time dateTime={subreddit.createdAt.toDateString()}>
                                        {format(subreddit.createdAt, 'd MMMM, yyyy', { locale: ptBR })}
                                    </time>
                                </dd>
                            </div>

                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500 dark:text-gray-400">
                                    Membros
                                </dt>
                                <dd className="text-gray-900 dark:text-gray-300">
                                    {memberCount}
                                </dd>
                            </div>

                            {subreddit.creatorId === session?.user.id ? (
                                <div className="flex justify-between gap-x-4 py-3">
                                    <p className="text-gray-500">
                                        Você criou esta comunidade.
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <SubscribeLeaveToggle
                                        subredditId={subreddit.id}
                                        subredditName={subreddit.name}
                                        isSubscribed={isSubscribed}
                                    />
                                </div>
                            )}

                            <Link
                                href={`/r/${slug}/submit`}
                                className={buttonVariants({
                                    variant: 'outline',
                                    className: 'w-full mb-6'
                                })}
                            >
                                Criar Post
                            </Link>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}