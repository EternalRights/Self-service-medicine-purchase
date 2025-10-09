package com.eternalrights.service.impl;

import com.eternalrights.entity.Drug;
import com.eternalrights.mapper.DrugsMapper;
import com.eternalrights.query.DrugQuery;
import com.eternalrights.result.PageResult;
import com.eternalrights.service.DrugsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class DrugsServiceImpl implements DrugsService {
    @Autowired
    private DrugsMapper drugMapper;

    @Override
    public PageResult<Drug> getDrugsList(DrugQuery query) {
        try {
            // 查询数据列表
            List<Drug> items = drugMapper.selectDrugList(query);
            // 查询总数
            Long total = drugMapper.countDrugList(query);

            // 计算分页信息
            Integer totalPages = 0;
            if (query.getPageSize() != null && query.getPageSize() > 0) {
                totalPages = (int) Math.ceil((double) total / query.getPageSize());
            }

            return PageResult.<Drug>builder()
                    .items(items)
                    .total(total.intValue())
                    .page(query.getPage() != null ? query.getPage() : 1)
                    .pageSize(query.getPageSize() != null ? query.getPageSize() : total.intValue())
                    .totalPages(totalPages)
                    .build();

        } catch (Exception e) {
            log.error("获取药品列表失败: {}", e.getMessage());
            throw new RuntimeException("查询药品列表失败");
        }
    }

    @Override
    public Drug getDrugById(Integer id) {
        Drug drug = drugMapper.selectDrugById(id);
        if ( drug == null){
            throw new RuntimeException("药品不存在");
        }
        return drug;
    }
}