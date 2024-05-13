package com.johnny.bank.utils;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.ProcessCmdOutput;
import com.johnny.bank.model.configuration.MultiIndexPath;
import com.johnny.bank.model.node.ModelNode;
import com.johnny.bank.model.node.TaskNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.utils
 * @className: ProcessUtil
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/29 9:10
 * @version: 1.0
 */
@Slf4j
@Component
public class ProcessUtil {

    //    static String pythonDir = "C:/nhri/monitor/pythonDir/";

    @Autowired
    private MultiIndexPath multiIndexPath;

    static String outsideModelDir = "D:/zhuomian/水科院/python/";
    //    static String pythonDir = "/home/zym/python/";
    static String pythonStr = "python";

//    static String condaStr = "conda activate multiIndex &&";
    static String condaStr = "conda activate Env1 &&";

//    static String pythonStr = "python3";

    public static Process cmdShp2Pgsql(List<String> commands) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder();
        processBuilder.command(commands);
        return processBuilder.start();
    }

    public static Process buildTaskNodeProcess(TaskNode taskNode) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        ModelNode modelNode = taskNode.getModelNode();
        JSONObject modelUsage = modelNode.getUsage();
        commands.add((String) modelUsage.get("exePrefix"));
        commands.add(taskNode.getModelNode().getProgram());
        List<String> paramKeys = (List<String>) modelUsage.get("paramKeys");
        JSONObject paramObject = taskNode.getParamNode().getParams();
        for(String paramKey: paramKeys) {
            commands.add((String) paramObject.get(paramKey));
        }
        processBuilder.command(commands);
        return processBuilder.start();
    }

    // 岸坡因子计算
    public static Process buildSectionTaskNodeProcess(
            TaskNode taskNode, String multiIndexDataPath, String multiIndexResPath
    ) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add(condaStr);

        ModelNode modelNode = taskNode.getModelNode();
        JSONObject modelUsage = modelNode.getUsage();
        commands.add((String) modelUsage.get("exePrefix"));
        commands.add(taskNode.getModelNode().getProgram());
        List<String> paramKeys = (List<String>) modelUsage.get("paramKeys");
        JSONObject paramObject = taskNode.getParamNode().getParams();
        for(String paramKey: paramKeys) {
            commands.add(paramObject.get(paramKey).toString());
        }
        commands.add(multiIndexDataPath);
        commands.add(multiIndexResPath);
        String pyCmdStr = String.join(" ", commands);
        System.out.printf(pyCmdStr);
        processBuilder.command("cmd.exe", "/c", pyCmdStr);
        return processBuilder.start();
    }

    // 其他因子计算
    public static Process buildOtherIndexTaskNodeProcess(
            TaskNode taskNode, String fullJsonPath
    ) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add(condaStr);
        ModelNode modelNode = taskNode.getModelNode();
        JSONObject modelUsage = modelNode.getUsage();
        commands.add((String) modelUsage.get("exePrefix"));
        commands.add(taskNode.getModelNode().getProgram());
        List<String> paramKeys = (List<String>) modelUsage.get("paramKeys");
        JSONObject paramObject = taskNode.getParamNode().getParams();
        commands.add(fullJsonPath);
        for(String paramKey: paramKeys) {
            if(Objects.equals(paramKey, "jsonId")) continue;
            commands.add(paramObject.get(paramKey).toString());
        }
        String cmdStr = String.join(" ", commands);
        log.info(cmdStr);
        processBuilder.command("cmd", "/c", cmdStr);
        return processBuilder.start();
    }

    public static Process buildMapTileServiceProcess(String worldTilePath, String nodeServicePath) throws Exception {
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add("node");
        commands.add(nodeServicePath);
        commands.add(worldTilePath);
        processBuilder.command(commands);
        System.out.println(processBuilder);

        return processBuilder.start();
    }

    public static void logProcessOutput(InputStream inputStream) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, Charset.forName("GBK")));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
            System.out.println("-end");
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                inputStream.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static ProcessCmdOutput getProcessCmdOutput(InputStream inputStream) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, Charset.forName("GBK")));
            StringBuilder cmdOutput = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
                cmdOutput.append(line);
            }
            System.out.println("-end");
            return ProcessCmdOutput.ok(cmdOutput.toString());
        } catch (IOException e) {
//            log.info(exceptionInfo);
            return ProcessCmdOutput.error(e);
        } finally {
            try {
                inputStream.close();
            } catch (IOException e) {
                log.info(e.getMessage(), e.toString());
            }
        }
    }

    public static Process saveSectionValue(String tempPath, String rasterPath, JSONArray jsonArray, String resultPath) throws IOException {
        BufferedWriter out = null;
        try {
            out = new BufferedWriter(new FileWriter(tempPath));
            out.write(rasterPath + "\n");
            out.write(resultPath + "\n");
            out.write(jsonArray.size() + "\n");
            for(int i = 0; i < jsonArray.size(); i++) {
                out.write(jsonArray.getObject(i, JSONArray.class).getString(0) + "," + jsonArray.getObject(i, JSONArray.class).getString(1) + "\n");
            }
            out.flush();
            out.close();
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        log.info(pythonStr + " " + outsideModelDir + "section.py " + tempPath);
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add(pythonStr);
        commands.add(outsideModelDir + "section.py");
        commands.add(tempPath);
        processBuilder.command(commands);
        return processBuilder.start();
    }

    public static Process savaSectionContrast(String tempPath, List<String> rasterPathList, JSONArray jsonArray, String resultPath) throws IOException {
        BufferedWriter out = null;
        try {
            out = new BufferedWriter(new FileWriter(tempPath));
            out.write(rasterPathList.size() + "\n");
            for(String path : rasterPathList) {
                out.write(path + "\n");
            }
            out.write(resultPath + "\n");
            out.write(jsonArray.size() + "\n");
            for(int i = 0; i < jsonArray.size(); i++) {
                out.write(jsonArray.getObject(i, JSONArray.class).getString(0) + "," + jsonArray.getObject(i, JSONArray.class).getString(1) + "\n");
            }
            out.close();
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add(pythonStr);
        commands.add(outsideModelDir + "SectionContrast.py");
        commands.add(tempPath);
        processBuilder.command(commands);
        return processBuilder.start();
    }

    public static Process sectionFlush(String tempPath, String benchmarkPath, String referPath, String demPath, JSONArray jsonArray, String resultPath) throws IOException {
        BufferedWriter out = null;
        try {
            out = new BufferedWriter(new FileWriter(tempPath));
            out.write(benchmarkPath + "\n");
            out.write(referPath + "\n");
            out.write(demPath + "\n");
            out.write(resultPath + "\n");
            out.write(jsonArray.size() + "\n");
            for(int i = 0; i < jsonArray.size(); i++) {
                out.write(jsonArray.getObject(i, JSONArray.class).getString(0) + "," + jsonArray.getObject(i, JSONArray.class).getString(1) + "\n");
            }
            out.close();
        } catch (Exception e) {
            log.error(e.getMessage());

        }
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add(pythonStr);
        commands.add(outsideModelDir + "section_flush.py");
        commands.add(tempPath);
        processBuilder.command(commands);
        return processBuilder.start();
    }

    public static Process computeVolume(String tempPath, double deep, String rasterPath, String resultPath, String visualPath, JSONArray jsonArray, String volumePath, String coorPath) throws IOException {
        BufferedWriter out = null;
        try {
            out = new BufferedWriter(new FileWriter(tempPath));
            out.write(deep + "\n");
            out.write(jsonArray.getJSONArray(0).size() - 1 + "\n");
            for(int i = 0; i < jsonArray.getJSONArray(0).size() - 1; i++) {
                out.write(jsonArray.getJSONArray(0).getJSONArray(i).getString(0) + "," + jsonArray.getJSONArray(0).getJSONArray(i).getString(1) + "\n");
            }
            out.write(rasterPath + "\n");
            out.write(resultPath + "\n");
            out.write(visualPath + "\n");
            out.write(volumePath + "\n");
            out.write(coorPath + "\n");
            out.close();

        } catch (Exception e) {
            log.error(e.getMessage());
        }
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add(pythonStr);
        commands.add(outsideModelDir + "compute_volume.py");
        commands.add(tempPath);
        processBuilder.command(commands);
        return processBuilder.start();
    }

    public static Process rasterCrop(String tempPath, String rasterPath, String outputPng, String outputTif, String outputJson, JSONArray jsonArray) throws IOException {
        BufferedWriter out = null;
        try {
            out = new BufferedWriter(new FileWriter(tempPath));
            out.write(rasterPath + "\n");
            out.write(outputPng + "\n");
            out.write(outputJson + "\n");
            out.write(outputTif + "\n");
            out.write(jsonArray.getJSONArray(0).size() - 1 + "\n");
            for(int i = 0; i < jsonArray.getJSONArray(0).size() - 1; i++) {
                out.write(jsonArray.getJSONArray(0).getJSONArray(i).getString(0) + "," + jsonArray.getJSONArray(0).getJSONArray(i).getString(1) + "\n");
            }
            out.close();
        } catch (Exception e) {
            log.error(e.getMessage());

        }
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add(pythonStr);
        commands.add(outsideModelDir + "raster_clip.py");
        commands.add(tempPath);
        processBuilder.command(commands);
        return processBuilder.start();

    }
}
