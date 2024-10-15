package com.johnny.bank.repository.resourceRepo.dataResourceRepo.base;

import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
@Repository
public interface IStaticBaseRepo<T> {
    List<T> findAll();

    int getTotalCount();

    T findById(String id);

    List<T> findByIdList(List<String> ids);
}
