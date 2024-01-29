package com.johnny.bank.repository.resourceRepo.dataResourceRepo.base;

import com.alibaba.fastjson2.JSONObject;
import com.johnny.bank.model.resource.dataResource.ShpData;
import org.springframework.core.io.FileSystemResource;

public interface IGeoDataRepo {
    Integer getTotalCount();

    void deleteById(String id);

}
