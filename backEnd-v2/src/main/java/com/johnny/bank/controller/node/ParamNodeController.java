package com.johnny.bank.controller.node;

import com.johnny.bank.controller.node.base.BaseNodeController;
import com.johnny.bank.model.node.ParamNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: Johnny T
 * @Date: 2023/12/21
 * @Description:
 */
@RestController
@RequestMapping("api/v1/paramNode")
public class ParamNodeController extends BaseNodeController<ParamNode> {


}
