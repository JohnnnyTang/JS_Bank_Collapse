package com.johnny.bank.service.node.impl;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.ProcessCmdOutput;
import com.johnny.bank.model.configuration.MultiIndexPath;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.node.ModelNode;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.model.resource.dataResource.GeoJsonData;
import com.johnny.bank.model.resource.dataResource.SectionLineInfo;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.nodeRepo.IModelNodeRepo;
import com.johnny.bank.repository.nodeRepo.IParamNodeRepo;
import com.johnny.bank.repository.nodeRepo.ITaskNodeRepo;
import com.johnny.bank.repository.resourceRepo.MapRepo.IVectorTileRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.IGeoJsonDataRepo;
import com.johnny.bank.utils.ProcessUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

/**
 * @Author: Johnny Tang
 * @Date: 2023/12/21
 * @Description:
 */
@Service("TaskNodeService")
@Slf4j
public class TaskNodeService extends NodeService<TaskNode> {
    private IDataNodeRepo dataNodeRepo;
    private IModelNodeRepo modelNodeRepo;
    private IParamNodeRepo paramNodeRepo;
    private MultiIndexPath multiIndexPath;
    private IGeoJsonDataRepo geoJsonDataRepo;
    private IVectorTileRepo vectorTileRepo;


    @Autowired
//    @Qualifier("BaseNodeRepo")
    public void setBaseNodeRepo(ITaskNodeRepo IBaseNodeRepo) {
        this.IBaseNodeRepo = IBaseNodeRepo;
    }

    @Override
    public String save(TaskNode taskNode) {
        if(taskNode.getDataNode() != null && taskNode.getDataNode().getId() != null) {
            Optional<DataNode> dataNode = dataNodeRepo.findById(taskNode.getDataNode().getId());
            taskNode.setDataNode(dataNode.orElse(null));
        } else taskNode.setDataNode(null);

        if(taskNode.getModelNode().getId() != null) {
            Optional<ModelNode> modelNode = modelNodeRepo.findById(taskNode.getModelNode().getId());
            taskNode.setModelNode(modelNode.orElse(null));
        } else taskNode.setModelNode(null);

        if(taskNode.getParamNode().getId() != null) {
            Optional<ParamNode> paramNode = paramNodeRepo.findById(taskNode.getParamNode().getId());
            taskNode.setParamNode(paramNode.orElse(null));
        }
        else {
            ParamNode newParamNode = taskNode.getParamNode();
            newParamNode = paramNodeRepo.save(newParamNode);
            log.info(newParamNode.toString());
            taskNode.setParamNode(newParamNode);
        }
        // TODO: 没有的话创建paramNode

        return IBaseNodeRepo.save(taskNode).getId();
    }

    public Boolean updateNodeStatusById(String id, String status) {
        ((ITaskNodeRepo)IBaseNodeRepo).updateTaskNodeStatusById(id, status);
        return true;
    }

    public void updateNodeStatusResultById(String id, String status, JSONObject result) {
        ((ITaskNodeRepo)IBaseNodeRepo).updateTaskNodeStatusResultById(id, status, result);
    }

    public List<TaskNode> getAutoTaskNode() {
        return ((ITaskNodeRepo)IBaseNodeRepo).getAutoTaskNodeItem();
    }

    public List<TaskNode> getManualTaskNode() {
        return ((ITaskNodeRepo)IBaseNodeRepo).getNoAutoTaskNodeItem();
    }

//    public TaskNode queryById(String id) {
//        return ((ITaskNodeRepo)IBaseNodeRepo).queryById(id);
//    }

    public String createAndStartNewTask(TaskNode taskNode) throws Exception {
        String nodeId = save(taskNode);
        taskNode = IBaseNodeRepo.findById(nodeId).orElse(null);
        if(taskNode == null) {
            return null;
        } else {
            switch (taskNode.getModelNode().getId()) {
                case "65b78631028eca632d0afae2":
                    new CmdOutputTaskThread(taskNode).start();
                    break;
                case "662a2dafdcbfea190d03b033":
                    new SectionIndexTaskThread(taskNode).start();
                    break;
                case "662a3c0e69037b3a4d26df1c":
                case "662a427276ff9b32ec9053e5":
                case "662a4521ddd45f65873eb067":
                    new OtherMultiIndexTaskThread(taskNode).start();
                    break;
                default:
                    throw new Exception("Not found this model");
            }
        }
        return nodeId;
    }

