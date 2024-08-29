package com.johnny.bank.utils;

import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.node.ModelNode;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.model.node.TaskNode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/7/18 17:02
 * @Description:
 */

@Slf4j
@Component
public class ProcessUtilV2 {

    // 模型服务运行
    public static String runModelTaskService(String modelServerUrl, TaskNode taskNode, Optional<List<MultipartFile>> optionalFileList) {
        ModelNode modelNode = taskNode.getModelNode();
        JSONObject modelUsage = modelNode.getUsage();
        String modelRunApi = modelServerUrl + modelUsage.getJSONObject("api").getJSONObject("run").getString("url");
        String modelRunType = modelUsage.getJSONObject("api").getJSONObject("run").getString("type");
        ParamNode paramNode = taskNode.getParamNode();
        JSONObject modelRunApiBody = paramNode.getParams();
        JSONObject response;
        if (modelRunType.equals("post")) {
            if (optionalFileList.isPresent()) {
                response = JSONObject.parseObject(InternetUtil.doPost_Hydro(modelRunApi, optionalFileList, modelRunApiBody));
            } else {
                response = JSONObject.parseObject(InternetUtil.doPost(modelRunApi, modelRunApiBody));
            }
        } else {
            response = JSONObject.parseObject(InternetUtil.doGet(modelRunApi, modelRunApiBody));
        }
        // 获取返回结果编码
        return response.getString("case-id");
    }

    // 获取模型服务运行状态
    public static String getModelTaskStatus(String modelServerUrl, TaskNode taskNode) {
        String caseId = taskNode.getCaseId();
        ModelNode modelNode = taskNode.getModelNode();
        JSONObject modelUsage = modelNode.getUsage();
        String modelStatusApi = modelServerUrl + modelUsage.getJSONObject("api").getJSONObject("status").getString("url");
        JSONObject body = new JSONObject();
        body.put("id",caseId);
        JSONObject response = JSONObject.parseObject(InternetUtil.doGet(modelStatusApi, body));
        // 获取返回结果编码
        return response.getString("status");
    }

    // 获取模型服务结果
    public static JSONObject getModelTaskRes(String modelServerUrl, TaskNode taskNode) {
        String caseId = taskNode.getCaseId();
        ModelNode modelNode = taskNode.getModelNode();
        JSONObject modelUsage = modelNode.getUsage();
        String modelResultApi = modelServerUrl + modelUsage.getJSONObject("api").getJSONObject("result").getString("url");
        JSONObject body = new JSONObject();
        body.put("id",caseId);
        JSONObject response = JSONObject.parseObject(InternetUtil.doGet(modelResultApi, body));
        return response.getJSONObject("result");
    }

    // 删除模型计算容器的case
    public static void deleteModelCaseById(String modelServerUrl, String caseId) {
        JSONObject deleteBody = new JSONObject();
        deleteBody.put("id",caseId);
        InternetUtil.doDelete(modelServerUrl + "/v0/mc", deleteBody);
        log.info("taskNode " + caseId + " has been deleted!");
    }

    // 批量删除模型计算容器的case
    public static void deleteModelCaseByIdList(String modelServerUrl, List<String> caseIds) {
        JSONObject deleteBody = new JSONObject();
        deleteBody.put("case-ids",caseIds);
        InternetUtil.doPost(modelServerUrl + "/v0/mcs", deleteBody);
        log.info("taskNode List" + caseIds.toString() + " has been deleted!");
    }

    // 获取模型case调用时间
    public static JSONObject getModelCaseCallTime(String modelServerUrl) {
        String url = modelServerUrl + "/v0/mcs/time";
        return JSONObject.parseObject(InternetUtil.doGet(url));
    }

    // 获取模型容器磁盘资源使用情况(GB)
    public static Double getModelServerDiskUsage(String modelServerUrl) {
        String url = modelServerUrl + "/v0/fs/usage";
        JSONObject response = JSONObject.parseObject(InternetUtil.doGet(url));
        return response.getDouble("usage");
    }

    // 获取当前模型计算容器中所有的caseid
    public static List<String> getModelServerCases(String modelServerUrl) {
        ArrayList<String> caseIds = new ArrayList<>();
        JSONArray serverCases = getModelCaseCallTime(modelServerUrl).getJSONArray("timestamps");
        for (int i = 0; i < serverCases.size() ; i++) {
            JSONObject serverCase = (JSONObject) serverCases.get(i);
            caseIds.add(serverCase.getString("id"));
        }
        return caseIds;
    }

    // 获取在保留num个case情况下的模型计算容器中所有非常用caseid
    public static List<String> getModelServerUnusedCases(String modelServerUrl, int num) {
        ArrayList<String> desertedCaseIds = new ArrayList<>();
        JSONArray serverCases = getModelCaseCallTime(modelServerUrl).getJSONArray("timestamps");
        int desertedNum = serverCases.size() - num;
        // 若不足num个，则全部删除
        if (desertedNum <= 0) {
            desertedNum = serverCases.size();
        }
        for (int i = serverCases.size()-1; i < serverCases.size(); i--) {
            JSONObject serverCase = (JSONObject) serverCases.get(i);
            if (serverCase.getString("status").equals("UNLOCK")) {
                desertedCaseIds.add(serverCase.getString("id"));
            }
            if (desertedCaseIds.size() >= desertedNum) break;
        }
        return desertedCaseIds;
    }

    // 获取某个错误任务的前置错误case
    public static List<String> getPrecedingErrorCases(String modelServerUrl, String caseId) {
        String url = modelServerUrl + "/v0/mc/pre-error-cases";
        JSONObject body = new JSONObject();
        body.put("id",caseId);
        JSONArray jsonArray = JSONObject.parseObject(InternetUtil.doGet(url, body)).getJSONArray("case-list");
        ArrayList<String> errorCaseIds = new ArrayList<>();
        for (int i = 0; i < jsonArray.size(); i++) {
            errorCaseIds.add((String) jsonArray.get(0));
        }
        return errorCaseIds;
    }

    // 获取某个错误case的错误日志
    public static JSONObject getCaseErrorLog(String modelServerUrl, String caseId) {
        String url = modelServerUrl + "/v0/mc/error";
        JSONObject body = new JSONObject();
        body.put("id",caseId);
        String errorLogText = InternetUtil.doGet(url, body);
        JSONObject errorLog = new JSONObject();
        errorLog.put("error-log",errorLogText);
        return errorLog;
    }
}