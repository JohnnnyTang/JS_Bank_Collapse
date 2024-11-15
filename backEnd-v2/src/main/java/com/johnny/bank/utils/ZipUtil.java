package com.johnny.bank.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipOutputStream;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: ZipUtil
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/27 11:31
 * @version: 1.0
 */
public class ZipUtil {
    private static final Logger log = LoggerFactory.getLogger(ZipUtil.class);
    /**
     * 保存zip文件到本地并调用解压方法并返回解压出的文件的路径集合
     *
     * @param file 文件
     * @return list //解压出的文件的路径合集
     */
    private static String zipPath = "f:/shpfile/";//zip根路径

    public static MultipartFile zipFolderAndGetAsMultipartFile(String folderPath, String zipFileName) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            Path filePath = Paths.get(folderPath, zipFileName + ".tif");
            ZipEntry zipEntry = new ZipEntry(zipFileName + "/" + zipFileName + ".tif");
            zos.putNextEntry(zipEntry);
            if (Files.isRegularFile(filePath)) {
                Files.copy(filePath, zos);
            }
            zos.closeEntry();
            // 创建文件夹条目
            zipEntry = new ZipEntry(zipFileName + "/"); // 创建一个空文件夹条目
            zos.putNextEntry(zipEntry);
            zos.closeEntry();
            zos.finish();
        }
        byte[] zippedFileBytes = baos.toByteArray();
        return new MockMultipartFile(zipFileName+".zip", zipFileName+".zip", "application/zip", zippedFileBytes);
    }

    public static MultipartFile zipFilesAndGetAsMultipartFile(List<MultipartFile> files, String zipFileName) throws IOException {
        // 创建一个ByteArrayOutputStream来存储zip文件内容
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    // 创建ZipEntry
                    String fileName = file.getOriginalFilename();
                    ZipEntry zipEntry = new ZipEntry(fileName);
                    zos.putNextEntry(zipEntry);

                    // 读取文件内容并写入ZipOutputStream
                    byte[] bytes = file.getBytes();
                    zos.write(bytes, 0, bytes.length);
                    zos.closeEntry();
                }
            }
            // 完成ZIP文件的创建
            zos.finish();
        }

        // 将ByteArrayOutputStream的内容转换为byte数组
        byte[] zippedFileBytes = baos.toByteArray();

        // 创建一个MockMultipartFile

        return new MockMultipartFile(zipFileName + ".zip", zipFileName + ".zip", "application/zip", zippedFileBytes);
    }

    /**
     * zip解压
     *
     * @param srcFile     zip源文件
     * @param destDirPath 解压后的目标文件夹
     * @return list 解压文件的路径合集
     * @throws RuntimeException 解压失败会抛出运行时异常
     */
    public static List<String> unZipFiles(File srcFile, String destDirPath) throws RuntimeException, IOException {
        List<String> list = new ArrayList<>();
        long start = System.currentTimeMillis();
        // 判断源文件是否存在
        if (!srcFile.exists()) {
            throw new RuntimeException(srcFile.getPath() + "所指文件不存在");
        }

        // 判断目标路径是否存在
        Path path = Paths.get(destDirPath);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        // 开始解压
        ZipFile zipFile = null;
        try {
            zipFile = new ZipFile(srcFile, Charset.forName("GBK"));
            Enumeration<?> entries = zipFile.entries();
            while (entries.hasMoreElements()) {
                ZipEntry entry = (ZipEntry) entries.nextElement();
                log.info("解压" + entry.getName());
                // 如果是文件夹，就创建个文件夹
                if (entry.isDirectory()) {
                    String dirPath = destDirPath + File.separator + entry.getName();
                    File dir = new File(dirPath);
                    dir.mkdirs();
                } else {
                    // 如果是文件，就先创建一个文件，然后用io流把内容copy过去
                    File targetFile = new File(destDirPath + File.separator + entry.getName());
                    // 保证这个文件的父文件夹必须要存在
                    log.info(destDirPath + entry.getName());
                    list.add(destDirPath + File.separator + entry.getName());
                    if (!targetFile.getParentFile().exists()) {
                        log.info("父文件不存在");
                    }
                    targetFile.createNewFile();
                    // 将压缩文件内容写入到这个文件中
                    InputStream is = zipFile.getInputStream(entry);
                    FileOutputStream fos = new FileOutputStream(targetFile);
                    int len;
                    byte[] buf = new byte[1024];
                    while ((len = is.read(buf)) != -1) {
                        fos.write(buf, 0, len);
                    }
                    // 关流顺序，先打开的后关闭
                    fos.close();
                    is.close();
                }
            }
            long end = System.currentTimeMillis();
            log.info("解压完成，耗时：" + (end - start) + " ms");
        } catch (Exception e) {
            throw new RuntimeException("unzip error from ZipUtils", e);
        } finally {
            if (zipFile != null) {
                try {
                    zipFile.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return list;
    }

    /**
     * @param filePath 临时文件的删除
     *                 删除文件夹里面子目录
     *                 再删除文件夹
     */
    public static void deleteFiles(String filePath) {
        File directory = new File(filePath);
        if (!directory.exists() || !directory.isDirectory()) {
            log.info("文件夹不存在");
            return;
        }

        File[] files = directory.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    deleteFiles(file.getAbsolutePath());
                }
                file.delete();
            }
        }
        log.info("临时文件删除完成");
    }

    //压缩文件夹，传入文件夹，返回压缩包路径
    public static String zipFolder(File file){
        String rootDirName = file.getName();
        String zipFileName = rootDirName + ".zip";
        String outputPath = String.join(File.separator, file.getParent(), zipFileName);
        try (ZipOutputStream zipOutputStream = new ZipOutputStream(Files.newOutputStream(Path.of(outputPath)))) {
            // 这里的rootDirName就是压缩包中的根文件夹名字
            Files.walk(Path.of(file.getAbsolutePath()))
                .forEach(path -> {
                    try {
                        // 获取文件或文件夹的相对路径，加上根目录名称以包含整个目录结构
                        Path relativePath = file.toPath().relativize(path);
                        String zipEntryName = String.join(File.separator, rootDirName, relativePath.toString().replace("\\", File.separator));
                        ZipEntry zipEntry = new ZipEntry(zipEntryName);

                        zipOutputStream.putNextEntry(zipEntry);

                        // 如果是文件，则复制内容，否则只创建文件夹条目
                        if (Files.isRegularFile(path)) {
                            Files.copy(path, zipOutputStream);
                        }

                        zipOutputStream.closeEntry();
                    } catch (IOException e) {
                        System.err.println("Failed to zip file or folder: " + path);
                        e.printStackTrace();
                    }
                });
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return outputPath;
    }

    public static MultipartFile zipFolderAndGetAsMultipartFile2(String folderPath, String zipFileName) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            Path filePath = Paths.get(folderPath, zipFileName + ".json");
            ZipEntry zipEntry = new ZipEntry(zipFileName + "/" + zipFileName + ".json");
            zos.putNextEntry(zipEntry);
            if (Files.isRegularFile(filePath)) {
                Files.copy(filePath, zos);
            }
            zos.closeEntry();
            // 创建文件夹条目
            zipEntry = new ZipEntry(zipFileName + "/"); // 创建一个空文件夹条目
            zos.putNextEntry(zipEntry);
            zos.closeEntry();
            zos.finish();
        }
        byte[] zippedFileBytes = baos.toByteArray();
        return new MockMultipartFile(zipFileName+".zip", zipFileName+".zip", "application/zip", zippedFileBytes);
    }
}
