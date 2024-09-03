package com.johnny.bank.service.node.impl;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.jobs.QuartzSchedulerManager;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.node.ModelNode;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.nodeRepo.IModelNodeRepo;
import com.johnny.bank.repository.nodeRepo.IParamNodeRepo;
import com.johnny.bank.repository.nodeRepo.ITaskNodeRepo;
import com.johnny.bank.utils.ProcessUtilV2;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/19 18:04
 * @Description:
 */

@Service("TaskNodeServiceV2")
@Slf4j
@Primary
public class TaskNodeServiceV2 extends NodeService<TaskNode> {

    @Value("${modelServer.url}")
    String MODEL_SERVER_URL;

    @Value("${modelServer.storageLimit}")
    Integer STORAGE_LIMIT;

    @Value("${modelServer.caseLimit}")
    Integer CASE_LIMIT;

    private IDataNodeRepo dataNodeRepo;
    private IModelNodeRepo modelNodeRepo;
    private IParamNodeRepo paramNodeRepo;
    private final Map<String, String> numericModelNodeCollection;
    private final Map<String, String> numericParamNodeCollection;
    private final Map<String, String> riverBedEvolutionModelNodeCollection;
    private final Map<String, String> riverBedEvolutionParamNodeCollection;
    private final Map<String, String> multipleIndicatorsModelNodeCollection;
    private final Map<String, String> multipleIndicatorsParamNodeCollection;
    private final Map<String, String> soilErosionModelCollection;
    private final Map<String, String> soilErosionParamCollection;

    @Autowired
    private QuartzSchedulerManager quartzSchedulerManager;
    @Autowired
    public void setBaseNodeRepo(ITaskNodeRepo IBaseNodeRepo) {
        this.IBaseNodeRepo = IBaseNodeRepo;
    }
    @Autowired
    public void setParamNodeRepo(IParamNodeRepo paramNodeRepo) {
        this.paramNodeRepo = paramNodeRepo;
    }
    @Autowired
    public void setModelNodeRepo(IModelNodeRepo modelNodeRepo) {
        this.modelNodeRepo = modelNodeRepo;
    }
    @Autowired
    public void setModelNodeRepo(IDataNodeRepo dataNodeRepo) {
        this.dataNodeRepo = dataNodeRepo;
    }

