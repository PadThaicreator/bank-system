import type { AccountType } from '../types/accountType'

export type OptionType = {
    value: string,
    label: string,
}

export type StatusType = OptionType
export type AccountTypeType = {
    value: AccountType,
    label: string,
}
export type AccountCategoryType = OptionType

export const getAllStatus = (): StatusType[] => {
    return [
        { value: 'ACTIVE', label: 'ใช้งานอยู่' },
        { value: 'FROZEN', label: 'ถูกระงับ' },
        { value: 'CLOSED', label: 'ปิดบัญชีแล้ว' },
    ];
}

export const getAllAccountType = (): AccountTypeType[] => {
    return [
        { value: 'SAVINGS', label: 'บัญชีออมทรัพย์' },
        { value: 'CURRENT_PERSONAL', label: 'บัญชีกระแสรายวัน (บุคคลทั่วไป)' },
        { value: 'CURRENT_CORPORATE', label: 'บัญชีกระแสรายวัน (นิติบุคคล)' },
        { value: 'FIXED_DEPOSIT_PERSONAL', label: 'บัญชีฝากประจำ (บุคคลธรรมดา)' },
        { value: 'FIXED_DEPOSIT_CORPORATE', label: 'บัญชีฝากประจำ (นิติบุคคล/เงื่อนไขพิเศษ)' },
    ];
}

export const getAllAccountCategory = (): AccountCategoryType[] => {
    return [
        { value: 'SAVINGS', label: 'ออมทรัพย์' },
        { value: 'CURRENT', label: 'กระแสรายวัน' },
        { value: 'FIXED_DEPOSIT', label: 'ฝากประจำ' },
    ];
}

export const getStatusLabel = (status: string): string => {
    const found = getAllStatus().find(x => x.value === status)
    return found?.label ?? status
}

export const getAccountTypeLabel = (type: string): string => {
    const found = getAllAccountType().find(x => x.value === type)
    return found?.label ?? type
}

export const getAccountCategoryLabel = (category: string): string => {
    const found = getAllAccountCategory().find(x => x.value === category)
    return found?.label ?? category
}
