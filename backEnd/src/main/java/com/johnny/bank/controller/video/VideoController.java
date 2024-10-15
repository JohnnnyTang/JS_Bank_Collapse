package com.johnny.bank.controller.video;

import com.johnny.bank.config.VideoHttpRequestHandler;
import com.johnny.bank.model.configuration.VideoPath;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * @Author: Johnny Tang
 * @Date: 2024/4/15
 * @Description:
 */
@RestController
@RequestMapping("api/v1/video")
public class VideoController {
    private final VideoPath videoPath;
    private final VideoHttpRequestHandler videoHttpRequestHandler;

    public VideoController(VideoPath videoPath, VideoHttpRequestHandler videoHttpRequestHandler) {
        this.videoPath = videoPath;
        this.videoHttpRequestHandler = videoHttpRequestHandler;
    }

    @GetMapping("/yz")
    public void getPlayResource(HttpServletRequest request, HttpServletResponse response) throws Exception {
        Path path = Paths.get(videoPath.getYangzhong());
        if (Files.exists(path)) {
            String mimeType = Files.probeContentType(path);
            if (!mimeType.isEmpty()) {
                response.setContentType(mimeType);
            }
            request.setAttribute(VideoHttpRequestHandler.ATTR_FILE, path);
            videoHttpRequestHandler.handleRequest(request, response);
        } else {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.setCharacterEncoding(StandardCharsets.UTF_8.toString());
        }
    }
}
