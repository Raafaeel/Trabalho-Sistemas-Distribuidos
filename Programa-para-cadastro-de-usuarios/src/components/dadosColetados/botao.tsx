interface BotaoProps {
    children: any
    cor: string
    className?: string
    onClick?: () => void
}

export default function Botao(props: BotaoProps) {
    return (
        <button onClick={props.onClick} className={`
            ${props.cor}
            text-white px-4 py-2 rounded-md
            ${props.className}
        `}>
            {props.children}
        </button>
    )
}