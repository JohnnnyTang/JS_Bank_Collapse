package com.johnny.bank.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model
 * @className: ProcessOutput
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/29 9:33
 * @version: 1.0
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Slf4j
public class ProcessCmdOutput {
    int statusCode; // 0-错误 1-成果
    String outputString;
    String errorMessage;

    public static ProcessCmdOutput ok(String outputString) {
        return ProcessCmdOutput.builder().statusCode(1).outputString(outputString).build();
    }

    public static ProcessCmdOutput error(IOException e) {
        String exceptionInfo = e.getMessage() + e;
        log.info(exceptionInfo);
        return ProcessCmdOutput.builder().statusCode(0).errorMessage(exceptionInfo).build();
    }
}
