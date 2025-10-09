package com.eternalrights;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.eternalrights.mapper")
public class SsmpServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(SsmpServerApplication.class, args);
	}

}
