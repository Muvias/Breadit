import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          {/* feed */}

          <div className="overflow-hidden h-fit rounded-lg border order-first md:order-last border-gray-200">
            <div className="px-6 py-4 bg-emerald-100">
              <p className="flex items-center py-3 gap-1.5 font-semibold text-zinc-900">
                <HomeIcon />
                Início
              </p>
            </div>

            <div className="px-6 py-4 -my-3 text-sm leading-6 divide-y divide-gray-100">
              <div className="flex justify-between gap-x-4 py-3">
                <p className="text-zinc-500">
                  Sua prórpia página inicial Breadit. Venha aqui para verificar suas conunidades favoritas.
                </p>
              </div>

              <Link
                href="/r/create"
                className={buttonVariants({
                  className: 'w-full mt-4 mb-6'
                })}
              >
                Criar comunidade
              </Link>
            </div>
          </div>
        </div>
      </h1>
    </>
  )
}
