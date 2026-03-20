import type { AccountResponse } from '../../../types'
import { useAllAccount } from "../../../hooks/useAllAccount"
import styles from './AccountListPage.module.css'

const AccountListPage = () => {
  const { accounts, loading, error, refetch } = useAllAccount()

  if (loading) return <div className={styles.loadingContainer}>Loading Data...</div>
  if (error) return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>Error: {error}</p>
      <button onClick={refetch} className={styles.retryButton}>
        ลองใหม่
      </button>
    </div>
  )

  return (
    <div className={styles.pageContainer}>
      {/* Title area */}
      <div className={styles.titleContainer}>
        <h2 className={styles.pageTitle}>บัญชีทั้งหมด</h2>
      </div>

      {/* Table area */}
      <div className={styles.tableContainer}>
        <table className={styles.accountTable}>
          <thead>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>เลขบัญชี</th>
              <th className={styles.tableHeaderCell}>ประเภท</th>
              <th className={styles.tableHeaderCell}>ยอดเงิน</th>
              <th className={styles.tableHeaderCell}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc: AccountResponse) => (
              <tr key={acc.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{acc.accountNumber}</td>
                <td className={styles.tableCell}>{acc.accountType}</td>
                <td className={`${styles.tableCell} ${styles.currencyCell}`}>
                  {(acc.balance ?? 0).toLocaleString()} ฿
                </td>
                <td className={styles.tableCell}>
                   <span className={`${styles.statusBadge} ${acc.status === 'ACTIVE' ? styles.statusActive : styles.statusInactive}`}>
                        {acc.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AccountListPage