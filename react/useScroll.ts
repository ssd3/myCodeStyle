import { useEffect } from 'react'

/**
 * useScroll props interface
 */
interface UseScrollProps {
    elementId: string
    handleScroll: any
}

/**
 * useScroll hook
 * @param props
 */
export default (props: UseScrollProps) => {
    useEffect(() => {
        const element: HTMLElement | null = document.getElementById(props.elementId)
        if (element !== null) {
            element.addEventListener('scroll', props.handleScroll)
        }

        return () => {
            if (element !== null) {
                element.removeEventListener('scroll', props.handleScroll)
            }
        }
    }, [props.handleScroll])
}
