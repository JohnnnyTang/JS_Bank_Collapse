package com.johnny.bank.utils;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.ProcessCmdOutput;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.node.ModelNode;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.service.node.impl.*;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.mapping.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
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

    private static String vectorDataPath;

    private static String condaEnv;

    private static final String category = "OutsideModelNodeItem";
    private static final String name = "vector2pg";

    @PostConstruct
    public void init() {
        vectorDataPath = vectorDataPathValue;
        condaEnv = condaEnvValue;
    }

    public static void shpVector2pg(MultipartFile srcFile, JSONObject info, String bank) throws IOException, InterruptedException {
        String originBasicName = srcFile.getOriginalFilename().substring(0, srcFile.getOriginalFilename().lastIndexOf("."));
        String vectorFilePath = vectorDataPath + File.separator + srcFile.getOriginalFilename();
        File vectorFile = new File(vectorFilePath);
        srcFile.transferTo(vectorFile);
        List<String> list;
        list = ZipUtil.unZipFiles(vectorFile, vectorDataPath);
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
        DataNodeServiceV2 dataNodeServiceV2 = BeanUtil.getBean(DataNodeServiceV2.class);
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
        params.put("filePath", shpPath);
        params.put("finalTableName", originBasicName);
        params.put("columns",info.getString("columns"));
        params.put("dbname", "test");params.put("user","postgres");params.put("password", "123456");params.put("host","127.0.0.1");params.put("port", "5432");
        paramNode.setParams(params);
        paramNodeService.save(paramNode);
        taskNode.setParamNode(paramNode);
        String taskNodeId = taskNodeService.save(taskNode);
        paramNodeService.save(paramNode);

        Process cmdProcess = ProcessUtil.buildShpVector2pgServiceProcess(taskNode, condaEnv);
        ProcessCmdOutput cmdOutput = ProcessUtil.getProcessCmdOutput(cmdProcess.getInputStream());
        if(cmdOutput.getStatusCode() == 0) {
            System.out.println("shpVector2pg service start wrong");
            //update taskNode status
            taskNodeService.updateNodeStatusById(taskNodeId, "ERROR");
        }
        int code = cmdProcess.waitFor();
        cmdProcess.destroy();
        if (code == 0) {
            System.out.println("vector2pg service end");
            JSONObject usage = new JSONObject();
            usage.put("password", "123456");
            usage.put("userName","postgres");
            usage.put("tableName",originBasicName);
            DataNodeV2 dataNode = DataNodeV2.dataNodeBuilder()
                    .bank(bank).auth("all").name(originBasicName).category("VectorDataItem")
                    .apiPrefix("jdbc:postgresql://127.0.0.1:5432/test?stringtype=unspecified")
                    .usage(usage)
                    .path(",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",VisualizationDataGroupOf"+bank+",VectorDataGroupOf"+bank+",")
                    .build();
            DataNodeV2 dataNodeBefore = dataNodeServiceV2.getDataNodeByCategoryBankName(dataNode.getCategory(),dataNode.getBank(),dataNode.getName());
            // 若资源重复，则删除后重新挂载资源
            if (dataNodeBefore != null) {
                dataNodeServiceV2.delete(dataNodeBefore.getId());
            }
            dataNodeServiceV2.save(dataNode);

            //update taskNode status
            taskNodeService.updateNodeStatusById(taskNodeId, "COMPLETE");
        }
        else {
            System.out.println("shpVector2pg service end error");
            //update taskNode status
            taskNodeService.updateNodeStatusById(taskNodeId, "ERROR");
        }
    }
}
