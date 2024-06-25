package com.johnny.bank.Thread;

import com.johnny.bank.model.ProcessCmdOutput;
import com.johnny.bank.model.node.TaskNode;
import com.johnny.bank.utils.ProcessUtil;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.Thread
 * @className: TaskThread
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/29 10:33
 * @version: 1.0
 */
@Slf4j
@Getter
public class TaskNodeThread extends Thread {
    TaskNode taskNode;

    public TaskNodeThread(TaskNode taskNode) {
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
        log.info("running custom info");
    }
}
