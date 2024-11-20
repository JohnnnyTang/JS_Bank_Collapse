package com.johnny.bank.utils;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.config.DataSourceConfig;
import com.johnny.bank.model.ProcessCmdOutput;
import com.johnny.bank.model.common.DefaultDatasource;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.node.ModelNode;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.service.node.impl.*;
import com.sun.media.jai.opimage.PatternRIF;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/9/6 11:19
 * @Description:
 */

@Component
@Slf4j
public class VectorUtil {

    @Value("${staticData.vectorDataPath}")
    private String vectorDataPathValue;

    @Value("${multiIndex.condaEnv}")
    private String condaEnvValue;

    @Autowired
    @Qualifier("defaultDatasource")
    private DefaultDatasource defaultDatasourceValue;

    private static String vectorDataPath;

    private static String condaEnv;

    private static DefaultDatasource defaultDatasource;

    private static final String category = "OutsideModelNodeItem";
    private static final String name = "vector2pg";

    @PostConstruct
    public void init() {
        vectorDataPath = vectorDataPathValue;
        condaEnv = condaEnvValue;
        defaultDatasource = defaultDatasourceValue;
    }

    private static String name2tableName(String bank, String name) {
        return bank.toLowerCase()+"_"+NameUtil.convertCamelCaseToSnakeCase(name);
    }

    private static String section2tableName(String bank, String name) {
        return bank.toLowerCase()+"_"+"section";
    }

