package com.johnny.bank.utils;

import com.alibaba.fastjson2.JSONObject;
import com.aliyuncs.DefaultAcsClient;
import com.aliyuncs.IAcsClient;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsRequest;
import com.aliyuncs.dysmsapi.model.v20170525.SendSmsResponse;
import com.aliyuncs.http.MethodType;
import com.aliyuncs.profile.DefaultProfile;
import com.aliyuncs.profile.IClientProfile;
import com.johnny.bank.model.configuration.SmsConfig;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.utils
 * @className: SMSUtil
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/4/25 15:34
 * @version: 1.0
 */
@Slf4j
@Component
public class SMSUtil {

    private final SmsConfig smsConfig;

    public SMSUtil(SmsConfig smsConfig) {
        this.smsConfig = smsConfig;
    }

    public SendSmsResponse sendSms(String phoneNumber, String templateParam) throws IOException {
        File file = new File(smsConfig.getAccessTokenLoc());
        String content= FileUtils.readFileToString(file,"UTF-8");
        JSONObject jsonObject = JSONObject.parseObject(content);
        log.info("test read" + jsonObject);
        String domain = "dysmsapi.aliyuncs.com";
        //短信API产品名称（短信产品名固定，无需修改）
        String product = "Dysmsapi";
        try{
            //设置超时时间-可自行调整
            System.setProperty("sun.net.client.defaultConnectTimeout", "10000");
            System.setProperty("sun.net.client.defaultReadTimeout", "10000");
            //初始化ascClient,暂时不支持多region（请勿修改）
            IClientProfile profile = DefaultProfile.getProfile("cn-hangzhou",
                    (String) jsonObject.get("AccessKeyID"), (String) jsonObject.get("AccessKeySecret"));
            //短信API产品域名（接口地址固定，无需修改）

            DefaultProfile.addEndpoint("cn-hangzhou", product, domain);
            IAcsClient acsClient = new DefaultAcsClient(profile);
            //组装请求对象
            SendSmsRequest request = new SendSmsRequest();
            //使用post提交
            request.setMethod(MethodType.POST);
            //必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为国际区号+号码，如“85200000000”
            request.setPhoneNumbers(phoneNumber);
            //必填:短信签名-可在短信控制台中找到
            request.setSignName(smsConfig.getSignName());
            //必填:短信模板-可在短信控制台中找到，发送国际/港澳台消息时，请使用国际/港澳台短信模版
            request.setTemplateCode(smsConfig.getVerifyTemplateCode());
            //可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时,此处的值为
            //友情提示:如果JSON中需要带换行符,请参照标准的JSON协议对换行符的要求,比如短信内容中包含\r\n的情况在JSON中需要表示成\\r\\n,否则会导致JSON在服务端解析失败
            request.setTemplateParam(templateParam);
            //请求失败这里会抛ClientException异常
            SendSmsResponse response  = acsClient.getAcsResponse(request);
            if (!StringUtils.equals("OK", response.getCode())){
                log.info("[短信服务] 发送短息失败，手机号码：{} ，原因：{}", phoneNumber, response.getMessage());
            }

            return response;
        }catch (Exception e){
            log.error("[短信服务] 发送短息异常，手机号码：{}", phoneNumber, e);
            return null;
        }

    }

}
