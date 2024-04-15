package com.johnny.bank.Thread;

import com.johnny.bank.model.ProcessCmdOutput;
import com.johnny.bank.model.configuration.TilePath;
import com.johnny.bank.utils.ProcessUtil;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * @Author: Johnny Tang
 * @Date: 2024/4/12
 * @Description:
 */
@Slf4j
@Component
public class MapTileServiceThread extends Thread{


    private TilePath tilePath;

    private Process cmdProcess;

    @PostConstruct
    public void init(){
        //启动线程实例
        this.start();
    }
    @Override
    public void run() {
        try {
            cmdProcess = ProcessUtil.buildMapTileServiceProcess(tilePath.getWorldTilePath());
            ProcessCmdOutput cmdOutput = ProcessUtil.getProcessCmdOutput(cmdProcess.getInputStream());
            if(cmdOutput.getStatusCode() == 0) {
                System.out.println("tile service start wrong");
            }
            int code = cmdProcess.waitFor();
            cmdProcess.destroy();
            if(code == 0) {
                System.out.println("tile service end");
            }
            else {
                System.out.println("tile service end error");
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        log.info("running node base map service");
    }

    @PreDestroy
    public void end(){
        try {
            if(cmdProcess != null) {
                cmdProcess.destroy();
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        log.info("close node base map service");
    }

    @Autowired
    public void setTilePath(TilePath tilePath) {
        this.tilePath = tilePath;
    }
}