    public String createAndStartSectionDefaultMultiIndexTask(
            Integer sectionId, String beforeTime, String afterTime,
            List<Double> startPt, List<Double> endPt
    ) throws Exception {
        String datePattern = "\\d{4}-\\d{2}-\\d{2}";
        ParamNode paramNode = paramNodeRepo.findParamNodeById("6642da4b010453003d568646");
//        ParamNode paramNode = paramNodeRepo.findParamNodeById("662d1deaca8e246ea1290189");
        paramNode.setId(null);
        SectionLineInfo sectionLineInfo;
        if(sectionId != null) {
            sectionLineInfo = vectorTileRepo.selectSectionLineInfoById(sectionId);
            if(sectionLineInfo == null) return null;
        }
        else {
            sectionLineInfo = SectionLineInfo.builder()
                    .id((int) System.currentTimeMillis()).stX(startPt.get(0)).stY(startPt.get(1))
                    .endX(endPt.get(0)).endY(endPt.get(1)).label("cus-"+System.currentTimeMillis())
                    .name("cus-"+System.currentTimeMillis()).build();
        }
        paramNode.getParams().put("x1", sectionLineInfo.getStX());
        paramNode.getParams().put("y1", sectionLineInfo.getStY());
        paramNode.getParams().put("x2", sectionLineInfo.getEndX());
        paramNode.getParams().put("y2", sectionLineInfo.getEndY());
        String paramName = paramNode.getName() + '-' + System.currentTimeMillis();
        if(beforeTime != null && Pattern.matches(datePattern, beforeTime)) {
            log.info("date pattern valid");
            paramNode.getParams().put("beforeDate", beforeTime);
            paramName += ("_beg" + beforeTime);
        }
        if(afterTime != null && Pattern.matches(datePattern, afterTime)) {
            log.info("date pattern valid");
            paramNode.getParams().put("currentDate", afterTime);
            paramName += ("_end" + afterTime);
        }
        paramNode.setName(paramName);
        paramNode = paramNodeRepo.save(paramNode);
        ModelNode modelNode = ModelNode.modelNodeBuilder().id("6642d247010453003d568641").build();
        JSONObject resObj = new JSONObject();
        resObj.put("resultString", "");
        resObj.put("resJsonId", "");
        TaskNode taskNode = TaskNode.taskNodeBuilder()
                .paramNode(paramNode).modelNode(modelNode).dataNode(null).status("0")
                .result(resObj).ifAuto(false).name("multiWhole-fixedSection"+sectionLineInfo.getId())
                .category("multiIndexWholeTaskItem").path(",taskNode,multiIndexWholeTaskGroup,").auth("all").build();
        String taskId = save(taskNode);
        new MultiIndexWholeTaskThread(taskNode, sectionLineInfo, beforeTime, afterTime).start();
        return taskId;
    }

    @Autowired
    public void setDataNodeRepo(IDataNodeRepo dataNodeRepo) {
        this.dataNodeRepo = dataNodeRepo;
    }

    @Autowired
    public void setModelNodeRepo(IModelNodeRepo modelNodeRepo) {
        this.modelNodeRepo = modelNodeRepo;
    }

    @Autowired
    public void setParamNodeRepo(IParamNodeRepo paramNodeRepo) {
        this.paramNodeRepo = paramNodeRepo;
    }

    @Autowired
    public void setMultiIndexPath(MultiIndexPath multiIndexPath) {
        this.multiIndexPath = multiIndexPath;
    }

