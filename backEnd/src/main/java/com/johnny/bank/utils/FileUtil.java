package com.johnny.bank.utils;

import org.apache.commons.lang3.mutable.Mutable;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: FileUtil
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/29 9:31
 * @version: 1.0
 */
public class FileUtil {

    /**
     * 将文件保存到指定路径
     */
    public static String storeFile(MultipartFile file, String path) throws IOException {
        File directory = new File(path);
        if (!directory.exists()){
            directory.mkdirs();  // 使用mkdirs()以确保创建多层目录
        }

        // 使用原始文件名进行存储
        String originalFileName = file.getOriginalFilename();
        Path targetPath = new File(directory, originalFileName).toPath();

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        return targetPath.toString();
    }
}
