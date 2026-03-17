package com.configuration.account;

public enum AccountType {
    SAVING("saving","บัญชีออมทรัพย์"),
    CURRENT("current","บัญชีกระแสรายวัน");

    private final String label;
    private final String value;

    AccountType(String value, String label){
        this.value = value;
        this.label = label;
    }

    public String getValue(){ return value; }
    public String getLabel(){ return label; }
}
