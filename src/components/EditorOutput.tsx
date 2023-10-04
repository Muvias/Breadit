'use client'

import dynamic from "next/dynamic"
import Image from "next/image"

const Output = dynamic(async () => (await import('editorjs-react-renderer')).default, {
    ssr: false,
})

interface EditorOutputProps {
    content: any
}

const style = {
    paragraph: {
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
    }
}

const renderers = {
    image: CustomImageRenderer,
    code: CustomCodeRenderer,
    list: CustomListRenderer,
}

export function EditorOutput({ content }: EditorOutputProps) {
    return (
        <Output
            data={content}
            style={style}
            className="text-sm"
            renderers={renderers}
            id='OutputEditorJS'
        />
    )
}

function CustomImageRenderer({ data }: any) {
    const src = data.file.url

    return (
        <div className="relative w-full min-h-[20rem]">
            <Image src={src} alt="image" className="object-contain" fill />
        </div>
    )
}

function CustomCodeRenderer({ data }: any) {
    return (
        <pre className="p-4 rounded-md bg-gray-600 dark:bg-gray-800 overflow-auto">
            <code className="text-sm text-gray-100">
                {data.code}
            </code>
        </pre>
    )
}

function CustomListRenderer({ data }: any) {
    const items = data.items.map((item: string, index: number) => (
        <li key={index} className="">
            {item}
        </li>
    ));

    return (
        <ul className="list-disc ml-4 my-2">
            {items}
        </ul>
    );
}