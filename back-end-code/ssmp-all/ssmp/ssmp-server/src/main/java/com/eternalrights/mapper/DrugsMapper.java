package com.eternalrights.mapper;

import com.eternalrights.entity.Drug;
import com.eternalrights.query.DrugQuery;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface DrugsMapper {
    /**
     * 分页查询药品列表
     */
    List<Drug> selectDrugList(@Param("query") DrugQuery query);

    /**
     * 统计符合条件的药品总数
     */
    Long countDrugList(@Param("query") DrugQuery query);

    /**
     * 根据ID查询药品详细数据
     */
    @Select("SELECT * FROM drug WHERE id = #{id}")
    Drug selectDrugById(Integer id);

    /**
     * 根据ID删除药品
     */
    @Delete("DELETE FROM drug WHERE id = #{id}")
    void deleteDrugById(Integer id);
}
