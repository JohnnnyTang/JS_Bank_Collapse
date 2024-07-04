package com.johnny.bank.model.node;

import com.alibaba.fastjson2.JSONObject;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.johnny.bank.model.node.base.BaseNode;
import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;
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
@Document(collection = "dataNode")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DataNode extends BaseNode {
    String apiPrefix;
    //    @DBRef
    JSONObject usage;
    String bank;
    @Indexed
    String linkCode;

    @Builder(builderMethodName = "dataNodeBuilder")
    public DataNode(
            String id, String name, String auth,
            String category, String path,
            String apiPrefix, JSONObject usage, String bank, String linkCode
    ) {
        super(id, name, auth, category, path);
        this.apiPrefix = apiPrefix;
        this.usage = usage;
        this.bank = bank;
        this.linkCode = linkCode;
    }
}