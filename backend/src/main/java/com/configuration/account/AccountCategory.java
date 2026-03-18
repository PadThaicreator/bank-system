package com.configuration.account;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AccountCategory {
        SAVINGS("ออมทรัพย์"),
        CURRENT("กระแสรายวัน"),
        FIXED_DEPOSIT("ฝากประจำ");

        private final String label;
}