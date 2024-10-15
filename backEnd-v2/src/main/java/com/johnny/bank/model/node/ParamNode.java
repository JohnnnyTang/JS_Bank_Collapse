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
@Document(collection = "paramNode")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ParamNode extends BaseNode {
//    @DBRef
    String modelId;
    JSONObject params;

    @Builder(builderMethodName = "paramNodeBuilder")
    public ParamNode(
            String id, String name, String auth,
            String category, String path,
            String modelId, JSONObject params
    ) {
        super(id, name, auth, category, path);
        this.modelId = modelId;
        this.params = params;
    }

}
