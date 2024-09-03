package com.johnny.bank.controller.node;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.controller.node.base.BaseNodeController;
import com.johnny.bank.jobs.QuartzSchedulerManager;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.service.node.impl.TaskNodeServiceV2;
import org.quartz.SchedulerException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/19 10:23
 * @Description:
 */

@RestController
@RequestMapping("api/v2/taskNode")
public class TaskNodeControllerV2 extends BaseNodeController<TaskNode> {

    @DeleteMapping("delete/{id}")
    public ResponseEntity<String> deleteTaskNodeById(@PathVariable String id) {
        return ResponseEntity.ok(((TaskNodeServiceV2) nodeServiceImpl).deleteById(id));
    }

    @DeleteMapping("delete/all")
    public ResponseEntity<String> deleteAllTaskNode() throws SchedulerException {
        String deleteAllStatus = ((TaskNodeServiceV2) nodeServiceImpl).deleteAll();
        return ResponseEntity.ok(deleteAllStatus);
    }

    @PostMapping("start/numeric/hydrodynamic/real")
    public ResponseEntity<String> calRealHydrodynamic(
            @RequestParam("info") String paramObj, @RequestParam("fort.13") MultipartFile fort13,
            @RequestParam("fort.14") MultipartFile fort14, @RequestParam("fort.15") MultipartFile fort15,
            @RequestParam("fort.19") MultipartFile fort19, @RequestParam("fort.20") MultipartFile fort20
    ) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calRealHydrodynamic(
                JSONObject.parseObject(paramObj), fort13, fort14, fort15, fort19, fort20);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/numeric/hydrodynamic")
    public ResponseEntity<String> calHydrodynamic(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calHydrodynamic(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/numeric/getFlowFieldVelocities")
    public ResponseEntity<String> getFlowFieldVelocities(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).getFlowFieldVelocities(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/numeric/getFlowFieldVelocity")
    public ResponseEntity<String> getFlowFieldVelocity(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).getFlowFieldVelocity(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/riverbedEvolution/calculateRegionFlush")
    public ResponseEntity<String> calculateRegionFlush(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateRegionFlush(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/riverbedEvolution/calculateSectionView")
    public ResponseEntity<String> calculateSectionView(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateSectionView(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/riverbedEvolution/calculateSectionContrast")
    public ResponseEntity<String> calculateSectionContrast(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateSectionContrast(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/riverbedEvolution/calculateRiverVolume")
    public ResponseEntity<String> calculateRiverVolume(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateRiverVolume(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/riverbedEvolution/calculateRegionContour")
    public ResponseEntity<String> calculateRegionContour(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateRegionContour(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/multipleIndicators/calculateRiskLevel")
    public ResponseEntity<String> calculateRiskLevel(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateRiskLevel(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/multipleIndicators/calculateSoilComposition")
    public ResponseEntity<String> calculateSoilComposition(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateSoilComposition(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/multipleIndicators/calculateSlopeProtection")
    public ResponseEntity<String> calculateSlopeProtection(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateSlopeProtection(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/multipleIndicators/calculateLoadControl")
    public ResponseEntity<String> calculateLoadControl(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateLoadControl(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/multipleIndicators/calculateHeightDifference")
    public ResponseEntity<String> calculateHeightDifference(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateHeightDifference(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/multipleIndicators/calculateSlopeRate")
    public ResponseEntity<String> calculateSlopeRate(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateSlopeRate(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/multipleIndicators/calculateNearshoreFlush")
    public ResponseEntity<String> calculateNearshoreFlush(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateNearshoreFlush(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/multipleIndicators/calculateFlowEquivalent")
    public ResponseEntity<String> calculateFlowEquivalent(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateFlowEquivalent(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/multipleIndicators/calculateAntiImpactSpeed")
    public ResponseEntity<String> calculateAntiImpactSpeed(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateAntiImpactSpeed(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/multipleIndicators/calculateWaterLevelFluctuation")
    public ResponseEntity<String> calculateWaterLevelFluctuation(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateWaterLevelFluctuation(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @PostMapping("start/erosionModel/calculateBSTEM")
    public ResponseEntity<String> calculateBSTEM(@RequestBody JSONObject paramObj) throws Exception {
        String taskNodeId = ((TaskNodeServiceV2) nodeServiceImpl).calculateBSTEM(paramObj);
        return ResponseEntity.ok(taskNodeId);
    }

    @GetMapping("/status/id")
    public ResponseEntity<String> findStatusById(@RequestParam String taskId) {
        return ResponseEntity.ok((nodeServiceImpl.findById(taskId)).getStatus());
    }

    @GetMapping("/result/id")
    public ResponseEntity<JSONObject> findTaskNodeById(@RequestParam String taskId) {
        return ResponseEntity.ok(((TaskNodeServiceV2) nodeServiceImpl).getResultById(taskId));
    }
}
