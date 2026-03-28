import { useEffect } from "react"
import styles from "./RequestDetailModal.module.css"
import type { RequestDTO } from "../../../../types/requestType"

// ─── Types ─────────────────────────────────────────────────
export interface RequestAccount {
    accountNumber?: string
    accountType?: string
    status?: string
    balance?: number
}



interface Props {
    request: RequestDTO
    onClose: () => void
    onApprove?: (req: RequestDTO) => void
    onReject?: (req: RequestDTO) => void
}

// ─── Helpers ───────────────────────────────────────────────
const TYPE_LABELS: Record<string, string> = {
    CHANGE_ACCOUNT_TYPE: "Change Account Type",
    CHANGE_ACCOUNT_STATUS: "Change Account Status",
    OPEN_ACCOUNT: "Open Account",
}

const TYPE_BADGE: Record<string, string> = {
    CHANGE_ACCOUNT_TYPE: styles.typeChangeAccountType,
    CHANGE_ACCOUNT_STATUS: styles.typeChangeAccountStatus,
    OPEN_ACCOUNT: styles.typeOpenAccount,
}

const STATUS_BADGE: Record<string, string> = {
    PENDING: styles.statusPending,
    APPROVED: styles.statusApproved,
    REJECTED: styles.statusRejected,
}

function formatDate(value?: string | null) {
    if (!value) return "-"
    const d = new Date(value)
    if (isNaN(d.getTime())) return value
    return d.toLocaleDateString("th-TH", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })
}

function formatBalance(value?: number) {
    if (value == null) return "-"
    return value.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// ─── Sub-components ─────────────────────────────────────────
function Field({
    label, value, mono = false, full = false,
}: {
    label: string; value: React.ReactNode; mono?: boolean; full?: boolean
}) {
    return (
        <div className={`${styles.field} ${full ? styles.gridFull : ""}`}>
            <span className={styles.fieldLabel}>{label}</span>
            <span className={mono ? styles.fieldValueMono : styles.fieldValue}>
                {value ?? "-"}
            </span>
        </div>
    )
}

function TypeBadge({ type }: { type: string }) {
    return (
        <span className={`${styles.badge} ${TYPE_BADGE[type] ?? styles.typeDefault}`}>
            {TYPE_LABELS[type] ?? type}
        </span>
    )
}

function StatusBadge({ status }: { status: string }) {
    const key = status?.toUpperCase()
    const label = status
        ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        : "-"
    return (
        <span className={`${styles.badge} ${STATUS_BADGE[key] ?? styles.statusDefault}`}>
            {label}
        </span>
    )
}

// ─── Main Modal ─────────────────────────────────────────────
export default function RequestDetailModal({ request, onClose, onApprove, onReject }: Props) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
        window.addEventListener("keydown", handler)
        return () => window.removeEventListener("keydown", handler)
    }, [onClose])

    const isPending = request.status?.toUpperCase() === "PENDING"

    return (
        <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Request Detail">

                {/* ── Header ── */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h2 className={styles.headerTitle}>Request Detail</h2>
                        <div className={styles.headerMeta}>
                            <TypeBadge type={request.requestType ?? ""} />
                            <StatusBadge status={request.status ?? ""} />
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* ── Body ── */}
                <div className={styles.body}>

                    {/* Account Info */}
                    <div className={styles.section}>
                        <p className={styles.sectionLabel}>Account Information</p>
                        <div className={styles.grid}>
                            <Field label="Account Number" value={request.account?.accountNumber} mono full />
                            <Field label="Account Type" value={request.account?.accountType} />
                            <Field label="Account Status" value={request.account?.status} />
                            {request.requestType === "OPEN_ACCOUNT" && (
                                <Field label="Balance" value={`฿ ${formatBalance(request.account?.balance)}`} mono />
                            )}
                        </div>
                    </div>

                    <hr className={styles.divider} />

                    {/* Request Detail — dynamic by type */}
                    <div className={styles.section}>
                        <p className={styles.sectionLabel}>Change Detail</p>

                        {request.requestType === "CHANGE_ACCOUNT_TYPE" && (
                            <div className={styles.changeRow}>
                                <Field label="From Type" value={request.account?.accountType} />
                                <span className={styles.arrow}>→</span>
                                <Field label="To Type" value={request.data} />
                            </div>
                        )}

                        {request.requestType === "CHANGE_ACCOUNT_STATUS" && (
                            <div className={styles.changeRow}>
                                <Field label="From Status" value={request.account?.status} />
                                <span className={styles.arrow}>→</span>
                                <Field label="To Status" value={request.data} />
                            </div>
                        )}

                        {request.requestType === "OPEN_ACCOUNT" && (
                            <div className={styles.grid}>
                                <Field label="Requested Type" value={request.account?.accountType} />
                                <Field label="Initial Balance" value={`฿ ${formatBalance(request.account?.balance)}`} mono />
                            </div>
                        )}

                        {!["CHANGE_ACCOUNT_TYPE", "CHANGE_ACCOUNT_STATUS", "OPEN_ACCOUNT"].includes(request.requestType ?? "") && (
                            <Field label="Data" value={request.data ?? "-"} full />
                        )}
                    </div>

                    <hr className={styles.divider} />

                    {/* Timestamps */}
                    <div className={styles.section}>
                        <p className={styles.sectionLabel}>Timeline</p>
                        <div className={styles.grid}>
                            <Field label="Created At" value={formatDate(request.createdAt)} mono />
                            <Field label="Approved At" value={formatDate(request.approvedAt)} mono />
                        </div>
                    </div>

                </div>

                {/* ── Footer ── */}
                <div className={styles.footer}>
                    <button className={styles.btnClose} onClick={onClose}>Close</button>
                    {isPending && onReject && (
                        <button className={styles.btnReject} onClick={() => onReject(request)}>
                            Reject
                        </button>
                    )}
                    {isPending && onApprove && (
                        <button className={styles.btnApprove} onClick={() => onApprove(request)}>
                            Approve
                        </button>
                    )}
                </div>

            </div>
        </div>
    )
}