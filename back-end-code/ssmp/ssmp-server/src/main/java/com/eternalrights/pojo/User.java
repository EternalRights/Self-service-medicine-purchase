package com.eternalrights.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    Integer id;
    String phoneNumber;
    String password;
    String name;
    Integer gender;
    Integer age;
    LocalDateTime createTime;
    LocalDateTime updateTime;
}
