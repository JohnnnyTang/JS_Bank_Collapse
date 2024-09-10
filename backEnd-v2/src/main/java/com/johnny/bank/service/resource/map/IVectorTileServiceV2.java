package com.johnny.bank.service.resource.map;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/9/6 10:00
 * @Description:
 */
public interface IVectorTileServiceV2 {

    byte[] getVectorTiles(String bank, String visualId, int x, int y, int z);
}
