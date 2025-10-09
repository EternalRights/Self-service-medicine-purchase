package com.eternalrights.controller;

import com.eternalrights.result.Result;
import com.eternalrights.utilis.AliOssUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@Slf4j
@RequestMapping("/upload")
public class uploadController {
    @Autowired
    private AliOssUtil aliOssUtil;

    @PostMapping
    public Result<String> upload(@RequestParam("file") MultipartFile file){
        log.info("上传文件：{}",file);

        try {
            String originalFilename = file.getOriginalFilename();
            String objectName = originalFilename.substring(originalFilename.lastIndexOf("."));
            objectName = UUID.randomUUID().toString() + objectName;

            //文件的请求路径
            String filePath = aliOssUtil.upload(file.getBytes(),objectName);
            return Result.success(filePath);
        } catch (IOException e) {
            log.error("上传文件失败 {}",e);
        }

        return null;
    }
}
