import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CreateComment } from "./CreateComment"
import { PostComment } from "./PostComment"

interface CommentsSectionProps {
    postId: string
}

export async function CommentsSection({ postId }: CommentsSectionProps) {
    const session = await getAuthSession()

    const comments = await db.comment.findMany({
        where: {
            postId,
            replyToId: null,
        },
        include: {
            author: true,
            votes: true,
            replies: {
                include: {
                    author: true,
                    votes: true,
                }
            }
        }
    })

    return (
        <div className="flex flex-col gap-4 mt-4">
            <hr className="w-full h-px my-6" />

            <CreateComment postId={postId} />

            <div className="flex flex-col gap-y-6 mt-4">
                {comments
                    .filter((comment) => !comment.replyToId)
                    .map((topLevelComment) => {
                        const topLevelCommentVotesAmount = topLevelComment.votes.reduce((acc, vote) => {
                            if (vote.type === 'UP') return acc + 1
                            if (vote.type === 'DOWN') return acc - 1

                            return acc
                        }, 0)

                        const topLevelCommentVote = topLevelComment.votes.find((vote) => vote.userId === session?.user.id)

                        return (
                            <div
                                key={topLevelComment.id}
                                className="flex flex-col px-2"
                            >
                                <div className="mb-2">
                                    <PostComment
                                        postId={postId}
                                        comment={topLevelComment}
                                        currentVote={topLevelCommentVote}
                                        votesAmount={topLevelCommentVotesAmount}
                                    />
                                </div>
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}
