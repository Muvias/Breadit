import Link from "next/link";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

export default function SignIn() {
    return (
        <div className="container flex flex-col justify-center w-full mx-auto space-y-6 sm:w-[400px]">
            <div className="flex flex-col text-center space-y-2">
                <Icons.logo className="h-6 w-6 mx-auto" />

                <h1 className="text-2xl font-semibold tracking-tight">
                    Registrar
                </h1>
                <p className="text-sm max-w-xs mx-auto">
                    Ao continuar, você estará criando uma conta no Breadit e concordando com nosso Contrato de Usuário e nossa Política de Privacidade.
                </p>

                <UserAuthForm />

                <p className="px-8 text-center text-sm text-zinc-700 dark:text-zinc-500">
                    Já é um Breadittor?{' '}
                    <Link
                        href="/sign-in"
                        className="text-sm underline underline-offset-4 hover:text-zinc-800 dark:text-zinc-400"
                    >
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    )
}