    @Qualifier("GeoJsonDataRepo")
    @Autowired
    public void setGeoJsonDataRepo(IGeoJsonDataRepo geoJsonDataRepo) {
        this.geoJsonDataRepo = geoJsonDataRepo;
    }

    @Qualifier("VectorTileRepo")
    @Autowired
    public void setVectorTileRepo(IVectorTileRepo iVectorTileRepo) {
        this.vectorTileRepo = iVectorTileRepo;
    }

    public class CmdOutputTaskThread extends Thread {
        TaskNode taskNode;

        public CmdOutputTaskThread(TaskNode taskNode) {
            this.taskNode = taskNode;
        }

        @Override
        public void run() {
            try {
                updateNodeStatusById(taskNode.getId(), "1");
                Process process = ProcessUtil.buildTaskNodeProcess(taskNode);
                ProcessCmdOutput cmdOutput = ProcessUtil.getProcessCmdOutput(process.getInputStream());
                log.info(cmdOutput.toString());
                if(cmdOutput.getStatusCode() == 0) {
//                    taskNode.setStatus("-1");
                    updateNodeStatusById(taskNode.getId(), "-1");
                }
                int code = process.waitFor();
                process.destroy();
                if(code == 0) {
//                    taskNode.setStatus("1");
                    JSONObject result = new JSONObject();
                    result.put("resultString", cmdOutput.getOutputString());
                    updateNodeStatusResultById(taskNode.getId(), "2", result);
//                    taskNode.getResult().put("resultString", cmdOutput.getOutputString());
                }
                else {
                    updateNodeStatusById(taskNode.getId(), "-1");
                }
            } catch (IOException | InterruptedException e) {
                throw new RuntimeException(e);
            }
            log.info("running custom Thread");
        }
    }

    public class SectionIndexTaskThread extends Thread {
        TaskNode taskNode;

        public SectionIndexTaskThread(TaskNode taskNode) {
            this.taskNode = taskNode;
        }

        @Override
        public void run() {
            try {
                updateNodeStatusById(taskNode.getId(), "1");
                String fullJsonResPath = multiIndexPath.getResPath() + taskNode.getId() + ".json";
                Process process = ProcessUtil.buildSectionTaskNodeProcess(
                        taskNode, multiIndexPath.getDataPath(), fullJsonResPath, multiIndexPath.getCondaEnv()
                );
                ProcessCmdOutput cmdOutput = ProcessUtil.getProcessCmdOutput(process.getInputStream());
                log.info(cmdOutput.toString());
                if(cmdOutput.getStatusCode() == 0) {
                    updateNodeStatusById(taskNode.getId(), "-1");
                }
                int code = process.waitFor();
                process.destroy();
                if(code == 0) {
                    JSONObject result = new JSONObject();
                    result.put("resultString", cmdOutput.getOutputString());
                    result.put("resJsonId", taskNode.getId());
                    File resJson = new File(fullJsonResPath);
                    if (resJson.exists()) {
                        updateNodeStatusResultById(taskNode.getId(), "2", result);
                        GeoJsonData geoJsonData = GeoJsonData.geojsonBuilder()
                                .id(taskNode.getId()).path(fullJsonResPath).type("geojson").name("multiRes")
                                .build();
                        geoJsonDataRepo.insertData(geoJsonData);
                    }
                    else {
                        updateNodeStatusResultById(taskNode.getId(), "-2", result);
                    }
                }
                else {
                    updateNodeStatusById(taskNode.getId(), "-1");
                }
            } catch (IOException | InterruptedException e) {
                throw new RuntimeException(e);
            }
            log.info("running custom Thread");
        }
    }

    public class OtherMultiIndexTaskThread extends Thread {
        TaskNode taskNode;

        public OtherMultiIndexTaskThread(TaskNode taskNode) {
            this.taskNode = taskNode;
        }

