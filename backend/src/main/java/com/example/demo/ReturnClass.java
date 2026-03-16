package com.example.demo;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ReturnClass {

    @JsonProperty("MSG")
    private String MSG;

    @JsonProperty("Code")
    private String CODE;


    public String getCODE() {
        return CODE;
    }

    public void setCODE(String CODE) {
        this.CODE = CODE;
    }

    public String getMSG() {
        return MSG;
    }

    public void setMSG(String MSG) {
        this.MSG = MSG;
    }
}
