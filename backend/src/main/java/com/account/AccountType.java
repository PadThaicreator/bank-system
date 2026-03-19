package com.account;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AccountType {

    // Savings
    SAVINGS(
            "savings",
            "บัญชีออมทรัพย์",
            "1",
            AccountCategory.SAVINGS),

    // Current
    CURRENT_PERSONAL(
            "current_personal",
            "บัญชีกระแสรายวัน (บุคคลทั่วไป)",
            "2",
            AccountCategory.CURRENT),
    CURRENT_CORPORATE(
            "current_corporate",
            "บัญชีกระแสรายวัน (นิติบุคคล)",
            "3",
            AccountCategory.CURRENT),

    // Fixed Deposit
    FIXED_DEPOSIT_PERSONAL(
            "fixed_deposit_personal",
            "บัญชีฝากประจำ (บุคคลธรรมดา)",
            "4",
            AccountCategory.FIXED_DEPOSIT),
    FIXED_DEPOSIT_CORPORATE(
            "fixed_deposit_corporate",
            "บัญชีฝากประจำ (นิติบุคคล/เงื่อนไขพิเศษ)",
            "5",
            AccountCategory.FIXED_DEPOSIT);

    private final String value;
    private final String label;
    private final String numberValue; // หลักที่ 4 ของ account number
    private final AccountCategory category; // ประเภทหลัก
}