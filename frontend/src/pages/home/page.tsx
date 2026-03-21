import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Wallet, ArrowRightLeft, History, UserCog, Landmark } from "lucide-react";
import type { RootState } from "../../redux/store";
import { useUserAccount } from "../../hooks/useUserAccount";
import styles from "./home.module.css";

function HomePage() {
  const navigate = useNavigate();
  // We assume user is populated in state.auth.user based on previous files.
  const { user } = useSelector((state: RootState) => state.auth);
  const { accounts, loading } = useUserAccount();

  // Calculate total balance beautifully
  const totalBalance = useMemo(() => {
    if (!accounts || accounts.length === 0) return 0;
    return accounts.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);
  }, [accounts]);

  // Handle current date formatting
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.pageContainer}>
      <header className={styles.welcomeSection}>
        <h1 className={styles.welcomeText}>
          Welcome back, {user?.fullName || "User"} 👋
        </h1>
        <p className={styles.dateText}>{today}</p>
      </header>

      <main>
        {/* Total Balance Card */}
        <div className={styles.balanceCard}>
          <p className={styles.balanceLabel}>Total Balance</p>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <div className={styles.spinner}></div>
              <span>Fetching balances...</span>
            </div>
          ) : (
            <>
              <h2 className={styles.balanceAmount}>
                {totalBalance.toLocaleString("th-TH", { minimumFractionDigits: 2 })} <span className={styles.currencySymbol}>฿</span>
              </h2>
              <div className={styles.accountsCount}>
                <Wallet className={styles.walletIcon} />
                {accounts?.length || 0} Active Account{(accounts?.length || 0) !== 1 && "s"}
              </div>
            </>
          )}
        </div>

        <div className={styles.splitContent}>
          {/* My Accounts List */}
          <div className={styles.contentLeft}>
            {!loading && accounts && accounts.length > 0 && (
              <div>
                <h3 className={styles.sectionTitle}>My Accounts</h3>
                <div className={styles.accountList}>
                  {accounts.map((acc) => (
                    <div key={acc.id || acc.accountNumber} className={styles.accountItem}>
                      <div>
                        <p className={styles.accountNumber}>No. {acc.accountNumber}</p>
                        <p className={styles.accountType}>{acc.accountCategory || "Savings"}</p>
                      </div>
                      <div className={styles.accountBalance}>
                        {Number(acc.balance).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className={styles.contentRight}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={styles.actionGrid}>
              <div 
                className={styles.actionCard}
                onClick={() => navigate("/transaction/service")}
              >
                <div className={`${styles.iconWrapper} ${styles.iconTransfer}`}>
                  <ArrowRightLeft className={styles.actionIcon} />
                </div>
                <span className={styles.actionLabel}>Transaction</span>
              </div>

              <div 
                className={styles.actionCard}
                onClick={() => navigate("/transaction/history")}
              >
                <div className={`${styles.iconWrapper} ${styles.iconHistory}`}>
                  <History className={styles.actionIcon} />
                </div>
                <span className={styles.actionLabel}>History</span>
              </div>

              {user?.role === "ADMIN" && (
                <>
                  <div 
                    className={styles.actionCard}
                    onClick={() => navigate("/admin/user")}
                  >
                    <div className={`${styles.iconWrapper} ${styles.iconAdminUsers}`}>
                      <UserCog className={styles.actionIcon} />
                    </div>
                    <span className={styles.actionLabel}>Manage Users</span>
                  </div>

                  <div 
                    className={styles.actionCard}
                    onClick={() => navigate("/admin/accountList")}
                  >
                    <div className={`${styles.iconWrapper} ${styles.iconAdminAccounts}`}>
                      <Landmark className={styles.actionIcon} />
                    </div>
                    <span className={styles.actionLabel}>Manage Acc.</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
