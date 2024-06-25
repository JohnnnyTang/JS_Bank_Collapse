package com.johnny.bank.model.common;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * @Author: Johnny Tang
 * @Date: 2024/6/6
 * @Description:
 */
@NoArgsConstructor
@AllArgsConstructor
@ToString()
@Data
public class SimpleBboxInfo {
    Object[] bbox;
    String id;
}
