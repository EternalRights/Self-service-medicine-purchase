package com.eternalrights.mapper;

import com.eternalrights.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {
    //根据手机号查询用户
    @Select("select * from user where phone_number = #{phoneNumber}")
    User findByPhoneNumber(String phoneNumber);

    //根据ID查询用户姓名
    @Select("select name from user where id = #{id}")
    String findNameById(Integer id);
}
