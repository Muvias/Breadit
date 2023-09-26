import { Editor } from "@/components/Editor"
import { Button } from "@/components/ui/Button"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps {
    params: {
        slug: string
    }
}

export default async function page({ params }: PageProps) {
    const subreddit = await db.subreddit.findFirst({
        where: {
            name: params.slug,
        }
    })

    if (!subreddit) return notFound()

    return (
        <div className="flex flex-col items-start gap-6">
            <div className="border-b border-gray-200 pb-5">
                <div className="flex flex-wrap items-baseline -ml-2 -mt-2">
                    <h3 className="ml-2 mt-2 text-base leading-6 font-semibold">
                        Criar Post
                    </h3>

                    <p className="ml-2 mt-1 truncate text-sm text-gray-500">
                        em r/{params.slug}
                    </p>
                </div>
            </div>

            <Editor subredditId={subreddit.id} />

            <div className="w-full flex justify-end">
                <Button
                    type="submit"
                    className="w-full"
                    form="subreddit-post-form"
                >
                    Post
                </Button>
            </div>
        </div>
    )
}