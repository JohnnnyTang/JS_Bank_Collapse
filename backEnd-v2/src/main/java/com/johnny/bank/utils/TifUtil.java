package com.johnny.bank.utils;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.ProcessCmdOutput;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.node.impl.ModelNodeService;
import com.johnny.bank.service.node.impl.ParamNodeService;
import com.johnny.bank.service.node.impl.TaskNodeService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.FileSystemUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Steven Da
 * @Date: 2024/08/18/19:07
 * @Description:
 */
@Component
@Slf4j
public class TifUtil {

    @Value("${staticData.tifTilePath}")
    private String tifTilePathValue;

    @Value("${staticData.draftDataPath}")
    private String draftDataPathValue;

    @Value("${multiIndex.condaEnv}")
    private String condaEnvValue;

    private static String tifTilePath;
    private static String condaEnv;
    private static String draftDataPath;

    private static final String category = "OutsideModelNodeItem";
    private static final String Tif2Tile_name = "tif2tile_nongradation";
    private static final String Txt2Tif_name = "txt2tif";

    @PostConstruct
    public void init() {
        tifTilePath = tifTilePathValue;
        condaEnv = condaEnvValue;
        draftDataPath = draftDataPathValue;
    }

    public static String txt2tif(MultipartFile txtFile, JSONObject info, String bank) throws IOException, InterruptedException {
        String name = info.getString("name");
        String tempFolderPath = draftDataPath + File.separator + "temp";
        String sourceFolderPath = draftDataPath + File.separator + "source";
        String sourceDataPath = sourceFolderPath + File.separator + name + ".txt";
        String tifFolderPath = draftDataPath + File.separator + "tif" + File.separator + bank + File.separator + name;

        FileUtil.storeFile(txtFile, sourceFolderPath);

        // 创建txt转tif的数据节点
        ModelNodeService modelNodeService = BeanUtil.getBean(ModelNodeService.class);
        ParamNodeService paramNodeService = BeanUtil.getBean(ParamNodeService.class);
        TaskNodeService taskNodeService = BeanUtil.getBean(TaskNodeService.class);

        String timestampStr = String.valueOf(System.currentTimeMillis());

        ParamNode paramNode = paramNodeService.findByCategoryAndName("Tif2tileModelParamItem", "tif2tileModelParam");
        JSONObject params = paramNode.getParams();
        params.put("out_prefix", tifFolderPath);
        params.put("middle_prefix", tempFolderPath);
        params.put("in_prefix", sourceFolderPath);
        params.put("name", name);

        ParamNode paramNode_new = ParamNode.paramNodeBuilder()
                .modelId(paramNode.getModelId()).params(params)
                .name(paramNode.getName() + "-" + timestampStr)
                .auth(paramNode.getAuth()).path(paramNode.getPath())
                .build();
        paramNodeService.save(paramNode_new);

        TaskNode taskNode = TaskNode.taskNodeBuilder()
                .modelNode(modelNodeService.findByCategoryAndName(category, Txt2Tif_name))
                .paramNode(paramNode_new)
                .status("START").ifAuto(false).category("Txt2tifModelTaskItem")
                .path(",taskNode,calcModelTaskGroup,txt2tifModelTaskGroup").name("txt2tifModelTask-" + timestampStr)
                .build();

        String taskNodeId = taskNodeService.save(taskNode);

        Process cmdProcess = ProcessUtil.buildOutSideModelServiceProcess(taskNode, condaEnv);
        ProcessCmdOutput cmdOutput = ProcessUtil.getProcessCmdOutput(cmdProcess.getInputStream());
        if(cmdOutput.getStatusCode() == 0) {
            System.out.println("tif2tile service start wrong");
            //update taskNode status
            taskNodeService.updateNodeStatusById(taskNodeId, "ERROR");
        }
        int code = cmdProcess.waitFor();
        cmdProcess.destroy();
        if (code == 0) {
            System.out.println("txt2tif service end");
            //update taskNode status
            taskNodeService.updateNodeStatusById(taskNodeId, "COMPLETE");
        }
        else {
            System.out.println("txt2tif service end error");
            //update taskNode status
            taskNodeService.updateNodeStatusById(taskNodeId, "ERROR");
        }
        FileUtil.deleteFolder(new File(sourceDataPath));
        return tifFolderPath;
    }

