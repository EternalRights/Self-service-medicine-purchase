package com.eternalrights.mapper;

import com.eternalrights.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {
    @Select("SELECT * FROM user WHERE phone_number = #{phoneNumber}")
    public User getUserByPhoneNumber(String phoneNumber);
}
