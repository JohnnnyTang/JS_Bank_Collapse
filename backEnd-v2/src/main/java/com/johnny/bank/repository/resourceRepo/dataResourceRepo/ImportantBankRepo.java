package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * @author: DMK
 * @description:
 * @date: 2024-11-08 21:23:10
 * @version: 1.0
 */
@Repository("ImportantBankRepo")
public interface ImportantBankRepo {
    List<String> getImportantBankNameByPrefix(String tableName, String prefix);

    Map<String, String> getImportantBankInfoByName(String tableName, String name);
}
