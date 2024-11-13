package com.johnny.bank.utils;

import com.johnny.bank.model.resource.dataResource.GnssData;
import com.johnny.bank.model.resource.dataResource.InclinometerData;
import com.johnny.bank.model.resource.dataResource.ManometerData;
import com.johnny.bank.model.resource.dataResource.StressPileData;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: FileUtil
 * @author: Chry
 * @description: TODO
 * @date: 2024/1/29 9:31
 * @version: 1.0
 */
@Slf4j
public class FileUtil {

    // 删除指定路径文件夹以及其中文件
    public static void deleteFolder(File folder) {
        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    deleteFolder(file); // 递归删除子文件夹
                } else {
                    if (!file.delete()) {
                        log.info("Failed to delete file: " + file.getAbsolutePath());
                    }
                }
            }
        }
        if (!folder.delete()) {
            log.info("Failed to delete folder: " + folder.getAbsolutePath());
        }
    }
    // 删除指定文件
    public static void deleteFile(File file) {
        if (!file.delete()) {
            log.info("Failed to delete file: " + file.getAbsolutePath());
        }
    }

    // 获取指定路径文件内容
    public static String getFileContent(String filePathStr) {
        Path filePath = Paths.get(filePathStr);
        if (filePathStr.isEmpty() || Files.notExists(filePath)) {
            return "NOT EXIST";
        }
        try {
            //List<String> lines = Files.readAllLines(filePath, Charset.forName("GBK"));
            List<String> lines = Files.readAllLines(filePath);
            return String.join(System.lineSeparator(), lines);
        } catch (IOException e) {
            return "ERROR";
        }
    }

    // 获取文件二进制流
    public static byte[] getByteStreamFromFile(String filePath) {
        File pictureFile = new File(filePath);
        if (!pictureFile.exists() || pictureFile.isDirectory()) {
            return null;
        }
        try (FileInputStream fis = new FileInputStream(pictureFile)) {
            byte[] fileContent = new byte[(int) pictureFile.length()];
            int bytesRead = fis.read(fileContent);
            if (bytesRead != pictureFile.length()) {
                // 如果读取的字节数不等于文件长度，可以记录日志或抛出异常
                throw new IOException("未能读取完整的文件内容");
            }
            return fileContent;
        } catch (IOException e) {
            log.info(e.getMessage());
            return null; // 或者抛出自定义异常
        }
    }

    // 修改指定路径文件内容
    public static void modifiyFileContent(String filePathStr, String content) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filePathStr, false))) {
        //try (BufferedWriter writer = Files.newBufferedWriter(Paths.get(filePathStr), Charset.forName("GBK"))) {
            writer.write(content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 将文件保存到指定路径
     */
    public static void storeFile(MultipartFile file, String path, String name) throws IOException {
        File directory = new File(path);
        if (!directory.exists()){
            directory.mkdirs();  // 使用mkdirs()以确保创建多层目录
        }
        // 使用原始文件名进行存储
        String fileName = name == null ? file.getOriginalFilename() : name;
        Path targetPath = new File(directory, fileName).toPath();

        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
    }
    public static void storeFile(MultipartFile file, String path) throws IOException {
        storeFile(file, path, null);
    }

    public static Boolean storeFileLocal(String strBuffer, String filePath) {
        try
        {
            // 创建文件对象
            File fileText = new File(filePath);
            // 向文件写入对象写入信息
            FileWriter fileWriter = new FileWriter(fileText);
            // 写文件
            fileWriter.write(strBuffer);
            // 关闭
            fileWriter.close();
            return true;
        }
        catch (IOException e)
        {
            //
            e.printStackTrace();
            return false;
        }
    }

    public static String buildGnssDataString(List<GnssData> gnssDataList) {
        StringBuilder out = new StringBuilder("x,y,z\n");
        for(GnssData gnssData:gnssDataList) {
            out.append(gnssData.getXMove()).append(",")
                    .append(gnssData.getYMove()).append(",")
                    .append(gnssData.getZMove()).append("\n");
        }
        return out.toString();
    }

    public static String buildInclinoDataString(List<InclinometerData> inclinometerDataList) {
        StringBuilder out = new StringBuilder("x1,y1,x2,y2,x3,y3,x4,y4,x5,y5,x6,y6\n");
        for(InclinometerData inclinometerData:inclinometerDataList) {
            out.append(inclinometerData.getTopMove()).append(",").append(inclinometerData.getMiddleMove()).append(",")
                    .append(inclinometerData.getBottomMove()).append(",").append(inclinometerData.getTopMovePerDay()).append(",")
                    .append(inclinometerData.getMiddleMovePerDay()).append(",")
                    .append(inclinometerData.getBottomMovePerDay()).append(",").append("\n");
        }
        return out.toString();
    }

    public static String buildManoDataString(List<ManometerData> manometerDataList) {
        StringBuilder out = new StringBuilder("pressure1,pressure2,pressure3,pressure4,pressure5,pressure6\n");
        for(ManometerData manometerData:manometerDataList) {
//            out.append(manometerData.getPressure1()).append(",").append(manometerData.getPressure2()).append(",")
//                    .append(manometerData.getPressure3()).append(",").append(manometerData.getPressure4()).append(",")
//                    .append(manometerData.getPressure5()).append(",").append(manometerData.getPressure6()).append("\n");
            out.append(manometerData.getFrequency()).append(",").append(manometerData.getTemperature()).append(",")
                    .append(manometerData.getHeight()).append("\n");
        }
        return out.toString();
    }

    public static String buildStressDataString(List<StressPileData> stressPileDataList) {
        StringBuilder out = new StringBuilder(
                        "horizontal_stress1,vertical_stress1,horizontal_stress2,vertical_stress2," +
                        "horizontal_stress3,vertical_stress3,horizontal_stress4,vertical_stress4," +
                        "horizontal_stress5,vertical_stress5,horizontal_stress6,vertical_stress6\n");
        for(StressPileData stressPileData:stressPileDataList) {
//            out.append(stressPileData.getHorizontal_stress1()).append(",").append(stressPileData.getVertical_stress1()).append(",")
//                    .append(stressPileData.getHorizontal_stress2()).append(",").append(stressPileData.getVertical_stress2()).append(",")
//                    .append(stressPileData.getHorizontal_stress3()).append(",").append(stressPileData.getVertical_stress3()).append(",")
//                    .append(stressPileData.getHorizontal_stress4()).append(",").append(stressPileData.getVertical_stress4()).append(",")
//                    .append(stressPileData.getHorizontal_stress5()).append(",").append(stressPileData.getVertical_stress5()).append(",")
//                    .append(stressPileData.getHorizontal_stress6()).append(",").append(stressPileData.getVertical_stress6()).append("\n");
            out.append(stressPileData.getBottomPower()).append(",").append(stressPileData.getBottomAngle()).append(",")
                    .append(stressPileData.getBottomChange()).append(",").append(stressPileData.getMiddlePower()).append(",")
                    .append(stressPileData.getMiddleAngle()).append(",").append(stressPileData.getMiddleChange()).append(",")
                    .append(stressPileData.getTopAngle()).append(",").append(stressPileData.getTopPower()).append(",")
                    .append(stressPileData.getTopChange()).append(",").append("\n");
        }
        String outStr = out.toString();
        return outStr.substring(0, outStr.length()-1);
    }
}
