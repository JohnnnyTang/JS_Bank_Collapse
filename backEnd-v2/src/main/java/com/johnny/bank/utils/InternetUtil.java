package com.johnny.bank.utils;

import com.alibaba.fastjson2.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Yiming
 * @Date: 2023/08/17/10:48
 * @Description:
 */
@Slf4j
public class InternetUtil {
    public static String doGet(String url) {
        try {
            URL obj = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
            connection.setRequestMethod("GET");

            // 设置超时时间为10s
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            int responseCode = connection.getResponseCode();
            StringBuilder response = new StringBuilder();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
            } else {
                log.info("Get request failed with response code " + responseCode);
            }
            connection.disconnect();
            return response.toString();
        } catch (Exception e) {
            if (e instanceof java.net.SocketTimeoutException) {
                return "Connection timed out: " + e.getMessage();
            } else {
                return "Error during POST request: " + e.getMessage();
            }
        }
    }

    public static String doGet(String url, JSONObject body) {
        try {
            StringBuilder queryStringBuilder = new StringBuilder();
            boolean isFirst = true;
            for (String key : body.keySet()) {
                if (!isFirst) {
                    queryStringBuilder.append("&");
                } else {
                    isFirst = false;
                }
                queryStringBuilder.append(key)
                        .append("=")
                        .append(body.getString(key));
            }
            String query = queryStringBuilder.toString();
            URL obj = new URL(url + (query.isEmpty() ? "" : "?") + query);
            HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
            connection.setRequestMethod("GET");

            // 设置超时时间为10s
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), "UTF-8"));
            int responseCode = connection.getResponseCode();
            StringBuilder response = new StringBuilder();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();
            } else {
                log.info("Get request failed with response code " + responseCode);
            }
            connection.disconnect();
            return response.toString();

        } catch (Exception e) {
            if (e instanceof java.net.SocketTimeoutException) {
                return "Connection timed out: " + e.getMessage();
            } else {
                return "Error during GET request: " + e.getMessage();
            }
        }
    }

    public static byte[] doGet_Byte(String url, JSONObject body) {
        try {
            StringBuilder queryStringBuilder = new StringBuilder();
            boolean isFirst = true;
            for (String key : body.keySet()) {
                if (!isFirst) {
                    queryStringBuilder.append("&");
                } else {
                    isFirst = false;
                }
                queryStringBuilder.append(key)
                        .append("=")
                        .append(body.getString(key));
            }
            String query = queryStringBuilder.toString();
            URL obj = new URL(url + (query.isEmpty() ? "" : "?") + query);
            HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
            connection.setRequestMethod("GET");

            // 设置超时时间为10s
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (InputStream inputStream = new BufferedInputStream(connection.getInputStream())) {
                    return inputStream.readAllBytes();
                }
            } else {
                log.info("Get request failed with response code " + responseCode);
                return null;
            }
        } catch (Exception e) {
            if (e instanceof java.net.SocketTimeoutException) {
                log.error("Connection timed out: " + e.getMessage());
            } else {
                log.error("Error during GET request: " + e.getMessage(), e);
            }
            return null;
        }
    }

    public static String doPost(String url, JSONObject body) {
        try {
            URL obj = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");

            // 设置超时时间为10s
            connection.setConnectTimeout(60000);
            connection.setReadTimeout(60000);

            // Send post request
            try (DataOutputStream wr = new DataOutputStream(connection.getOutputStream())) {
                wr.write(body.toString().getBytes(StandardCharsets.UTF_8));
                wr.flush();
            }

            int responseCode = connection.getResponseCode();
            StringBuilder response = new StringBuilder();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                }
            } else {
                log.error("POST request failed with response code " + responseCode);
            }

            connection.disconnect();
            return response.toString();

        } catch (Exception e) {
            if (e instanceof java.net.SocketTimeoutException) {
                return "Connection timed out: " + e.getMessage();
            } else {
                return "Error during POST request: " + e.getMessage();
            }
        }
    }

    public static String doPost_File(String url, MultipartFile file, JSONObject body) {
        try {
            URL obj = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", file.getContentType());
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");

            // 设置超时时间为10s
            connection.setConnectTimeout(180000);
            connection.setReadTimeout(180000);

            // 创建请求体的边界
            String boundary = UUID.randomUUID().toString();
            connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

            // Send post request
            try (DataOutputStream wr = new DataOutputStream(connection.getOutputStream())) {
                // 添加文件部分
                String fileName = file.getOriginalFilename();
                String filePart = "--" + boundary + "\r\n" +
                        "Content-Disposition: form-data; name=\"file\"; filename=\"" + fileName + "\"\r\n" +
                        "Content-Type: " + file.getContentType() + "\r\n\r\n";
                wr.write(filePart.getBytes(StandardCharsets.UTF_8));
                try (InputStream fileInputStream = file.getInputStream()) {
                    IOUtils.copy(fileInputStream, wr);
                }
                wr.write("\r\n".getBytes(StandardCharsets.UTF_8));
                // 添加JSON部分
                String jsonPart = "--" + boundary + "\r\n" +
                        "Content-Disposition: form-data; name=\"json\"\r\n\r\n";
                wr.write(jsonPart.getBytes(StandardCharsets.UTF_8));
                wr.write(body.toString().getBytes(StandardCharsets.UTF_8));
                wr.write("\r\n".getBytes(StandardCharsets.UTF_8));
                // 添加结束边界
                wr.write(("--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));
                wr.flush();
            }

            int responseCode = connection.getResponseCode();
            StringBuilder response = new StringBuilder();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                }
            } else {
                log.error("POST request failed with response code " + responseCode);
            }

            connection.disconnect();
            return response.toString();

        } catch (Exception e) {
            if (e instanceof java.net.SocketTimeoutException) {
                return "Connection timed out: " + e.getMessage();
            } else {
                return "Error during POST request: " + e.getMessage();
            }
        }
    }

    public static String doPost_Hydro(String url, Optional<List<MultipartFile>> optionalFileList, JSONObject body) {
        try {
            URL obj = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            List<MultipartFile> fileList = optionalFileList.orElseThrow();
            // 设置超时时间为10s
            connection.setConnectTimeout(180000);
            connection.setReadTimeout(180000);

            // 创建请求体的边界
            String boundary = UUID.randomUUID().toString();
            connection.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

            // Send post request
            try (DataOutputStream wr = new DataOutputStream(connection.getOutputStream())) {
                // 添加文件部分
                for (MultipartFile file : fileList) {
                    String fileName = file.getOriginalFilename();
                    String filePart = "--" + boundary + "\r\n" +
                            "Content-Disposition: form-data; name=\"" + fileName + "\"; filename=\"" + fileName + "\"\r\n" +
                            "Content-Type: " + file.getContentType() + "\r\n\r\n";
                    wr.write(filePart.getBytes(StandardCharsets.UTF_8));
                    try (InputStream fileInputStream = file.getInputStream()) {
                        IOUtils.copy(fileInputStream, wr);
                    }
                    wr.write("\r\n".getBytes(StandardCharsets.UTF_8));
                }

                // 添加JSON部分
                String jsonPart = "--" + boundary + "\r\n" +
                        "Content-Disposition: form-data; name=\"json\"\r\n\r\n";
                wr.write(jsonPart.getBytes(StandardCharsets.UTF_8));
                wr.write(body.toString().getBytes(StandardCharsets.UTF_8));
                wr.write("\r\n".getBytes(StandardCharsets.UTF_8));
                // 添加结束边界
                wr.write(("--" + boundary + "--\r\n").getBytes(StandardCharsets.UTF_8));
                wr.flush();
            }

            int responseCode = connection.getResponseCode();
            StringBuilder response = new StringBuilder();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                }
            } else {
                log.error("POST request failed with response code " + responseCode);
            }

            connection.disconnect();
            return response.toString();

        } catch (Exception e) {
            if (e instanceof java.net.SocketTimeoutException) {
                return "Connection timed out: " + e.getMessage();
            } else {
                return "Error during POST request: " + e.getMessage();
            }
        }
    }

    public static String doPost_waterCondition(String url, JSONObject body) {
        try {
            URL obj = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");
            connection.setRequestProperty("X-Data-AppKey", "MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAE2O9HiNkUihPwMyyyMkyVhuNfZOmJAfs04P13G1Z59T7aesRmUybJQOmGC7YKuBP8w6M1Hyo2nkDEPMagm0+Rbg==");
            connection.setRequestProperty("X-Data-Secret", "MIGTAgEAMBMGByqGSM49AgEGCCqBHM9VAYItBHkwdwIBAQQg9lVDY6TIXeo6jX08+fiRmFGhugEKIt4CrSB2ShCQG0ugCgYIKoEcz1UBgi2hRANCAATY70eI2RSKE/AzLLIyTJWG419k6YkB+zTg/XcbVnn1Ptp6xGZTJslA6YYLtgq4E/zDozUfKjaeQMQ8xqCbT5Fu");
            // 设置超时时间为10s
            connection.setConnectTimeout(60000);
            connection.setReadTimeout(60000);

            // Send post request
            try (DataOutputStream wr = new DataOutputStream(connection.getOutputStream())) {
                wr.write(body.toString().getBytes(StandardCharsets.UTF_8));
                wr.flush();
            }

            int responseCode = connection.getResponseCode();
            StringBuilder response = new StringBuilder();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream(), StandardCharsets.UTF_8))) {
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        response.append(inputLine);
                    }
                }
            } else {
                log.error("POST request failed with response code " + responseCode);
            }

            connection.disconnect();
            return response.toString();

        } catch (Exception e) {
            if (e instanceof java.net.SocketTimeoutException) {
                return "Connection timed out: " + e.getMessage();
            } else {
                return "Error during POST request: " + e.getMessage();
            }
        }
    }

    public static byte[] doPost_Byte(String url, JSONObject body) {
        try {
            URL obj = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("User-Agent", "Mozilla/5.0");

            // 设置超时时间为10s
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            // Send post request
            try (DataOutputStream wr = new DataOutputStream(connection.getOutputStream())) {
                wr.write(body.toString().getBytes(StandardCharsets.UTF_8));
                wr.flush();
            }

            int responseCode = connection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                try (InputStream inputStream = new BufferedInputStream(connection.getInputStream())) {
                    return inputStream.readAllBytes();
                }
            } else {
                log.info("Get request failed with response code " + responseCode);
                return null;
            }
        } catch (Exception e) {
            if (e instanceof java.net.SocketTimeoutException) {
                log.error("Connection timed out: " + e.getMessage());
            } else {
                log.error("Error during GET request: " + e.getMessage(), e);
            }
            return null;
        }
    }

    public static String doDelete(String url, JSONObject body) {
        try {
            StringBuilder queryStringBuilder = new StringBuilder();
            boolean isFirst = true;
            for (String key : body.keySet()) {
                if (!isFirst) {
                    queryStringBuilder.append("&");
                } else {
                    isFirst = false;
                }
                queryStringBuilder.append(key)
                        .append("=")
                        .append(body.getString(key));
            }
            String query = queryStringBuilder.toString();
            URL obj = new URL(url + (query.isEmpty() ? "" : "?") + query);
            HttpURLConnection connection = (HttpURLConnection) obj.openConnection();
            connection.setRequestMethod("DELETE");

            // 设置超时时间为10s
            connection.setConnectTimeout(10000);
            connection.setReadTimeout(10000);

            int responseCode = connection.getResponseCode();
            InputStream responseStream;
            if (responseCode == HttpURLConnection.HTTP_OK ) {
                // 成功的响应，读取响应体
                return "DELETED";
            } else {
                // 错误的响应，读取错误流
                return "NOT DELETED";
            }

        } catch (Exception e) {
            if (e instanceof java.net.SocketTimeoutException) {
                log.info("Connection timed out: " + e.getMessage());
                return "NOT DELETED";
            } else {
                log.info("Error during DELETE request: " + e.getMessage());
                return "NOT DELETED";
            }
        }
    }

    public static String encodeSpaceChinese(String str, String charset) throws UnsupportedEncodingException {
        //匹配中文和空格的正则表达式
        String zhPattern = "[\u4e00-\u9fa5 ]+";
        Pattern p = Pattern.compile(zhPattern);
        Matcher m = p.matcher(str);
        StringBuffer b = new StringBuffer();
        while (m.find())
        {
            m.appendReplacement(b, URLEncoder.encode(m.group(0), charset));
        }
        m.appendTail(b);
        return b.toString().replaceAll("\\+", "%20");
    }

    public static <T>T httpHandle(String url, HttpEntity httpEntity, Class<T> c, String method) throws Exception {
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<T> result;
        if (method.equals("post")) {
            result = restTemplate.exchange(url, HttpMethod.POST, httpEntity, c);
        } else if (method.equals("get")) {
            result = restTemplate.exchange(url, HttpMethod.GET, httpEntity, c);
        } else if (method.equals("delete")) {
            result = restTemplate.exchange(url, HttpMethod.DELETE, httpEntity, c);
        } else if (method.equals("put")) {
            result = restTemplate.exchange(url, HttpMethod.PUT, httpEntity, c);
        } else {
            throw new Exception();
        }
        return result.getBody();
    }
}
