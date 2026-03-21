import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserAccount from "../../../hooks/useUserAccount";
import { useHistoryTransaction } from "../../../hooks/transactions/useGetHistory";
import type { AccountResponse } from "../../../types";
import styles from "./history.module.css";


function TxBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    TRANSFER: styles.txTransfer,
    DEPOSIT: styles.txDeposit,
    WITHDRAW: styles.txWithdraw,
  };
  return (
    <span className={`${styles.txBadge} ${map[type] ?? styles.txDefault}`}>
      {type || "UNKNOWN"}
    </span>
  );
}

function Amount({ amount, type }: { amount: number; type: string }) {
  const isCredit = type === "DEPOSIT";
  return (
    <span className={isCredit ? styles.amountCredit : styles.amountDebit}>
      {isCredit ? "+" : "-"}
      {Number(amount || 0).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿
    </span>
  );
}

export default function HistoryPage() {
  const navigate = useNavigate();

  
  const { accounts, loading: accLoading, error: accError } = useUserAccount();
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);

  
  const {
    transaction: transactions,
    loading: txLoading,
    error: txError,
  } = useHistoryTransaction(selectedAccount?.id);

  
  if (accLoading)
    return (
      <div className={styles.stateWrapper}>
        <div className={styles.spinner} />
        <p className={styles.stateText}>กำลังโหลดข้อมูล...</p>
      </div>
    );

  if (accError)
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.errorText}>เกิดข้อผิดพลาด: {accError}</p>
      </div>
    );

  const hasAccounts = accounts && accounts.length > 0;

  return (
    <div className={styles.page}>
      
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>My Account</h2>
          <span className={styles.countPill}>{accounts?.length ?? 0}</span>
        </div>

        {!hasAccounts ? (
          <div className={styles.emptyAccounts}>
            <div className={styles.emptyIcon}>🏦</div>
            <p className={styles.emptyText}>No Account Found</p>
            <button
              className={styles.openAccBtn}
              onClick={() => navigate("/open-account")}
            >
              + Open New Account
            </button>
          </div>
        ) : (
          <ul className={styles.accountList}>
            {accounts.map((acc, i) => (
              <li
                key={acc.accountNumber}
                className={`${styles.accountItem} ${
                  selectedAccount?.accountNumber === acc.accountNumber
                    ? styles.accountItemActive
                    : ""
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => setSelectedAccount(acc)}
              >
                <div className={styles.accTop}>
                  <span className={styles.accNumber}>{acc.accountNumber}</span>
                  <span
                    className={`${styles.accStatus} ${
                      acc.status === "ACTIVE"
                        ? styles.statusActive
                        : styles.statusInactive
                    }`}
                  >
                    {acc.status}
                  </span>
                </div>
                <div className={styles.accBottom}>
                  <span className={styles.accType}>{acc.accountCategory}</span>
                  <span className={styles.accBalance}>
                    {Number(acc.balance).toLocaleString("th-TH")} ฿
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* ── Right: Transaction history ───────────────────── */}
      <main className={styles.main}>
        {!selectedAccount ? (
          <div className={styles.stateWrapper}>
            <p className={styles.stateText}>Choose Account for History</p>
          </div>
        ) : (
          <>
            <div className={styles.mainHeader}>
              <div>
                <h2 className={styles.mainTitle}>Transaction History</h2>
                <p className={styles.mainSub}>
                  Account{" "}
                  <span className={styles.mainAccNumber}>
                    {selectedAccount.accountNumber}
                  </span>
                </p>
              </div>
            </div>

            {txLoading && (
              <div className={styles.stateWrapper}>
                <div className={styles.spinner} />
                <p className={styles.stateText}>loading...</p>
              </div>
            )}

            {txError && (
              <div className={styles.stateWrapper}>
                <p className={styles.errorText}>Error: {txError}</p>
              </div>
            )}

            {!txLoading && !txError && (!transactions || transactions.length === 0) && (
              <div className={styles.stateWrapper}>
                <div className={styles.emptyIcon}>📭</div>
                <p className={styles.stateText}>No Transaction Found</p>
              </div>
            )}

            {!txLoading && !txError && transactions && transactions.length > 0 && (
              <div className={styles.txList}>
                {transactions.map((tx, i) => (
                  <div
                    key={tx.reference_no ?? i}
                    className={styles.txCard}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className={styles.txLeft}>
                      <TxBadge type={tx.type || "UNKNOWN"} />
                      <div className={styles.txMeta}>
                        <span className={styles.txRef}>{tx.reference_no}</span>
                        {tx.note && (
                          <span className={styles.txNote}>{tx.note}</span>
                        )}
                        {tx.to_account_id && (
                          <span className={styles.txDetail}>
                            To: {tx.to_account_number}
                          </span>
                        )}
                      </div>
                    </div>
                    <Amount amount={tx.amount || 0} type={tx.type || "UNKNOWN"} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}