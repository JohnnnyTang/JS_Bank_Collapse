package com.johnny.bank.controller.resource.map;

import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.repository.resourceRepo.MapRepo.IVectorTileRepo;
import com.johnny.bank.repository.resourceRepo.dataResourceRepo.ITileSourceRepo;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.resource.map.impl.RasterTileService;
import com.johnny.bank.service.resource.map.impl.VectorTileService;
import com.johnny.bank.service.resource.map.impl.VectorTileServiceV2;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

/**
 * Created with IntelliJ IDEA.
 *
 * @Author: Chry
 * @Date: 2024/9/6 9:46
 * @Description:
 */

@RestController
@RequestMapping("api/v2/tile")
@Slf4j
public class MapTileControllerV2 {

    private final DataNodeServiceV2 dataNodeServiceV2;
    private final RasterTileService rasterTileService;
    private final VectorTileServiceV2 vectorTileServiceV2;

    @Autowired
    public MapTileControllerV2(
            @Qualifier("DataNodeServiceV2") DataNodeServiceV2 dataNodeServiceV2,
            @Qualifier("RasterTileService") RasterTileService rasterTileService,
            @Qualifier("VectorTileServiceV2") VectorTileServiceV2 vectorTileServiceV2) {
        this.dataNodeServiceV2 = dataNodeServiceV2;
        this.rasterTileService = rasterTileService;
        this.vectorTileServiceV2 = vectorTileServiceV2;
    }


    private void sendVectorTileResponse(byte[] tileRes, HttpServletResponse response) {
        if(tileRes == null) {
            return;
        }
        ServletOutputStream sos;
        try {
            response.setContentType("application/octet-stream");
            sos = response.getOutputStream();
            sos.write(tileRes);
            sos.flush();
            sos.close();
        } catch (org.apache.catalina.connector.ClientAbortException e) {
            //地图移动时客户端主动取消， 产生异常"你的主机中的软件中止了一个已建立的连接"，无需处理
            log.info("Map moved. Client end MVT connection.");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @CrossOrigin
    @RequestMapping(value = "/vector/{bank}/{layerName}/{x}/{y}/{z}", method = RequestMethod.GET)
    public void getCommonVectorTiles(@PathVariable String bank, @PathVariable String layerName,@PathVariable int x, @PathVariable int y, @PathVariable int z, HttpServletResponse response) throws Exception {
        byte[] tileRes = vectorTileServiceV2.getVectorTiles(bank, layerName, x, y, z);
        sendVectorTileResponse(tileRes, response);
    }

    @CrossOrigin
    @RequestMapping(
            value = "/raster/dem/{bank}/{name}/{x}/{y}/{z}",
            method = RequestMethod.GET
    )
    public @ResponseBody byte[] getDEMRasterTiles(
            @PathVariable String bank, @PathVariable String name, @PathVariable String x, @PathVariable String y, @PathVariable String z
    ) throws Exception {
        DataNodeV2 dataNodeV2 = dataNodeServiceV2.getDataNodeByCategoryBankName("DEMTileDataItem", bank, name);
        String path = dataNodeV2.getUsage().getString("path");
        return rasterTileService.getDEMRasterInByte(path, Integer.parseInt(z), Integer.parseInt(x), Integer.parseInt(y));
    }

}