        @Override
        public void run() {
            try {
                updateNodeStatusById(taskNode.getId(), "1");
                String fullJsonPath = geoJsonDataRepo.findById(
                        (String) taskNode.getParamNode().getParams().get("jsonId")
                ).getPath();

                Process process = ProcessUtil.buildOtherIndexTaskNodeProcess(
                        taskNode, fullJsonPath, multiIndexPath.getCondaEnv()
                );
                ProcessCmdOutput cmdOutput = ProcessUtil.getProcessCmdOutput(process.getInputStream());
                log.info(cmdOutput.toString());
                if(cmdOutput.getStatusCode() == 0) {
//                    taskNode.setStatus("-1");
                    updateNodeStatusById(taskNode.getId(), "-1");
                }
                int code = process.waitFor();
                process.destroy();
                if(code == 0) {
//                    taskNode.setStatus("1");
                    JSONObject result = new JSONObject();
                    result.put("resultString", cmdOutput.getOutputString());
                    result.put("resJsonId", taskNode.getParamNode().getParams().get("jsonId"));
                    updateNodeStatusResultById(taskNode.getId(), "2", result);
//                    taskNode.getResult().put("resultString", cmdOutput.getOutputString());
                }
                else {
                    updateNodeStatusById(taskNode.getId(), "-1");
                }
            } catch (IOException | InterruptedException e) {
                throw new RuntimeException(e);
            }
            log.info("running custom Thread");
        }
    }

    public class MultiIndexWholeTaskThread extends Thread {
        TaskNode taskNode;
        SectionLineInfo sectionLineInfo;
        String begTime;
        String endTime;

        public MultiIndexWholeTaskThread(
                TaskNode taskNode, SectionLineInfo sectionLineInfo, String beforeTime, String afterTime
        ) {
            this.taskNode = taskNode;
            this.sectionLineInfo = sectionLineInfo;
            this.begTime = beforeTime;
            this.endTime = afterTime;
        }

        @Override
        public void run() {
            try {
                updateNodeStatusById(taskNode.getId(), "1");
                String fullJsonResPath =
                        multiIndexPath.getResPath() + "fixedSection-" +
                        sectionLineInfo.getName();
                if(begTime != null) {
                    fullJsonResPath += ("_beg" + begTime);
                }
                if(endTime != null) {
                    fullJsonResPath += ("_end" + endTime);
                }
                fullJsonResPath += ("-" + System.currentTimeMillis() + ".json");
                Process process = ProcessUtil.buildSectionTaskNodeProcess(
                        taskNode, multiIndexPath.getWholeDataPath(), fullJsonResPath, multiIndexPath.getCondaEnv()
                );
                ProcessCmdOutput cmdOutput = ProcessUtil.getProcessCmdOutput(process.getInputStream());
                log.info(cmdOutput.toString());
                if(cmdOutput.getStatusCode() == 0) {
                    updateNodeStatusById(taskNode.getId(), "-1");
                }
                int code = process.waitFor();
                process.destroy();
                if(code == 0) {
                    JSONObject result = new JSONObject();
                    result.put("resultString", cmdOutput.getOutputString());
                    result.put("resJsonId", taskNode.getId());
                    File resJson = new File(fullJsonResPath);
                    if (resJson.exists()) {
                        String geoJsonName = "multiWholeRes-" + sectionLineInfo.getName();
                        if(begTime != null) {
                            geoJsonName += ("_beg" + begTime);
                        }
                        if(endTime != null) {
                            geoJsonName += ("_end" + endTime);
                        }
                        updateNodeStatusResultById(taskNode.getId(), "2", result);
                        GeoJsonData geoJsonData = GeoJsonData.geojsonBuilder()
                                .id(taskNode.getId()).path(fullJsonResPath).type("geojson")
                                .name(geoJsonName)
                                .createTime(new Timestamp(System.currentTimeMillis()))
                                .build();
                        geoJsonDataRepo.insertData(geoJsonData);
                    }
                    else {
                        updateNodeStatusResultById(taskNode.getId(), "-2", result);
                    }
                }
                else {
                    updateNodeStatusById(taskNode.getId(), "-1");
                }
            } catch (IOException | InterruptedException e) {
                throw new RuntimeException(e);
            }
            log.info("running custom Thread");
        }
    }
}
