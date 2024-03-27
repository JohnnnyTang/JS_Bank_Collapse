package com.johnny.bank.service.resource.map;

import jakarta.servlet.http.HttpServletResponse;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/27
 * @Description:
 */
public interface IVectorTileService {
    byte[] getVectorTiles(String visualId, int x, int y, int z);

    byte[] getContourVectorTiles(int x, int y, int z, String year, String tide);
}
