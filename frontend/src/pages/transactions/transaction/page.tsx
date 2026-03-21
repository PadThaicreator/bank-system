import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserAccount from "../../../hooks/useUserAccount";
import { useTransaction } from "../../../hooks/transactions/useTransaction";
import styles from "./transaction.module.css";

type TransactionType = "DEPOSIT" | "WITHDRAW" | "TRANSFER";

interface TransactionForm {
  type: TransactionType;
  from_account_id: string;
  to_account_number: string;
  amount: number;
  note: string;
}

export default function TransactionPage() {
  const navigate = useNavigate();
  const { accounts, loading: accLoading, error: accError } = useUserAccount();
  const { postTransaction, loading: txLoading, error: txError } = useTransaction();

  const [form, setForm] = useState<TransactionForm>({
    type: "DEPOSIT",
    from_account_id: "",
    to_account_number: "",
    amount: 0,
    note: "",
  });

  const handleTypeChange = (type: TransactionType) => {
    setForm(prev => ({
      ...prev,
      type,
      // Reset account selections when changing type
      from_account_id: "",
      to_account_number: "",
    }));
  };

  const handleAccountSelect = (accountId: string) => {
    setForm(prev => ({
      ...prev,
      from_account_id: accountId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(form);

    const transactionData = {
      type: form.type,
      amount: form.amount,
      note: form.note,
      from_account_id: form.from_account_id,
      to_account_number: form.type === "TRANSFER" ? form.to_account_number : undefined,
    };

    console.log(transactionData);

    try {
      await postTransaction(transactionData);
      // Success - maybe navigate to history or show success message
      navigate("/transaction/history");
    } catch {
      // Error is handled by the hook
    }
  };

  if (accLoading) {
    return (
      <div className={styles.stateWrapper}>
        <div className={styles.spinner} />
        <p className={styles.stateText}>Loading data...</p>
      </div>
    );
  }

  if (accError) {
    return (
      <div className={styles.stateWrapper}>
        <p className={styles.errorText}>Error occurred: {accError}</p>
      </div>
    );
  }

  const hasAccounts = accounts && accounts.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Make Transaction</h1>
          <p className={styles.subtitle}>Select transaction type and enter details</p>
        </div>

        {!hasAccounts ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🏦</div>
            <p className={styles.emptyText}>You don't have any accounts for transactions</p>
            <button
              className={styles.openAccBtn}
              onClick={() => navigate("/open-account")}
            >
              + Open New Account
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Transaction Type Selection */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Transaction Type</h2>
              <div className={styles.typeOptions}>
                <label className={styles.typeOption}>
                  <input
                    type="radio"
                    name="type"
                    value="DEPOSIT"
                    checked={form.type === "DEPOSIT"}
                    onChange={() => handleTypeChange("DEPOSIT")}
                  />
                  <span className={styles.typeLabel}>Deposit</span>
                </label>
                <label className={styles.typeOption}>
                  <input
                    type="radio"
                    name="type"
                    value="WITHDRAW"
                    checked={form.type === "WITHDRAW"}
                    onChange={() => handleTypeChange("WITHDRAW")}
                  />
                  <span className={styles.typeLabel}>Withdraw</span>
                </label>
                <label className={styles.typeOption}>
                  <input
                    type="radio"
                    name="type"
                    value="TRANSFER"
                    checked={form.type === "TRANSFER"}
                    onChange={() => handleTypeChange("TRANSFER")}
                  />
                  <span className={styles.typeLabel}>Transfer</span>
                </label>
              </div>
            </div>

            {/* Account Selection */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {form.type === "TRANSFER" ? "Select source and destination accounts" : "Select Account"}
              </h2>

              {form.type === "TRANSFER" ? (
                <div className={styles.transferAccounts}>
                  <div className={styles.accountGroup}>
                    <h3 className={styles.accountGroupTitle}>From Account</h3>
                    <div className={styles.accountList}>
                      {accounts.map((acc) => (
                        <label key={acc.id} className={styles.accountOption}>
                          <input
                            type="radio"
                            name="from_account"
                            value={acc.id}
                            checked={form.from_account_id === acc.id}
                            onChange={() => handleAccountSelect(acc.id!)}
                          />
                          <div className={styles.accountInfo}>
                            <span className={styles.accountNumber}>{acc.accountNumber}</span>
                            <span className={styles.accountType}>{acc.accountCategory}</span>
                            <span className={styles.accountBalance}>
                              {Number(acc.balance).toLocaleString("en-US", { style: "currency", currency: "THB" })}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.accountGroup}>
                    <h3 className={styles.accountGroupTitle}>To Account</h3>
                    <div className={styles.toAccountInput}>
                      <input
                        type="text"
                        placeholder="Enter destination account number"
                        value={form.to_account_number}
                        onChange={(e) => setForm(prev => ({ ...prev, to_account_number: e.target.value }))}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.accountList}>
                  {accounts.map((acc) => (
                    <label key={acc.id} className={styles.accountOption}>
                      <input
                        type="radio"
                        name="account"
                        value={acc.id}
                        checked={form.from_account_id === acc.id}
                        onChange={() => handleAccountSelect(acc.id!)}
                      />
                      <div className={styles.accountInfo}>
                        <span className={styles.accountNumber}>{acc.accountNumber}</span>
                        <span className={styles.accountType}>{acc.accountCategory}</span>
                        <span className={styles.accountBalance}>
                          {Number(acc.balance).toLocaleString("en-US", { style: "currency", currency: "THB" })}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Amount and Note */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Details</h2>
              <div className={styles.details}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Amount (THB)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => setForm(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Note (Optional)</label>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm(prev => ({ ...prev, note: e.target.value }))}
                    className={styles.textarea}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Error Display */}
            {txError && (
              <div className={styles.error}>
                <p>Error occurred: {txError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => navigate("/transactions/history")}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  txLoading ||
                  !form.from_account_id ||
                  (form.type === "TRANSFER" && !form.to_account_number)
                }
                className={styles.submitBtn}
              >
                {txLoading ? "Processing..." : "Confirm Transaction"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
