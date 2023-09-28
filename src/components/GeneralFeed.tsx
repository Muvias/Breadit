import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config"
import { db } from "@/lib/db"
import { PostFeed } from "./PostFeed"

export async function GeneralFeed() {
    const posts = await db.post.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            subreddit: true,
            votes: true,
            author: true,
            comments: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULTS
    })

    return <PostFeed initialPosts={posts} />
}
