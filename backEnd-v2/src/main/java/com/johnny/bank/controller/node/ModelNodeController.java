package com.johnny.bank.controller.node;

import com.johnny.bank.controller.node.base.BaseNodeController;
import com.johnny.bank.model.node.ModelNode;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: Johnny T
 * @Date: 2023/12/21
 * @Description:
 */
@RestController
@RequestMapping("api/v1/modelNode")
public class ModelNodeController extends BaseNodeController<ModelNode> {
}
