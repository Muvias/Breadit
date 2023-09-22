import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";

export default async function Navbar() {
    const session = await getAuthSession()

    return (
        <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 dark:bg-background border-b z-10 py-2">
            <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
                {/* logo */}
                <Link href='/' className="flex items-center gap-2">
                    <Icons.logo className="h-8 w-8 sm:h-6 sm:w-6" />
                    <p className="hidden text-sm font-medium text-zinc-700 dark:text-white md:block">
                        Breadit
                    </p>
                </Link>

                {/* Searchbar */}

                {session?.user ? (
                    <UserAccountNav
                        user={session.user}
                    />
                ) : (
                    <Link href='/sign-in' className={buttonVariants()}>
                        Entrar
                    </Link>
                )}
            </div>
        </div>
    )
}