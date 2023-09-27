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
}

export function EditorOutput({ content }: EditorOutputProps) {
    return (
        <Output
            data={content}
            style={style}
            className="text-sm"
            renderers={renderers}
        />
    )
}

function CustomImageRenderer({ data }: any) {
    const src = data.file.url

    return (
        <div className="relative w-full min-h-[15rem]">
            <Image src={src} alt="image" className="object-contain" fill />
        </div>
    )
}

function CustomCodeRenderer({ data }: any) {
    return (
        <pre className="p-4 rounded-md bg-gray-800">
            <code className="text-sm text-gray-100">
                {data.code}
            </code>
        </pre>
    )
}
