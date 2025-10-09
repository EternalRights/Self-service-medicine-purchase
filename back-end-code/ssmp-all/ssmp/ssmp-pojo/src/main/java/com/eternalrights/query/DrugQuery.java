package com.eternalrights.query;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DrugQuery {
    private String keyword;
    private Integer category;
    private Integer shelf_status;
    private String sort;
    private Integer page;
    private Integer pageSize;

    public Integer getOffset() {
        if (page != null && pageSize != null) {
            return (page - 1) * pageSize;
        }
        return null;
    }
}