    public TaskNodeServiceV2() {
        // 数值模型
        numericModelNodeCollection = Map.of(
                "calculateHydrodynamic", "66a06b4e7a3c330cb6ff84ff",
                "getFlowFieldVelocities","66a07bca71c68c4cea8c9767",
                "getFlowFieldVelocity","66a0b5a5a72d42473f2442c3",
                "calculateRealHydrodynamic", "66cf190d7965ee56bc04ebf9"
        );
        numericParamNodeCollection = Map.of(
                "calculateHydrodynamic","66a06ef372c7d048fbb68287",
                "getFlowFieldVelocities","66a0a82871c68c4cea8c9768",
                "getFlowFieldVelocity","66a0b5bea72d42473f2442c4",
                "calculateRealHydrodynamic","66cf1a4b7965ee56bc04ebfa"
        );
        // 河床演变
        riverBedEvolutionModelNodeCollection = Map.of(
                "calculateRegionFlush","66a0f41480be980205e35dfd",
                "calculateSectionView","66a0f5d5154c745cc602a754",
                "calculateSectionContrast","66a0f7cd99966471736fa10e",
                "calculateRiverVolume","66a0f97144b56d6fe30bb591",
                "calculateRegionContour","66a0fb6881930a7d7a136a18"
        );
        riverBedEvolutionParamNodeCollection = Map.of(
                "calculateRegionFlush","66a0f45380be980205e35dfe",
                "calculateSectionView","66a0f614154c745cc602a755",
                "calculateSectionContrast","66a0f7f599966471736fa10f",
                "calculateRiverVolume","66a0f9ac44b56d6fe30bb592",
                "calculateRegionContour","66a0fba681930a7d7a136a19"
        );
        // 多指标
        multipleIndicatorsModelNodeCollection = Map.of(
                "calculateRiskLevel","66a6f45584931b5a824d93b3",
                "calculateSoilComposition","66a7032d15dceb0949bebb1f",
                "calculateSlopeProtection","66a71d245a037459edeb2533",
                "calculateLoadControl","66a71e6a9c68c05424594e68",
                "calculateHeightDifference","66a71f94f63be26594c8bd22",
                "calculateSlopeRate","66a7207703ed2c575ba889cc",
                "calculateNearshoreFlush","66a721b7b59771626b16eaf2",
                "calculateFlowEquivalent","66a722b60ef9a2111d513603",
                "calculateAntiImpactSpeed","66a7240646d6a8415b5a4d6a",
                "calculateWaterLevelFluctuation","66a7257346974a1fb552124e"
        );
        multipleIndicatorsParamNodeCollection = Map.of(
                "calculateRiskLevel","66a6fe2b84931b5a824d93b7",
                "calculateSoilComposition","66a7037615dceb0949bebb20",
                "calculateSlopeProtection","66a71d425a037459edeb2534",
                "calculateLoadControl","66a71eab9c68c05424594e69",
                "calculateHeightDifference","66a71fabf63be26594c8bd23",
                "calculateSlopeRate","66a7209503ed2c575ba889cd",
                "calculateNearshoreFlush","66a721c1b59771626b16eaf3",
                "calculateFlowEquivalent","66a722bd0ef9a2111d513604",
                "calculateAntiImpactSpeed","66a7241246d6a8415b5a4d6b",
                "calculateWaterLevelFluctuation","66a7259f46974a1fb552124f"
        );
        soilErosionModelCollection = Map.of(
                "calculateBSTEM","66ade169cb34b50d7075f69b"
        );
        soilErosionParamCollection = Map.of(
                "calculateBSTEM","66ade45ccb34b50d7075f69d"
        );
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

    public String deletePreparing() throws SchedulerException {
        modelServerSerialization();
        quartzSchedulerManager.startModelCaseDeletePreparingJob();
        if (!quartzSchedulerManager.isJobExist("modelCaseDeletePreparingJob", "modelDeleteGroup")) {
            return "LOCKED";
        } else {
            return "UNLOCKED";
        }
    }

    public String deleteById(String id) {
        TaskNode taskNode = IBaseNodeRepo.findById(id).orElse(null);
        if (taskNode == null) return "TaskNode不存在！";
        try {
            ProcessUtilV2.deleteModelCaseById(MODEL_SERVER_URL, taskNode.getCaseId());
        } catch (Exception e) {

        }
        ParamNode paramNode = taskNode.getParamNode();
        if (paramNode == null) return "该TaskNode无法删除！";
        paramNodeRepo.deleteById(paramNode.getId());
        IBaseNodeRepo.deleteById(taskNode.getId());
        return "TaskNode删除成功！";
    }

    public String deleteAll() throws SchedulerException {
        String deletePreparingStatus = deletePreparing();
        if (deletePreparingStatus.equals("LOCKED")) {
            return deletePreparingStatus;
        } else {
            List<TaskNode> taskNodeList = IBaseNodeRepo.findAll();
            for (TaskNode taskNode : taskNodeList) {
                deleteById(taskNode.getId());
            }
            return  "DELETED ALL";
        }
    }

    public void updateNodeStatusById(String id, String status) {
        ((ITaskNodeRepo)IBaseNodeRepo).updateTaskNodeStatusById(id, status);
    }

    public void updateNodeStatusResultById(String id, String status, JSONObject result) {
        ((ITaskNodeRepo)IBaseNodeRepo).updateTaskNodeStatusResultById(id, status, result);
    }

    public void updateTaskNodeResultById(String id, JSONObject result) {
        ((ITaskNodeRepo)IBaseNodeRepo).updateTaskNodeResultById(id, result);
    }

    public void updateNodeUpdateTimeById(String id, LocalDateTime updateTime) {
        ((ITaskNodeRepo)IBaseNodeRepo).updateNodeUpdateTimeById(id, updateTime);
    }

    public List<TaskNode> getSingleTaskNodeByCaseId(String caseId) {
        return ((ITaskNodeRepo)IBaseNodeRepo).getTaskNodeItemByCaseId(caseId);
    }

    // 获取输出结果，若结果为error则将taskid删除并返回错误日志
    public JSONObject getResultById(String id) {
        TaskNode taskNode = IBaseNodeRepo.findById(id).orElse(null);
        if (taskNode == null) return new JSONObject();
        if (taskNode.getStatus().equals("ERROR") || taskNode.getStatus().equals("NONE")) {
            // 获取所有错误任务并全部删除
            List<String> precedingErrorCases = ProcessUtilV2.getPrecedingErrorCases(MODEL_SERVER_URL,taskNode.getCaseId());
            for (String errorCaseId : precedingErrorCases) {
                List<TaskNode> errorTaskNodes = ((ITaskNodeRepo)IBaseNodeRepo).getTaskNodeItemByCaseId(errorCaseId);
                for (TaskNode errorTaskNode : errorTaskNodes) {
                    deleteById(errorTaskNode.getId());
                }
            }
        }
        return taskNode.getResult();
    }

    // 判断是否需要进行内存清理(HandShake1)
    public boolean checkModelServerStorage(Integer storageLimit, Integer CaseLimit) {
        if (ProcessUtilV2.getModelServerDiskUsage(MODEL_SERVER_URL) > storageLimit) {
            // 执行模型服务内存清理工作（删除非常用case）
            List<String> desertedCases = ProcessUtilV2.getModelServerUnusedCases(MODEL_SERVER_URL, CaseLimit);
            for (String caseId : desertedCases) {
                List<TaskNode> taskNodeList = ((ITaskNodeRepo) IBaseNodeRepo).getTaskNodeItemByCaseId(caseId);
                for (TaskNode taskNode : taskNodeList) {
                    deleteById(taskNode.getId());
                }
            }
        }
        return ProcessUtilV2.getModelServerDiskUsage(MODEL_SERVER_URL) <= storageLimit;
    }

    // 资源树与模型计算容器对齐工作(HandShake2)
    public void modelServerSerialization() throws SchedulerException {
        List<String> caseIds = ProcessUtilV2.getModelServerCases(MODEL_SERVER_URL);
        if (caseIds == null) return;
        Optional<ModelNode> serializationModelNode = modelNodeRepo.findById("66ab45e5d481ef22a5545c3b"); // 获取对齐所用modelNode
        assert serializationModelNode.orElse(null) != null;
        for (String caseId : caseIds) {
            List<TaskNode> taskNodeList = ((ITaskNodeRepo)IBaseNodeRepo).getTaskNodeItemByCaseId(caseId);
            if (taskNodeList.isEmpty()) {
                TaskNode serializationTaskNode = TaskNode.taskNodeBuilder()
                        .paramNode(null).modelNode(null).dataNode(null).status("NONE").caseId(caseId)
                        .modelNode(serializationModelNode.orElse(null))
                        .result(null).ifAuto(true).name(null).updateTime(LocalDateTime.now())
                        .category("ModelServerSerialization").path(",taskNode,ModelServerSerializationGroup,")
                        .auth("all").build();
                ParamNode serializationParamNode = paramNodeRepo.findParamNodeById("66ab98c3ac742f3fe0987401"); //获取对齐所用paramNode
                serializationParamNode.setId(null);
                String serializationParamNodeName = serializationParamNode.getName() + '-' + System.currentTimeMillis();
                serializationParamNode.setName(serializationParamNodeName);
                paramNodeRepo.save(serializationParamNode);
                serializationTaskNode.setParamNode(serializationParamNode);
                String modelName = ProcessUtilV2.getModelTaskRes(MODEL_SERVER_URL,serializationTaskNode).getString("model");
                serializationTaskNode.setName(modelName+"-"+System.currentTimeMillis());
                save(serializationTaskNode);
                // 对齐taskNode进行轮询工作
                quartzSchedulerManager.startModelTaskStatusJob(serializationTaskNode);
            }
        }
    }

    private TaskNode createAndStartModelTask(String modelNodeId, String paramNodeId, JSONObject paramObj, Optional<List<MultipartFile>> optionalFileList) throws SchedulerException {
        Optional<ModelNode> modelNode = modelNodeRepo.findById(modelNodeId);
        assert modelNode.orElse(null) != null;
        ParamNode paramNode = paramNodeRepo.findParamNodeById(paramNodeId);
        paramNode.setId(null);
        // 将传入参数对应到paramNode中的Params中
        for (String key : paramObj.keySet()) {
            Object param = paramObj.get(key);
            if (param != null) {
                paramNode.getParams().put(key, param);
            }
        }
        String paramName = paramNode.getName() + '-' + System.currentTimeMillis();
        paramNode.setName(paramName);
        TaskNode taskNodeRun = TaskNode.taskNodeBuilder()
                .paramNode(paramNode).modelNode(modelNode.orElse(null)).dataNode(null).status("NONE")
                .result(null).ifAuto(false).name(modelNode.orElse(null).getName()+"-"+System.currentTimeMillis()).updateTime(LocalDateTime.now())
                .category(modelNode.orElse(null).getCategory()).path(",taskNode,"+modelNode.orElse(null).getName()+"Group,")
                .auth("all").build();
        // 启动任务并返回caseId
        String caseId = ProcessUtilV2.runModelTaskService(MODEL_SERVER_URL, taskNodeRun, optionalFileList);
        // temp
        if (caseId.equals("WRONG")) {
            taskNodeRun.setCaseId("WRONG");
            return taskNodeRun;
        }
        // 根据caseId查询是否已有taskNode
        List<TaskNode> taskNodeList = getSingleTaskNodeByCaseId(caseId);
        if (taskNodeList.isEmpty()) {
            taskNodeRun.setCaseId(caseId);
            // 挂新的taskNode
            paramNode = paramNodeRepo.save(paramNode);
            taskNodeRun.setParamNode(paramNode);
            save(taskNodeRun);
            // 开启不断查询查询任务状态
            quartzSchedulerManager.startModelTaskStatusJob(taskNodeRun);
            return taskNodeRun;
        } else {
            TaskNode taskNodeBefore = taskNodeList.get(taskNodeList.size()-1);
            updateNodeUpdateTimeById(taskNodeBefore.getId(),LocalDateTime.now());
            return taskNodeBefore;
        }
    }

    // 数值模型计算——真实计算水动力模型
    public String calRealHydrodynamic(
            JSONObject paramObj, MultipartFile fort13, MultipartFile fort14,
            MultipartFile fort15, MultipartFile fort19, MultipartFile fort20) throws SchedulerException {
//        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
//            return "系统内存不足无法计算！请清理系统内存";
//        }
        List<MultipartFile> fileList = new ArrayList<>();
        fileList.add(fort13);fileList.add(fort14);fileList.add(fort15);fileList.add(fort19);fileList.add(fort20);
        Optional<List<MultipartFile>> optionalFileList = Optional.of(fileList);
        TaskNode taskNode = createAndStartModelTask(
                numericModelNodeCollection.get("calculateRealHydrodynamic"),numericParamNodeCollection.get("calculateRealHydrodynamic"), paramObj, optionalFileList
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }


    // 数值模型计算——计算水动力（33中选一并计算流场）
    public String calHydrodynamic(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                numericModelNodeCollection.get("calculateHydrodynamic"),numericParamNodeCollection.get("calculateHydrodynamic"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }
    // 数值模型计算——获取多点流速
    public String getFlowFieldVelocities(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                numericModelNodeCollection.get("getFlowFieldVelocities"),numericParamNodeCollection.get("getFlowFieldVelocities"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }
    // 数值模型计算——获取单点流速
    public String getFlowFieldVelocity(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                numericModelNodeCollection.get("getFlowFieldVelocity"),numericParamNodeCollection.get("getFlowFieldVelocity"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 河床演变模型计算——计算区域冲淤
    public String calculateRegionFlush(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                riverBedEvolutionModelNodeCollection.get("calculateRegionFlush"),riverBedEvolutionParamNodeCollection.get("calculateRegionFlush"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }
    // 河床演变模型计算——计算断面形态
    public String calculateSectionView(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                riverBedEvolutionModelNodeCollection.get("calculateSectionView"),riverBedEvolutionParamNodeCollection.get("calculateSectionView"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }
    // 河床演变模型计算——计算断面比较
    public String calculateSectionContrast(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                riverBedEvolutionModelNodeCollection.get("calculateSectionContrast"),riverBedEvolutionParamNodeCollection.get("calculateSectionContrast"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }
    // 河床演变模型计算——河道容积计算
    public String calculateRiverVolume(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                riverBedEvolutionModelNodeCollection.get("calculateRiverVolume"),riverBedEvolutionParamNodeCollection.get("calculateRiverVolume"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }
    // 河床演变模型计算——河道等深线计算
    public String calculateRegionContour(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                riverBedEvolutionModelNodeCollection.get("calculateRegionContour"),riverBedEvolutionParamNodeCollection.get("calculateRegionContour"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 多指标风险模型计算——综合计算
    public String calculateRiskLevel(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                multipleIndicatorsModelNodeCollection.get("calculateRiskLevel"),multipleIndicatorsParamNodeCollection.get("calculateRiskLevel"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 多指标风险模型计算——SoilComposition
    public String calculateSoilComposition(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                multipleIndicatorsModelNodeCollection.get("calculateSoilComposition"),multipleIndicatorsParamNodeCollection.get("calculateSoilComposition"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 多指标风险模型计算——SlopeProtection
    public String calculateSlopeProtection(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                multipleIndicatorsModelNodeCollection.get("calculateSlopeProtection"),multipleIndicatorsParamNodeCollection.get("calculateSlopeProtection"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 多指标风险模型计算——LoadControl
    public String calculateLoadControl(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                multipleIndicatorsModelNodeCollection.get("calculateLoadControl"),multipleIndicatorsParamNodeCollection.get("calculateLoadControl"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 多指标风险模型计算——HeightDifference
    public String calculateHeightDifference(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                multipleIndicatorsModelNodeCollection.get("calculateHeightDifference"),multipleIndicatorsParamNodeCollection.get("calculateHeightDifference"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 多指标风险模型计算——SlopeRate
    public String calculateSlopeRate(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                multipleIndicatorsModelNodeCollection.get("calculateSlopeRate"),multipleIndicatorsParamNodeCollection.get("calculateSlopeRate"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 多指标风险模型计算——NearshoreFlush
    public String calculateNearshoreFlush(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                multipleIndicatorsModelNodeCollection.get("calculateNearshoreFlush"),multipleIndicatorsParamNodeCollection.get("calculateNearshoreFlush"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 多指标风险模型计算——FlowEquivalent
    public String calculateFlowEquivalent(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                multipleIndicatorsModelNodeCollection.get("calculateFlowEquivalent"),multipleIndicatorsParamNodeCollection.get("calculateFlowEquivalent"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 多指标风险模型计算——Anti-ImpactSpeed
    public String calculateAntiImpactSpeed(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                multipleIndicatorsModelNodeCollection.get("calculateAntiImpactSpeed"),multipleIndicatorsParamNodeCollection.get("calculateAntiImpactSpeed"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 多指标风险模型计算——Water-LevelFluctuation
    public String calculateWaterLevelFluctuation(JSONObject paramObj) throws SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                multipleIndicatorsModelNodeCollection.get("calculateWaterLevelFluctuation"),multipleIndicatorsParamNodeCollection.get("calculateWaterLevelFluctuation"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

    // 土体变形分析模型——calculateBSTEM
    public String calculateBSTEM(JSONObject paramObj) throws  SchedulerException {
        if (!checkModelServerStorage(STORAGE_LIMIT, CASE_LIMIT)) {
            return "系统内存不足无法计算！请清理系统内存";
        }
        TaskNode taskNode = createAndStartModelTask(
                soilErosionModelCollection.get("calculateBSTEM"),soilErosionParamCollection.get("calculateBSTEM"), paramObj, Optional.empty()
        );
        if (taskNode.getCaseId().equals("WRONG")) {
            return "WRONG";
        } else {
            return taskNode.getId();
        }
//        return taskNode.getId();
    }

}
