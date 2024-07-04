package com.johnny.bank.model.node;

import com.alibaba.fastjson2.JSONObject;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.johnny.bank.model.node.base.BaseNode;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @Author: Johnny T
 * @Date: 2023/12/19
 * @Description:
 */

@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Document(collection = "dataNodeV2")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DataNodeV2 extends BaseNode {
    String apiPrefix;
    JSONObject usage;
    JSONObject basicInfo;
//    JSONObject detailInfo;
    String bank;
    String dataOrigin;

    @Builder(builderMethodName = "dataNodeBuilder")
    public DataNodeV2(
            String id, String name, String auth, String category, String path, String apiPrefix,
            JSONObject usage, JSONObject basicInfo, String bank, String dataOrigin
    ) {
        super(id, name, auth, category, path);
        this.apiPrefix = apiPrefix;
        this.usage = usage;
        this.bank = bank;
        this.basicInfo = basicInfo;
//        this.detailInfo = detailInfo;
        this.dataOrigin = dataOrigin;
    }
}
