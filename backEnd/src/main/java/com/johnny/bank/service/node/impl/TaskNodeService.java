package com.johnny.bank.service.node.impl;

import com.johnny.bank.model.ProcessCmdOutput;
import com.johnny.bank.model.node.DataNode;
import com.johnny.bank.model.node.ModelNode;
import com.johnny.bank.model.node.ParamNode;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.repository.nodeRepo.IDataNodeRepo;
import com.johnny.bank.repository.nodeRepo.IModelNodeRepo;
import com.johnny.bank.repository.nodeRepo.IParamNodeRepo;
import com.johnny.bank.repository.nodeRepo.ITaskNodeRepo;
import com.johnny.bank.utils.ProcessUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Optional;

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

    @Autowired
//    @Qualifier("BaseNodeRepo")
    public void setBaseNodeRepo(ITaskNodeRepo IBaseNodeRepo) {
        this.IBaseNodeRepo = IBaseNodeRepo;
    }

    @Override
    public String save(TaskNode taskNode) {
        if(taskNode.getDataNode().getId() != null) {
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
        } else taskNode.setParamNode(null);

        return IBaseNodeRepo.save(taskNode).getId();
    }

    // TODO: 新增任务的业务逻辑、任务案例页面

    public String createAndStartNewTask(TaskNode taskNode) throws IOException {
        String nodeId = save(taskNode);
        taskNode = IBaseNodeRepo.findById(nodeId).orElse(null);
        if(taskNode == null) {
            return null;
        } else new TaskThread(taskNode).start();
        return nodeId;
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


    public class TaskThread extends Thread {
        TaskNode taskNode;

        public TaskThread(TaskNode taskNode) {
            this.taskNode = taskNode;
        }

        @Override
        public void run() {
            try {
                Process process = ProcessUtil.buildTaskNodeProcess(taskNode);
                ProcessCmdOutput cmdOutput = ProcessUtil.getProcessCmdOutput(process.getInputStream());
                if(cmdOutput.getStatusCode() == 0) {
                    taskNode.setStatus("-1");
                }
                int code = process.waitFor();
                process.destroy();
                if(code == 0) {
                    taskNode.setStatus("1");
                    taskNode.getResult().put("resultString", cmdOutput.getOutputString());
                }
                else {
                    taskNode.setStatus("-1");
                }
            } catch (IOException | InterruptedException e) {
                throw new RuntimeException(e);
            }
            log.info("running custom Thread");
        }
    }
}
