package com.models;

import com.MainApplication;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public  class ReturnClass {

    @JsonProperty("MSG")
    private String MSG;

    @JsonProperty("Code")
    private String CODE;
    private Boolean Success;
    private Boolean Error;
    private LocalDateTime timestamp;

    private ReturnDataClass data;


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


    public void setSuccessReturn() {
        this.Success = true;
        this.Error = false;
        this.timestamp = LocalDateTime.now();

    }

    public void setErrorReturn() {
        this.Success = false;
        this.Error = true;
        this.timestamp = LocalDateTime.now();

    }


    public ReturnDataClass getData() {
        return data;
    }

    public void setData(ReturnDataClass data) {
        this.data = data;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Boolean getError() {
        return Error;
    }

    public void setError(Boolean error) {
        Error = error;
    }

    public void setSuccess(Boolean success) {
        Success = success;
    }

    public Boolean getSuccess() {
        return Success;
    }
}