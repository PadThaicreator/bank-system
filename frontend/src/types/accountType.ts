import type { components } from "./api"

export type AccountResponse = components["schemas"]["AccountResponse"]
export type BalanceResponse = components["schemas"]["BalanceResponse"]
export type CreateAccountRequest = components["schemas"]["CreateAccountRequest"]
export type AccountType = NonNullable<AccountResponse["accountType"]>