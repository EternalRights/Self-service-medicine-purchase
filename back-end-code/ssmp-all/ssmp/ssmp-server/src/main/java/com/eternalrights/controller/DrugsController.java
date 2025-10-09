package com.eternalrights.controller;

import com.eternalrights.entity.Drug;
import com.eternalrights.query.DrugQuery;
import com.eternalrights.result.PageResult;
import com.eternalrights.result.Result;
import com.eternalrights.service.DrugsService;
import com.eternalrights.service.UserService;
import com.eternalrights.vo.InventoryRecord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/drugs")
@Slf4j
public class DrugsController {
    @Autowired
    private DrugsService DrugsService;

    @Autowired
    private UserService userService;

    @GetMapping
    public Result<PageResult<Drug>> getDrugsList(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer category,
            @RequestParam(required = false) Integer shelf_status,
            @RequestParam(required = false, defaultValue = "default") String sort,
            @RequestParam(required = false, defaultValue = "1") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer pageSize){
        log.info("获取药品列表：{}",page);
        return Result.success(DrugsService.getDrugsList(DrugQuery.builder()
                .keyword(keyword)
                .category(category)
                .shelf_status(shelf_status)
                .sort(sort)
                .page(page)
                .pageSize(pageSize)
                .build()));
    }

    @GetMapping("/{id}")
    public Result<Drug> getDrugById(@PathVariable("id") Integer id){
        log.info("获取药品：{}",id);
        return Result.success(DrugsService.getDrugById(id));
    }

    //获取药品库存记录
    @GetMapping("/{drugId}/inventory-records")
    public Result<InventoryRecord> getInventoryRecords(
            @PathVariable("drugId") Integer drugId){
        log.info("获取药品库存记录：{}",drugId);
        Drug drug = DrugsService.getDrugById(drugId);
        String createUserName = userService.getUserNameById(drug.getCreateUser());
        InventoryRecord inventoryRecord = InventoryRecord.builder()
                .drugId(drugId)
                .id(drug.getId())
                .quantity(drug.getStockQuantity())
                .batchNumber(drug.getBatchNumber())
                .productionDate(drug.getCreateTime())
                .expiryDate(drug.getExpiryDate())
                .createTime(drug.getCreateTime())
                .createUser(drug.getCreateUser())
                .createUserName(createUserName)
                .build();
        return Result.success(inventoryRecord);
    }
}