    public static DataNodeV2 vector2DataNode(String bank, JSONObject info) {
        String tileName = info.getString("name");
        String tableName = name2tableName(bank, tileName);
        JSONObject usage = new JSONObject();
        usage.put("password", defaultDatasource.getPassword());
        usage.put("userName", defaultDatasource.getUsername());
        usage.put("tableName",tableName);
        JSONObject basicInfo = new JSONObject();
        basicInfo.put("tileName", tileName); basicInfo.put("tableName", tableName); basicInfo.put("type", info.getString("type"));
        if (info.containsKey("fields")) {
            basicInfo.put("fields", List.of(info.getString("fields").split(",")));
        } else {
            basicInfo.put("fields", List.of());
        }
        return DataNodeV2.dataNodeBuilder()
                .bank(bank).auth("all").name(tileName).category("VectorDataItem")
                .apiPrefix(defaultDatasource.getUrl())
                .usage(usage).basicInfo(basicInfo)
                .path(",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",VisualizationDataGroupOf"+bank+",VectorDataGroupOf"+bank+",")
                .build();
    }

    public static DataNodeV2 section2DataNode(String bank, JSONObject info) {
        String dataName = info.getString("name");
        String tableName = section2tableName(bank, dataName);
        JSONObject usage = new JSONObject();
        usage.put("password", defaultDatasource.getPassword());
        usage.put("userName", defaultDatasource.getUsername());
        usage.put("tableName",tableName);
        JSONObject basicInfo = new JSONObject();
        basicInfo.put("tableName", tableName);
        basicInfo.put("fileType",info.getString("fileType"));
        basicInfo.put("year",info.getString("year"));
        basicInfo.put("month",info.getString("month"));
        basicInfo.put("set",info.getString("set"));
        basicInfo.put("type","section");
        basicInfo.put("segment",bank);
        basicInfo.put("path", vectorDataPath + File.separator + dataName);
        basicInfo.put("calculate","1");
        basicInfo.put("visualization","2");
        return DataNodeV2.dataNodeBuilder()
                .bank(bank).auth("all").name(info.getString("name")).category("SectionDataItem")
                .apiPrefix(defaultDatasource.getUrl())
                .usage(usage).basicInfo(basicInfo)
                .path(",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",SectionDataGroupOf"+bank+",")
                .build();
    }

    public static Boolean updateTableName(String bank, String oldTileName, String tileName) {
        String oldName = name2tableName(bank, oldTileName);
        String newName = name2tableName(bank, tileName);
        String renameSQL = "ALTER TABLE " + oldName + " RENAME TO " + newName;
        try (Connection conn = DriverManager.getConnection(defaultDatasource.getUrl(), defaultDatasource.getUsername(), defaultDatasource.getPassword());
             Statement stmt = conn.createStatement()) {
            stmt.execute(renameSQL);
            log.info("Table " + newName + " renamed successfully.");
            return true;
        } catch (SQLException e) {
            log.info("Table " + newName + " renamed wrongly.");
            return false;
        }
    }

    public static Boolean deletePgVector(String tableName) {
        String deleteSQL = "DROP TABLE IF EXISTS " + tableName;
        try (Connection conn = DriverManager.getConnection(defaultDatasource.getUrl(), defaultDatasource.getUsername(), defaultDatasource.getPassword());
             Statement stmt = conn.createStatement()) {
            stmt.execute(deleteSQL);
            log.info("Table " + tableName + " dropped successfully.");
            return true;
        } catch (SQLException e) {
            log.info("Table " + tableName + " dropped wrongly.");
            return false;
        }
    }

    public static Boolean shpVector2pg(MultipartFile srcFile, JSONObject info, String bank) throws IOException, InterruptedException {
//        String originBasicName = srcFile.getOriginalFilename().substring(0, srcFile.getOriginalFilename().lastIndexOf("."));
        String tileName = info.getString("name");
        String tableName = name2tableName(bank, tileName);
        boolean forCal = false;
        if (info.get("type").equals("section")) {
            tableName = section2tableName(bank, tileName);
            forCal = true;
        }
        String vectorFilePath = vectorDataPath + File.separator + srcFile.getOriginalFilename();
        File vectorFile = new File(vectorFilePath);
        srcFile.transferTo(vectorFile);
        List<String> list;
        if (info.get("type").equals("section")){
            list = ZipUtil.unZipFiles(vectorFile, vectorFilePath.split("\\.")[0]);
        }else {
            list = ZipUtil.unZipFiles(vectorFile, vectorDataPath);
        }
        vectorFile.delete();
        String shpPath = "";
        for (String fileName : list) {
            if (fileName.endsWith(".shp")) {
                System.out.println(fileName);
                shpPath = fileName;
                break;
            }
        }
        String timestampStr = String.valueOf(System.currentTimeMillis());
        ModelNodeService modelNodeService = BeanUtil.getBean(ModelNodeService.class);
        ParamNodeService paramNodeService = BeanUtil.getBean(ParamNodeService.class);
        TaskNodeService taskNodeService = BeanUtil.getBean(TaskNodeService.class);
        ModelNode modelNode = modelNodeService.findByCategoryAndName(category, name);
        TaskNode taskNode = TaskNode.taskNodeBuilder()
                .modelNode(modelNode).name(modelNode.getName()+"-"+timestampStr)
                .ifAuto(true).updateTime(LocalDateTime.now()).status("START")
                .category("vector2pgModelTaskItem").path(",taskNode,calcModelTaskGroup,vector2pgModelTaskGroup")
                .auth("all").build();
        ParamNode paramNode = paramNodeService.findByCategoryAndName("Vector2pgModelParamItem","vector2pgModelParam");
        paramNode.setId(null);
        paramNode.setName(paramNode.getName()+"-"+timestampStr);
        JSONObject params = paramNode.getParams();
        params.put("filePath", shpPath); params.put("finalTableName", tableName); params.put("dbname", defaultDatasource.getDatabase());
        params.put("user",defaultDatasource.getUsername()); params.put("password", defaultDatasource.getPassword());
        params.put("host",defaultDatasource.getIp()); params.put("port", defaultDatasource.getPort()); params.put("forCal", forCal);
        paramNode.setParams(params);
        paramNodeService.save(paramNode);
        taskNode.setParamNode(paramNode);
        String taskNodeId = taskNodeService.save(taskNode);
        paramNodeService.save(paramNode);

        Process cmdProcess = ProcessUtil.buildOutSideModelServiceProcess(taskNode, condaEnv);
        ProcessCmdOutput cmdOutput = ProcessUtil.getProcessCmdOutput(cmdProcess.getInputStream());
        if(cmdOutput.getStatusCode() == 0) {
            log.info("shpVector2pg service start wrong");
            //update taskNode status
            taskNodeService.updateNodeStatusById(taskNodeId, "ERROR");
        }
        int code = cmdProcess.waitFor();
        System.out.println("code:" + code);

        InputStream errorStream = cmdProcess.getErrorStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(errorStream));
        String line;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
        cmdProcess.destroy();
        if (code == 0) {
            //update taskNode status
            taskNodeService.updateNodeStatusById(taskNodeId, "COMPLETE");
            log.info("vector2pg service end successfully");
            return true;
        }
        else {
            //update taskNode status
            taskNodeService.updateNodeStatusById(taskNodeId, "ERROR");
            log.info("shpVector2pg service end error");
            return false;
        }
    }
}
