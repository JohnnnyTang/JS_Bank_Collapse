package com.johnny.bank.controller.analysis;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.controller.analysis
 * @className: TestPyController
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/22 17:17
 * @version: 1.0
 */
@Controller
@RequestMapping("api/v1/analysis/test")
public class TestPyController {
    @GetMapping
    public ResponseEntity<String> testPyProgram() {
        StringBuilder result = new StringBuilder();
        try {
            //这个方法是类似隐形开启了命令执行器，输入指令执行python脚本
            Process process = Runtime.getRuntime()
                    .exec("python D:\\2023_work\\bank-collapse\\code\\py\\test.py 1 2 3 4 test");
            //这种方式获取返回值的方式是需要用python打印输出，然后java去获取命令行的输出，在java返回
            InputStreamReader ir = new InputStreamReader(process.getInputStream());
            LineNumberReader input = new LineNumberReader(ir);
            String aLine = null;
            // 如外部进程已经完成输出并关闭了输出流，input.readLine()返回null
            while((aLine = input.readLine()) != null) {
                result.append(aLine).append(' ');
            }
            input.close();
            ir.close();
            int re = process.waitFor();     //等待外部进程完全结束
            System.out.println(result);
        } catch (IOException | InterruptedException e) {
            System.out.println("调用python脚本并读取结果时出错：" + e.getMessage());
        }
        return ResponseEntity.ok(result.toString());
    }
}
