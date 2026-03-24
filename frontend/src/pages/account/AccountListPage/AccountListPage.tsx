import type { AccountResponse } from '../../../types/accountType'
import { useAllAccount } from "../../../hooks/useAllAccount"
import styles from './AccountListPage.module.css'
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";
import useUserAccount from '../../../hooks/useUserAccount';

const AccountListPage = () => {
  const navigate = useNavigate();
  // get user role
  const authState = useSelector((state: RootState) => state.auth);
  const userRole = authState.user?.role;
  // get all account for admin and user account for customer
  const { accounts:adminAccountList, loading:adminLoading, error:adminError, refetch:adminRefetch } = useAllAccount()
  const { accounts:userAccountList, loading:userLoading, error:userError, fetchUserAccount } = useUserAccount()
  // set error and refetch and accounts based on user role
  let error = userRole === "ADMIN" ? adminError : userError
  let refetch = userRole === "ADMIN" ? adminRefetch : fetchUserAccount
  let accounts = userRole === "ADMIN" ? adminAccountList : userAccountList
  if (adminLoading || userLoading) return <div className={styles.loadingContainer}>Loading Data...</div>
  if (error) return (
    <div className={styles.errorContainer}>
      <p className={styles.errorMessage}>Error: {error}</p>
      <button onClick={refetch} className={styles.retryButton}>
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
              <th className={styles.tableHeaderCell}>ประเภท</th>
              <th className={styles.tableHeaderCell}>ยอดเงิน</th>
              <th className={styles.tableHeaderCell}>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {accounts?.map((acc: AccountResponse) => (
              <tr key={acc.id} className={styles.tableRow} onClick={() => handleAccountRowClick(acc.id!)}>
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