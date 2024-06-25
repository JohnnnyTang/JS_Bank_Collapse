package com.johnny.bank.repository.resourceRepo.dataResourceRepo.base;

import com.johnny.bank.model.resource.dataResource.base.StaticInfoData;

import java.util.List;

/**
 * @Author: Johnny Tang
 * @Date: 2024/1/2
 * @Description:
 */
public interface IStaticInfoBaseRepo<T extends StaticInfoData> extends IStaticBaseRepo<T> {
    T findByCode(String code);

    List<T> findByCodeList(List<String> codeList);

    T findNewestData();
}