    public static void tif2tile(MultipartFile srcFile, String bank) throws IOException, InterruptedException {

        String originBasicName = srcFile.getOriginalFilename().substring(0, srcFile.getOriginalFilename().lastIndexOf("."));
        String tempFolderPath = tifTilePath + File.separator + "temp" + File.separator + originBasicName;
        String tempFilePath = tempFolderPath + File.separator + srcFile.getOriginalFilename();
        String tileFolderPath = tifTilePath + File.separator + "tile" + File.separator + bank + File.separator + "DEM" + File.separator + originBasicName;
        String relativeTileFolderPath = File.separator + "tile" + File.separator + bank + File.separator + "DEM" + File.separator + originBasicName;

        System.out.println(tempFolderPath);

        File tempFile = new File(tempFilePath);
        File tileFolder = new File(tileFolderPath);
        if(!tempFile.exists()){
            tempFile.mkdirs();
        }
        if(!tileFolder.exists()){
            tileFolder.mkdirs();
        }

        // M2F
        srcFile.transferTo(tempFile);

        List<String> list;
        list = ZipUtil.unZipFiles(tempFile, tempFolderPath);
        String filePath = "";
        for (String fileName : list) {
            if (fileName.endsWith(".tif")) {
                System.out.println(fileName);
                filePath = fileName;
                break;
            }
        }

        // 创建切瓦片的Node
        DataNodeServiceV2 dataNodeServiceV2 = BeanUtil.getBean(DataNodeServiceV2.class);
        ModelNodeService modelNodeService = BeanUtil.getBean(ModelNodeService.class);
        ParamNodeService paramNodeService = BeanUtil.getBean(ParamNodeService.class);
        TaskNodeService taskNodeService = BeanUtil.getBean(TaskNodeService.class);

        String timestampStr = String.valueOf(System.currentTimeMillis());

        ParamNode paramNode = paramNodeService.findByCategoryAndName("Tif2tileModelParamItem", "tif2tileModelParam");
        JSONObject params = paramNode.getParams();
        params.put("tifPath", filePath);
        params.put("tilesPath", tileFolderPath);
        params.put("zoom", "1-14");
        params.put("tileSize", "256");

        ParamNode paramNode_new = ParamNode.paramNodeBuilder()
                .modelId(paramNode.getModelId()).params(params)
                .name(paramNode.getName() + "-" + timestampStr)
                .auth(paramNode.getAuth()).path(paramNode.getPath())
                .build();
        paramNodeService.save(paramNode_new);

        TaskNode taskNode = TaskNode.taskNodeBuilder()
                .modelNode(modelNodeService.findByCategoryAndName(category, Tif2Tile_name))
                .paramNode(paramNode_new)
                .status("START").ifAuto(false).category("Tif2tileModelTaskItem")
                .path(",taskNode,calcModelTaskGroup,tif2tileModelTaskGroup").name("tif2tileModelTask-" + timestampStr)
                .build();

        String taskNodeId = taskNodeService.save(taskNode);

        Process cmdProcess = ProcessUtil.buildOutSideModelServiceProcess(taskNode, condaEnv);
        ProcessCmdOutput cmdOutput = ProcessUtil.getProcessCmdOutput(cmdProcess.getInputStream());
        if(cmdOutput.getStatusCode() == 0) {
            System.out.println("tif2tile service start wrong");
            //update taskNode status
            taskNodeService.updateNodeStatusById(taskNodeId, "ERROR");
        }
        int code = cmdProcess.waitFor();
        cmdProcess.destroy();
        if (code == 0) {
            System.out.println("tile service end");
            JSONObject usage = new JSONObject();
            usage.put("path", relativeTileFolderPath);
            DataNodeV2 dataNode = DataNodeV2.dataNodeBuilder()
                    .bank(bank).auth("all").name(originBasicName).category("DEMTileDataItem")
                    .usage(usage).dataOrigin("Local")
                    .path(",DataNodeHead,"+bank+"BankNode,StaticDataGroupOf"+bank+",VisualizationDataGroupOf"+bank+",DEMTileDataGroupOf"+bank+",")
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
            System.out.println("tif2tile service end error");
            //update taskNode status
            taskNodeService.updateNodeStatusById(taskNodeId, "ERROR");
        }
        //删除temp子文件夹
        FileSystemUtils.deleteRecursively(new File(tempFolderPath));
    }
}
