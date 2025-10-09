package com.eternalrights.utilis;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@Data
@AllArgsConstructor
@NoArgsConstructor
public class JwtTokenUtil {

    @Value("${ssmp.jwt.admin-secret-key}")
    private String secretKey;

    @Value("${ssmp.jwt.admin-ttl}")
    private long expirationTime; // 单位：毫秒

    @Value("${ssmp.jwt.admin-token-name}")
    private String tokenName;

    // 生成安全的密钥对象
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 生成JWT Token
     */
    public String generateToken(String phoneNumber) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .setSubject(phoneNumber)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * 从Token中获取用户名（手机号）
     */
    public String getPhoneNumberFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    /**
     * 验证Token是否有效
     */
    public boolean validateToken(String token, String phoneNumber) {
        try {
            final String usernameInToken = getPhoneNumberFromToken(token);
            return (usernameInToken.equals(phoneNumber) && !isTokenExpired(token));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 检查Token是否过期
     */
    private boolean isTokenExpired(String token) {
        try {
            Date expiration = Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getExpiration();
            return expiration.before(new Date());
        } catch (Exception e) {
            return true; // 解析异常视为过期
        }
    }

    /**
     * 获取过期时间（秒） - 提供给外部使用
     */
    public Integer getExpiresInSeconds() {
        return (int) (expirationTime / 1000); // 转换为秒
    }

    /**
     * 获取token header名称
     */
    public String getTokenName() {
        return tokenName;
    }
}