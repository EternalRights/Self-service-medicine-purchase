package com.eternalrights.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InventoryRecord {
    private Integer id;
    private Integer drugId;
    private Integer quantity;
    private String batchNumber;
    private String productionDate;
    private String expiryDate;
    private String createTime;
    private Integer createUser;
    private String createUserName;
}
