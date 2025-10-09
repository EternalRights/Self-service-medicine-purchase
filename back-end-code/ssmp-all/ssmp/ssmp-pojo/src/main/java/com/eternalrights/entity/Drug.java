package com.eternalrights.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Drug {
    private Integer id;
    private String genericName;
    private String image;
    private Integer category;
    private String specification;
    private String manufacturer;
    private String composition;
    private String indications;
    private String usageDosage;
    private String precautions;
    private String expiryDate;
    private Integer shelfStatus;
    private Integer stockQuantity;
    private String batchNumber;
    private Integer createUser;
    private String createTime;
    private Integer updateUser;
    private String updateTime;
}