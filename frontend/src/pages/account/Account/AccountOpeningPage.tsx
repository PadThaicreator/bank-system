import { useState } from 'react'
import { getAllAccountType } from '../../../constants/accountOptions'
import { useAccountCreate } from '../../../hooks/accounts/useAccountCreate'
import type { AccountType, CreateAccountRequest } from '../../../types/accountType'
import styles from './AccountOpeningPage.module.css'

const AccountOpeningPage = () => {
    const { createAccount, loading, error } = useAccountCreate()
    const accountTypes = getAllAccountType()

    const [accountType, setAccountType] = useState<string>(accountTypes[0].value)
    const [amount, setAmount] = useState<number>(0)
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const createAccountPayload: CreateAccountRequest = {
            accountType: accountType as AccountType,
            initialDeposit: amount
        }
        createAccount(createAccountPayload)
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>กำลังดำเนินการ...</div>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>เปิดบัญชีใหม่</h1>
            
            {error && <div className={styles.error}>{error}</div>}

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="accountType">ประเภทบัญชี</label>
                    <select 
                        className={styles.select}
                        name="accountType" 
                        id="accountType" 
                        value={accountType} 
                        onChange={(e) => setAccountType(e.target.value)}
                    >
                        {accountTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="amount">จำนวนเงินเปิดบัญชี</label>
                    <input 
                        className={styles.input}
                        id="amount"
                        type="number" 
                        placeholder="จำนวนเงินฝาก ขั้นต่ำ 1,000 บาท" 
                        min="1000"
                        onChange={(e) => setAmount(Number(e.target.value))} 
                        required
                    />
                </div>
                
                <button 
                    className={styles.submitBtn} 
                    type="submit" 
                    disabled={loading || amount < 1000}
                >
                    ยืนยันการเปิดบัญชี
                </button>
            </form>
        </div>
    )
}

export default AccountOpeningPage