package com.account;

public enum AccountStatus {

    ACTIVE("active", "เปิดใช้งาน"),
    CLOSED("closed", "ยกเลิกการใช้งาน"),
    FROZEN("frozen", "ระงับการใช้งานชั่วคราว"),
    PENDING("pending", "รอดำเนินการ"),
    REJECTED_REQUEST("request rejected", "คำขอถูกปฏิเสธ");

    private final String label;
    private final String value;

    AccountStatus(String value, String label) {
        this.value = value;
        this.label = label;
    }

    public String getValue() {
        return value;
    }

    public String getLabel() {
        return label;
    }
}