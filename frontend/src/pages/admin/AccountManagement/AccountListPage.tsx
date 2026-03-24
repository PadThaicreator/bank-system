import type { AccountResponse } from '../../../types/accountType'
import { useAllAccount } from "../../../hooks/useAllAccount"
import styles from './AccountListPage.module.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const AdminAccountListPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  // get all account for admin and user account for customer
  const { accounts, loading, error, refetch, pageInfo } = useAllAccount(currentPage, pageSize)
  if (loading) return <div className={styles.loadingContainer}>Loading Data...</div>

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(p => p - 1);
  };

  const handleNextPage = () => {
    if (pageInfo && currentPage < pageInfo.totalPages - 1) setCurrentPage(p => p + 1);
  };

  if (error) return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>Error: {error}</p>
      <button onClick={() => refetch(currentPage, pageSize)} className={styles.retryButton}>
        ลองใหม่
      </button>
    </div>
  )

  const handleAccountRowClick = (accountId: string): void => {
    navigate(`/admin/accountDetail/${accountId}`)
  }

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
              <th className={styles.tableHeaderCell}>ชื่อเจ้าของบัญชี</th>
              <th className={styles.tableHeaderCell}>ประเภท</th>
              <th className={styles.tableHeaderCell}>ยอดเงิน</th>
              <th className={styles.tableHeaderCell}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {accounts?.map((acc: AccountResponse) => (
              <tr key={acc.id} className={styles.tableRow} onClick={() => handleAccountRowClick(acc.id!)}>
                <td className={styles.tableCell}>{acc.accountNumber}</td>
                <td className={styles.tableCell}>{(acc as any).ownerName || '-'}</td>
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
        {pageInfo && pageInfo.totalPages > 0 && (
          <div className={styles.paginationContainer}>
            <button 
              className={styles.pageButton} 
              onClick={handlePreviousPage} 
              disabled={currentPage === 0}
            >
              ย้อนกลับ
            </button>
            <span className={styles.pageInfoText}>
              หน้า {currentPage + 1} จาก {pageInfo.totalPages}
            </span>
            <button 
              className={styles.pageButton} 
              onClick={handleNextPage} 
              disabled={currentPage >= pageInfo.totalPages - 1}
            >
              ถัดไป
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAccountListPage