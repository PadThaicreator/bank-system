import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAccount from '../../../hooks/useAccount'
import styles from './AccountDetailPage.module.css'

const AccountDetailPage = () => {
    const { accountId } = useParams()
    const navigate = useNavigate()
    const { account, loading, error } = useAccount(accountId!)

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 2,
        }).format(amount)
    }

    const formatDate = (dateString: string): string => {
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(dateString))
    }

    const getStatusLabel = (status: string): string => {
        const map: Record<string, string> = {
            ACTIVE: 'ใช้งานอยู่',
            INACTIVE: 'ไม่ได้ใช้งาน',
            FROZEN: 'ถูกระงับ',
            CLOSED: 'ปิดบัญชีแล้ว',
        }
        return map[status] ?? status
    }

    const getAccountTypeLabel = (type: string): string => {
        const map: Record<string, string> = {
            SAVINGS: 'ออมทรัพย์',
            CURRENT: 'กระแสรายวัน',
            FIXED_DEPOSIT: 'ฝากประจำ',
        }
        return map[type] ?? type
    }

    const getAccountCategoryLabel = (category: string): string => {
        const map: Record<string, string> = {
            SAVINGS: 'บัญชีออม',
            INVESTMENT: 'บัญชีลงทุน',
            LOAN: 'บัญชีสินเชื่อ',
        }
        return map[category] ?? category
    }

    if (loading) {
        return (
        <div className={styles.pageContainer}>
            <div className={styles.loadingWrapper}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>กำลังโหลดข้อมูลบัญชี...</p>
            </div>
        </div>
        )
    }

    if (error || !account) {
        return (
        <div className={styles.pageContainer}>
            <div className={styles.errorWrapper}>
            <span className={styles.errorIcon}>⚠️</span>
            <p className={styles.errorText}>{error ?? 'ไม่พบข้อมูลบัญชี'}</p>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
                ← กลับ
            </button>
            </div>
        </div>
        )
    }

    return (
        <div className={styles.pageContainer}>
        {/* Header */}
        <div className={styles.header}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
            ← กลับ
            </button>
            <h2 className={styles.pageTitle}>รายละเอียดบัญชี</h2>
        </div>

        {/* Balance Card */}
        <div className={styles.balanceCard}>
            <div className={styles.balanceLabel}>ยอดเงินคงเหลือ</div>
            <div className={styles.balanceAmount}>{formatCurrency(account.balance ?? 0)}</div>
            <div className={`${styles.statusBadge} ${styles[`status_${account.status}`]}`}>
            {getStatusLabel(account.status ?? '')}
            </div>
        </div>

        {/* Info Section */}
        <div className={styles.infoCard}>
            <h3 className={styles.sectionTitle}>ข้อมูลบัญชี</h3>
            <div className={styles.infoGrid}>
            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>เลขบัญชี</span>
                <span className={styles.infoValue}>{account.accountNumber}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>ประเภทบัญชี</span>
                <span className={styles.infoValue}>{getAccountTypeLabel(account.accountType ?? '')}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>หมวดหมู่บัญชี</span>
                <span className={styles.infoValue}>{getAccountCategoryLabel(account.accountCategory ?? '')}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>วันที่เปิดบัญชี</span>
                <span className={styles.infoValue}>{account.createdAt == undefined ? '' : formatDate(account.createdAt)}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>อัปเดตล่าสุด</span>
                <span className={styles.infoValue}>{account.updatedAt == undefined ? '' : formatDate(account.updatedAt)}</span>
            </div>
            <div className={styles.infoRow}>
                <span className={styles.infoLabel}>รหัสบัญชี</span>
                <span className={`${styles.infoValue} ${styles.uuidText}`}>{account.id}</span>
            </div>
            </div>
        </div>
        </div>
    )
}

export default AccountDetailPage