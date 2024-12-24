import { arrow, autoUpdate, flip, FloatingArrow, offset, Placement, shift, useFloating, useHover, useInteractions, useRole } from "@floating-ui/react"
import { useRef, useState } from "react"
import { cn } from "../lib/utils"

interface Props {
    children: React.ReactNode
    text: React.ReactNode
    tooltipPosition?: Placement
    offsetNumber?: number
    tooltipClassName?: string
}

export function Tooltip({
    children,
    text,
    tooltipPosition = 'bottom',
    offsetNumber = 12,
    tooltipClassName = '',
}: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const arrowRef = useRef(null)

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [
            offset(offsetNumber),
            flip(),
            shift(),
            arrow({
                element: arrowRef
            })
        ],
        whileElementsMounted: autoUpdate,
        placement: tooltipPosition
    })

    const hover = useHover(context, { move: true })
    const role = useRole(context, {
        role: 'tooltip'
    })

    const { getReferenceProps, getFloatingProps } = useInteractions([hover, role])
    return (
        <>
            <div ref={refs.setReference} {...getReferenceProps()}>
                {children}
            </div>
            {isOpen && (
                <div
                    ref={refs.setFloating}
                    style={floatingStyles}
                    {...getFloatingProps()}
                    className={cn(
                        'px-2 z-10 font-bold py-2 text-[9px] uppercase  bg-[#121226] border rounded border-top-primary/20',
                        tooltipClassName
                    )}
                >
                    {text}
                    <FloatingArrow
                        ref={arrowRef}
                        context={context}
                        className={cn(
                            'fill-top-primary/20',
                            tooltipPosition === 'top' && 'mt-[1px]',
                            tooltipPosition === 'bottom' && 'mb-[1px]'
                        )}
                    />
                </div>
            )}
        </>
    )
}