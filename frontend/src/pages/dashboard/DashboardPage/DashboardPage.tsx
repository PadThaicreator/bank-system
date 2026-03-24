import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ArrowRightLeft, Plus, History, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import type { RootState } from '../../../redux/store';
import styles from './DashboardPage.module.css';
import useUserAccount from '../../../hooks/useUserAccount';

// --- Types ---
interface Account {
  id: string;
  accountNumber: string;
  accountType: string;
  accountCategory: string;
  balance: number;
  status: string;
}

interface Transaction {
  id: string;
  transactionType: string;
  amount: number;
  status: string;
  createdAt: string;
}

// --- Mock Data ---
// const mockAccounts: Account[] = [
//   {
//     id: "uuid-1",
//     accountNumber: "001120240101-0042",
//     accountType: "SAVINGS",
//     accountCategory: "SAVINGS",
//     balance: 15000.00,
//     status: "ACTIVE"
//   },
//   {
//     id: "uuid-2",
//     accountNumber: "001120240101-0043",
//     accountType: "CURRENT",
//     accountCategory: "CURRENT",
//     balance: 2450.50,
//     status: "ACTIVE"
//   }
// ];

const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    transactionType: "DEPOSIT",
    amount: 5000.00,
    status: "SUCCESS",
    createdAt: "2024-01-15T10:30:00"
  },
  {
    id: "tx-2",
    transactionType: "TRANSFER",
    amount: 500.00,
    status: "SUCCESS",
    createdAt: "2024-01-14T14:20:00"
  },
  {
    id: "tx-3",
    transactionType: "WITHDRAWAL",
    amount: 1000.00,
    status: "FAILED",
    createdAt: "2024-01-13T09:15:00"
  }
];

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  const { accounts: userAccounts, loading: accountLoading, error: accountError, fetchUserAccount } = useUserAccount();
  const [ accounts, setAccounts ] = useState<Account[]>([]);
  const [ transactions, setTransactions ] = useState<Transaction[]>([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (!userAccounts) return;
      
      // ต้องทำการ Mapping เพื่อแปลงจาก AccountResponse (ที่บางฟิลด์เป็น optional)
      // ให้กลายเป็น Account (ที่ทุกฟิลด์ required)
      const formattedAccounts: Account[] = userAccounts.map(acc => ({
        id: acc.id || '',
        accountNumber: acc.accountNumber || '',
        accountType: acc.accountType || '',
        accountCategory: acc.accountType || '',
        balance: acc.balance || 0,
        status: acc.status || ''
      }));
      setAccounts(formattedAccounts);
      setTransactions(mockTransactions);
      setLoading(false);
    }, 800);
  }, [userAccounts]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading || accountLoading) {
    return (
      <div className={styles.loaderContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (accountError) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{accountError}</p>
        <button onClick={fetchUserAccount}>Retry</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Welcome back, {user?.fullName?.split(' ')[0] || "Customer"}!</h1>
          <p className={styles.headerSub}>Here is the summary of your accounts.</p>
        </header>

        {/* Total Balance Card */}
        <div className={styles.balanceCard}>
          <p className={styles.balanceLabel}>Total Balance</p>
          <h2 className={styles.balanceValue}>{formatCurrency(totalBalance)}</h2>
          <div className={styles.actionButtons}>
            <button className={styles.btnPrimary}>
              <Plus size={16} /> Add Money
            </button>
            <button className={styles.btnPrimary}>
              <ArrowRightLeft size={16} /> Transfer
            </button>
          </div>
        </div>

        <div className={styles.grid}>
          {/* Left Column: Accounts & Transactions */}
          <div className={styles.colSpan2}>
            {/* Accounts */}
            <div>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Your Accounts</h3>
                <button className={styles.linkBtn}>View All</button>
              </div>
              
              {accounts.length === 0 ? (
                <div className={styles.emptyState}>
                  You don't have any accounts yet.
                </div>
              ) : (
                <div className={styles.accountsGrid}>
                  {accounts.map(acc => (
                    <div key={acc.id} className={styles.accountCard}>
                      <div className={styles.accountCardDeco}></div>
                      <div className={styles.accountCardTop}>
                        <div>
                          <p className={styles.accountType}>{acc.accountType}</p>
                          <p className={styles.accountNumber}>{acc.accountNumber}</p>
                        </div>
                        <span className={`${styles.badge} ${acc.status === 'ACTIVE' ? styles.badgeActive : styles.badgeInactive}`}>
                          {acc.status}
                        </span>
                      </div>
                      <p className={styles.accountBalance}>{formatCurrency(acc.balance)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Recent Transactions</h3>
                <button className={styles.linkBtn}>Full History</button>
              </div>
              
              <div className={styles.card}>
                {transactions.length === 0 ? (
                  <div className={styles.emptyState}>No transactions found.</div>
                ) : (
                  <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th className={styles.th}>Transaction</th>
                          <th className={styles.th}>Date</th>
                          <th style={{textAlign: 'right'}} className={styles.th}>Amount</th>
                          <th style={{textAlign: 'center'}} className={styles.th}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map(tx => (
                          <tr key={tx.id} className={styles.tr}>
                            <td className={styles.td}>
                              <div className={styles.txCell}>
                                <div className={`${styles.txIconWrapper} ${
                                  tx.transactionType === 'DEPOSIT' ? styles.txIconDeposit :
                                  tx.transactionType === 'WITHDRAWAL' ? styles.txIconWithdraw :
                                  styles.txIconTransfer
                                }`}>
                                  {tx.transactionType === 'DEPOSIT' && <ArrowDownLeft size={16} />}
                                  {tx.transactionType === 'WITHDRAWAL' && <ArrowUpRight size={16} />}
                                  {tx.transactionType === 'TRANSFER' && <ArrowRightLeft size={16} />}
                                </div>
                                <span className={styles.txName}>{tx.transactionType.toLowerCase()}</span>
                              </div>
                            </td>
                            <td className={styles.td}>
                              <span className={styles.txDate}>{formatDate(tx.createdAt)}</span>
                            </td>
                            <td style={{textAlign: 'right'}} className={styles.td}>
                              <span className={styles.txAmount}>
                                {tx.transactionType === 'DEPOSIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                              </span>
                            </td>
                            <td style={{textAlign: 'center'}} className={styles.td}>
                              <span className={`${styles.badge} ${
                                tx.status === 'SUCCESS' ? styles.badgeActive :
                                tx.status === 'FAILED' ? styles.badgeInactive :
                                styles.badgeWarning
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Quick Actions */}
          <div className={styles.quickActions}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={`${styles.card} ${styles.actionList}`}>
              <button className={styles.actionItem}>
                <div className={`${styles.actionIcon} ${styles.actionIconBlue}`}>
                  <ArrowRightLeft size={20} />
                </div>
                <span className={styles.actionText}>Transfer Money</span>
              </button>
              
              <button className={styles.actionItem}>
                <div className={`${styles.actionIcon} ${styles.actionIconIndigo}`}>
                  <Plus size={20} />
                </div>
                <span className={styles.actionText}>Open New Account</span>
              </button>
              
              <button className={styles.actionItem}>
                <div className={`${styles.actionIcon} ${styles.actionIconGray}`}>
                  <History size={20} />
                </div>
                <span className={styles.actionText}>Transaction History</span>
              </button>
            </div>
            
            <div className={styles.promoBox}>
              <h4 className={styles.promoTitle}>Haloooooooooooooooo</h4>
              <p className={styles.promoText}>Halooooooooooooooooooooooooooooooooooooooooooo.</p>
              <button className={styles.promoBtn}>
                Halooooo
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
