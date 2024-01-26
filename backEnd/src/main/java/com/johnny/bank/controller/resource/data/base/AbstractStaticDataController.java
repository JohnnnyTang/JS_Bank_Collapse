package com.johnny.bank.controller.resource.data.base;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
public abstract class AbstractStaticDataController<T> {
    public abstract ResponseEntity<List<T>> findAll();

    public abstract ResponseEntity<T> findById(@PathVariable("id") String id);

    public abstract ResponseEntity<List<T>> findByIdList(@RequestParam("idList") List<String> idList);

    public abstract ResponseEntity<Integer> getRowNumber();

    public abstract ResponseEntity<T> findByCode(@PathVariable("code") String code);

    public abstract ResponseEntity<List<T>> findByCodeList(@RequestParam("codeList") List<String> codeList);

    public abstract ResponseEntity<T> findNewestData();
}
