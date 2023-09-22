import SignIn from "@/components/SignIn";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

import Link from "next/link";

export default function signIn() {
    return (
        <div className="absolute inset-0">
            <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto gap-20">
                <Link
                    href='/'
                    className={cn(buttonVariants({ variant: 'ghost' }), 'self-start -mt-20')}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Início
                </Link>

                <SignIn />
            </div>
        </div>
    )
}