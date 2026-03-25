import { useParams, useNavigate } from 'react-router-dom'
import useAccount from '../../../hooks/useAccount'
import styles from './AccountDetailPage.module.css'
import useAccountStatusChange from '../../../hooks/accounts/useAccountStatusChange'
import ConfirmModal from '../../../components/common/ConfirmModal'
import { useState } from 'react'
import Modal from '../../../components/common/Modal'
import RadioGroup from '../../../components/common/RadioGroup'
import type { AccountType } from '../../../types/accountType'
import useAccountTypeChange from '../../../hooks/accounts/useAccountTypeChange'
import {
    getAllStatus,
    getAllAccountType,
    getStatusLabel,
    getAccountTypeLabel,
    getAccountCategoryLabel,
    type StatusType,
} from '../../../constants/accountOptions'


const AccountDetailPage = () => {
    const { accountId } = useParams()
    const navigate = useNavigate()
    const { account, loading, error, fetchAccount } = useAccount(accountId!)
    const { changeStatus, loading: accountStatusLoading, error: accountStatusError } = useAccountStatusChange()
    const { changeAccountType, loading: accountTypeLoading, error: accountTypeError } = useAccountTypeChange()

    // Modal state
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
    const [pendingStatus, setPendingStatus] = useState<string | null>(null)

    // Modal Select Account Type
    const [isAccountTypeModalOpen, setisAccountTypeModalOpen] = useState(false)
    const [selectedAccountType, setSelectedAccountType] = useState<AccountType | undefined>(account?.accountType)

    // Options and Mapping functions are now imported from accountOptions.ts

    // Helper Function ---------------------------------------------------------
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

    // Loading and Error Component
    const loadingComponent = () => {
        return (
        <div className={styles.pageContainer}>
            <div className={styles.loadingWrapper}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>กำลังโหลดข้อมูลบัญชี...</p>
            </div>
        </div>
        )
    }

    const errorAccountNotFound = () => {
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

    if (loading || accountStatusLoading || accountTypeLoading) {
        return loadingComponent();
    }

    if (error || !account || accountStatusError || accountTypeError) {
        return errorAccountNotFound();
    }

    
    // Handle onChange ---------------------------------------------------------

    const requestStatusChange = (status: string) => {
        setPendingStatus(status)
        setIsConfirmModalOpen(true)
    }

    const handleConfirmStatusChange = async (): Promise<void> => {
        if(!accountId || !pendingStatus) return
        
        setIsConfirmModalOpen(false)
        await changeStatus(accountId, pendingStatus)
        await fetchAccount(accountId)
        setPendingStatus(null)
    }

    const handleCancelStatusChange = () => {
        setIsConfirmModalOpen(false)
        setPendingStatus(null)
    }

    const openChangeAccountTypeModal = () => {
        setisAccountTypeModalOpen(true)
    }

    const handleConfirmAccountTypeChange = async () => {
        setisAccountTypeModalOpen(false)
        if(!selectedAccountType) return

        await changeAccountType(accountId!, selectedAccountType)
        await fetchAccount(accountId!)
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
                <select 
                    value={pendingStatus ?? account.status} 
                    onChange={(e) => requestStatusChange(e.target.value)} 
                    className={`${styles.statusBadge} ${styles[`status_${pendingStatus ?? account.status}`]}`}
                    title="เปลี่ยนสถานะบัญชี"
                >
                    {
                        getAllStatus().map((status: StatusType) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))
                    }
                </select>
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
                    <div className={styles.accountTypeWrapper}>
                        <span className={styles.infoValue}>{getAccountTypeLabel(account.accountType ?? '')}</span>
                        <button className={styles.editButton} onClick={() => openChangeAccountTypeModal()}>เปลี่ยนประเภทบัญชี</button>
                    </div>
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

            {/* Confirmation Modal */}
            <ConfirmModal 
                isOpen={isConfirmModalOpen}
                title="ยืนยันการเปลี่ยนสถานะ"
                message={
                    <>คุณต้องการเปลี่ยนสถานะบัญชีนี้เป็น <strong>{getStatusLabel(pendingStatus ?? '')}</strong> ใช่หรือไม่?</>
                }
                onConfirm={handleConfirmStatusChange}
                onCancel={handleCancelStatusChange}
            />
        
            {/*Change AccountType Modal*/}
            <Modal
                isOpen={isAccountTypeModalOpen}
                onClose={() => setisAccountTypeModalOpen(false)}
                title="Choose Account Type">
                    <RadioGroup
                        options={getAllAccountType()}
                        selected={selectedAccountType ?? account?.accountType ?? ''}
                        onChange={(val) => setSelectedAccountType(val as AccountType)}>
                    </RadioGroup>
                    
                    <button onClick={handleConfirmAccountTypeChange}>ยืนยัน</button>
                    <button onClick={() => setisAccountTypeModalOpen(false)}>ยกเลิก</button>
            </Modal>
        </div>

    )
}

export default AccountDetailPage