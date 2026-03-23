import React, { useEffect, type ReactNode } from 'react'
import styles from './Modal.module.css'

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
}) => {

    useEffect(() => {
        if(!isOpen) return

        const handleEsc = (e: KeyboardEvent) => {
            if(e.key === "Escape") onClose();
        }

        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    } , [isOpen, onClose])

    if(!isOpen) return null

    return (
        <div
            className={styles.modalOverlay}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className={styles.modalContent}
                onClick={(e)=>{e.stopPropagation()}}
            >
                <button className={styles.closeIcon} onClick={onClose} aria-label="Close">
                    &times;
                </button>
                {title && <h2 className={styles.modalTitle}>{title}</h2>}

                <div className={styles.modalBody}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal