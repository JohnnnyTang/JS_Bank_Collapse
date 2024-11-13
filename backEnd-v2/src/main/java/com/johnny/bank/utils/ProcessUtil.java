package com.johnny.bank.utils;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.ProcessCmdOutput;
import com.johnny.bank.model.node.ModelNode;
import com.johnny.bank.model.node.TaskNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
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

    static String outsideModelDir = "D:/zhuomian/水科院/python/";
    //    static String pythonDir = "/home/zym/python/";
    static String pythonStr = "python";

//    static String condaStr = "conda activate multiIndex &&";
    static String condaStr = (System.getProperties().getProperty("os.name").toLowerCase().contains("win"))? "conda activate " : "source miniconda3/bin/activate ";

    static Boolean ifSystemWin = System.getProperties().getProperty("os.name").toLowerCase().contains("win");

    static String sysCmdExeStr = (System.getProperties().getProperty("os.name").toLowerCase().contains("win"))? "cmd.exe":"bash";
    static String sysLinkStr = (System.getProperties().getProperty("os.name").toLowerCase().contains("win"))? "/c":"-c";


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
            TaskNode taskNode, String multiIndexDataPath, String multiIndexResPath, String condaEnv
    ) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add(condaStr + condaEnv + " &&");

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
        processBuilder.command(sysCmdExeStr, sysLinkStr, pyCmdStr);
        return processBuilder.start();
    }

    // 其他因子计算
    public static Process buildOtherIndexTaskNodeProcess(
            TaskNode taskNode, String fullJsonPath, String condaEnv
    ) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add(condaStr + condaEnv + " &&");
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
        processBuilder.command(sysCmdExeStr, sysLinkStr, cmdStr);
        return processBuilder.start();
    }

    public static Process buildMapTileServiceProcess(String worldTilePath, String nodeServicePath) throws Exception {
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add("node");
        commands.add(nodeServicePath);
        commands.add(worldTilePath);
//        String test = "node E:/Data/bankProjectData/node/index.js E:/Data/bankProjectData/baseMap";
        processBuilder.command(commands);
//        processBuilder.command(test);
//        processBuilder.command("cmd.exe","/c","node","E:/Data/bankProjectData/node/index.js","E:/Data/bankProjectData/baseMap");
        System.out.println(processBuilder);
        return processBuilder.start();
    }

    public static Process buildOutSideModelServiceProcess2(TaskNode taskNode, String condaEnv) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add(sysCmdExeStr);
        commands.add(sysLinkStr);
        commands.add(condaStr + condaEnv + " &&");
        ModelNode modelNode = taskNode.getModelNode();
        JSONObject modelUsage = modelNode.getUsage();
        commands.add((String) modelUsage.get("exePrefix"));
        commands.add(taskNode.getModelNode().getProgram());
        List<String> paramKeys = (List<String>) modelUsage.get("paramKeys");
        JSONObject paramObject = taskNode.getParamNode().getParams();
        for(String paramKey: paramKeys) {
            System.out.println(paramKey);
            if(Objects.equals(paramKey, "jsonId")) continue;
            commands.add(paramObject.get(paramKey).toString());
        }
        processBuilder.command(commands);
        System.out.println(commands);
        processBuilder.inheritIO(); // 继承标准输入输出
        return processBuilder.start();
    }

    public static Process buildOutSideModelServiceProcess(TaskNode taskNode, String condaEnv) throws IOException {
        ProcessBuilder processBuilder = new ProcessBuilder();
        List<String> commands = new ArrayList<>();
        commands.add(sysCmdExeStr);
        commands.add(sysLinkStr);

        ModelNode modelNode = taskNode.getModelNode();
        JSONObject modelUsage = modelNode.getUsage();
        String exePrefix = (String) modelUsage.get("exePrefix");
        String program = taskNode.getModelNode().getProgram();

        List<String> paramKeys = (List<String>) modelUsage.get("paramKeys");
        JSONObject paramObject = taskNode.getParamNode().getParams();

        StringBuilder commandBuilder = new StringBuilder();
        commandBuilder.append(condaStr).append(condaEnv).append(" && ")
                .append(exePrefix).append(" ").append(program);

        for (String paramKey : paramKeys) {
            if (!Objects.equals(paramKey, "jsonId")) {
                commandBuilder.append(" ").append(paramObject.get(paramKey).toString());
            }
        }

        commands.add(commandBuilder.toString());
        processBuilder.command(commands);
        System.out.println(commands);
        processBuilder.inheritIO(); // 继承标准输入输出
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
}
