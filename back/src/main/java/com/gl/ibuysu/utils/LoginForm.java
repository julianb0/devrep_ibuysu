package com.gl.ibuysu.utils;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginForm {

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    private String email;

    private String password;

}
