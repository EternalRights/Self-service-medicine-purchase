package com.eternalrights.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "ssmp.jwt")
@Data
public class JwtProperties {
    private String userSecretKey;
    private Integer userTtl;
    private String userTokenName;

}
