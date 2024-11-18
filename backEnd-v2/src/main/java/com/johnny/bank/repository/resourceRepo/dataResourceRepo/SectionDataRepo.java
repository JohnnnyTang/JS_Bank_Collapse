package com.johnny.bank.repository.resourceRepo.dataResourceRepo;

import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * @author: DMK
 * @description:
 * @date: 2024-11-08 15:41:37
 * @version: 1.0
 */
@Repository("SectionDataRepo")
public interface SectionDataRepo {
    List<Map<String, Object>> getSectionInfo(String tableName, String type);
}
