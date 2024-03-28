package com.johnny.bank.service.resource.map;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/28
 * @Description:
 */
public interface IRasterTileService {
    byte[] getMXZRasterInByte(String year, String tide, int z, int y, int x) throws Exception;
}
