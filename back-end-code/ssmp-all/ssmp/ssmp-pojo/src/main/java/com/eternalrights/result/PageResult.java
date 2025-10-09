package com.eternalrights.result;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PageResult<T> {
    private List<T> items;
    private Integer total;
    private Integer page;
    private Integer pageSize;
    private Integer totalPages;
}