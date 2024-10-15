package com.johnny.bank.controller.resource.map;

import com.johnny.bank.model.common.SimpleBboxInfo;
import com.johnny.bank.model.node.DataNodeV2;
import com.johnny.bank.service.node.impl.DataNodeServiceV2;
import com.johnny.bank.service.resource.map.impl.RasterTileService;
import com.johnny.bank.service.resource.map.impl.VectorTileService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/27
 * @Description:
 */
@RestController
@RequestMapping("api/v1/tile")
@Slf4j
public class MapTileController {

    @Autowired
    DataNodeServiceV2 dataNodeServiceV2;
    private final VectorTileService vectorTileService;
    private final RasterTileService rasterTileService;

    @Autowired
    public MapTileController(VectorTileService vectorTileService, RasterTileService rasterTileService) {
        this.vectorTileService = vectorTileService;
        this.rasterTileService = rasterTileService;
    }

    @CrossOrigin
    @RequestMapping(value = "/vector/contour/{year}/{tide}/{x}/{y}/{z}", method = RequestMethod.GET)
    public void getContourVectorTiles(@PathVariable String year, @PathVariable String tide,@PathVariable int x, @PathVariable int y, @PathVariable int z, HttpServletResponse response) throws Exception {
        byte[] tileRes = vectorTileService.getContourVectorTiles(x, y, z, year, tide);
        sendVectorTileResponse(tileRes, response);

    }

    @CrossOrigin
    @RequestMapping(value = "/vector/depthLine/{year}/{x}/{y}/{z}", method = RequestMethod.GET)
    public void getDepthLineVectorTiles(@PathVariable String year, @PathVariable int x, @PathVariable int y, @PathVariable int z, HttpServletResponse response) throws Exception {
        byte[] tileRes = vectorTileService.getDepthLineVectorTiles(x, y, z, year);
        sendVectorTileResponse(tileRes, response);
    }

    @CrossOrigin
    @RequestMapping(value = "/vector/{layerName}/{x}/{y}/{z}", method = RequestMethod.GET)
    public void getCommonVectorTiles(@PathVariable String layerName,@PathVariable int x, @PathVariable int y, @PathVariable int z, HttpServletResponse response) throws Exception {
        byte[] tileRes = vectorTileService.getVectorTiles(layerName, x, y, z);
        sendVectorTileResponse(tileRes, response);
    }

    @CrossOrigin
    @RequestMapping(value = "/vector/center/{layerName}/{x}/{y}/{z}", method = RequestMethod.GET)
    public void getCommonVectorCenterPtTiles(@PathVariable String layerName,@PathVariable int x, @PathVariable int y, @PathVariable int z, HttpServletResponse response) throws Exception {
        byte[] tileRes = vectorTileService.getVectorCenterPtTiles(layerName, x, y, z);
        sendVectorTileResponse(tileRes, response);
    }

    @CrossOrigin
    @RequestMapping(value = "/vector/geomCenter/{layerName}/{x}/{y}/{z}", method = RequestMethod.GET)
    public void getCommonVectorGeomCenterPtTiles(@PathVariable String layerName,@PathVariable int x, @PathVariable int y, @PathVariable int z, HttpServletResponse response) throws Exception {
        byte[] tileRes = vectorTileService.getVectorGeomCenterPtTiles(layerName, x, y, z);
        sendVectorTileResponse(tileRes, response);
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

    @GetMapping("/vector/{tileName}/info")
    public ResponseEntity<List<Map<String, Object>>> getVectorTileInfo(@PathVariable String tileName) {
        return ResponseEntity.ok(vectorTileService.getLayerInfo(tileName));
    }

    @GetMapping("/vector/{tileName}/info/bbox")
    public ResponseEntity<List<Map<String, Object>>> getVectorTileBboxInfo(@PathVariable String tileName) {
        return ResponseEntity.ok(vectorTileService.getLayerWholeInfo(tileName));
    }

    @GetMapping("/vector/{tileName}/id/{id}/info/bbox")
    public ResponseEntity<Object> getVectorTileBboxInfo(@PathVariable String tileName,@PathVariable String id) {
        return ResponseEntity.ok(vectorTileService.getLayerBboxInfoById(tileName, id));
    }

    @GetMapping("/vector/{tileName}/cj/bbox")
    public ResponseEntity<List<Map<String, Object>>> getLinkedRiverVectorTileBboxInfo(@PathVariable String tileName) {
        return ResponseEntity.ok(vectorTileService.getLinkedRiverLayerBboxInfo(tileName));
    }

    @GetMapping("/vector/{tileName}/id/{id}/cj/bbox")
    public ResponseEntity<Map<String, Object>> getLinkedRiverVectorTileBboxInfoById(
            @PathVariable String tileName, @PathVariable String id) {
        return ResponseEntity.ok(vectorTileService.getLinkedRiverLayerBboxInfoById(tileName, id));
    }

    @GetMapping("/vector/{tileName}/id/{id}/buffer/{buf}/cj/bbox")
    public ResponseEntity<SimpleBboxInfo> getLinkedRiverVectorTileBboxInfoByIdWithRad(
            @PathVariable String tileName, @PathVariable String id, @PathVariable Integer buf) {
        return ResponseEntity.ok(vectorTileService.getLinkedRiverLayerBboxInfoByIdWithBuffer(tileName, id, buf));
    }

    @GetMapping("/vector/river/{tileName}/id/{id}/buffer/{buf}/cj/bbox")
    public ResponseEntity<SimpleBboxInfo> getRiverVectorTileBboxInfoByIdWithRad(
            @PathVariable String tileName, @PathVariable String id, @PathVariable Integer buf) {
        return ResponseEntity.ok(vectorTileService.getRiverLayerBboxInfoByIdWithBuffer(tileName, id, buf));
    }

    @CrossOrigin
    @RequestMapping(
            value = "/raster/mzs/{year}/{tide}/{x}/{y}/{z}",
            method = RequestMethod.GET
    )
    public @ResponseBody byte[] getRasterTiles(
            @PathVariable String year, @PathVariable String tide,
            @PathVariable String x, @PathVariable String y, @PathVariable String z
    ) throws Exception {
        return rasterTileService.getMXZRasterInByte(year, tide, Integer.parseInt(z), Integer.parseInt(x), Integer.parseInt(y));
    }

    @CrossOrigin
    @RequestMapping(
            value = "/raster/river/{name}/{x}/{y}/{z}",
            method = RequestMethod.GET
    )
    public @ResponseBody byte[] getRiverRasterTiles(
            @PathVariable String name, @PathVariable String x, @PathVariable String y, @PathVariable String z
    ) throws Exception {
        return rasterTileService.getRiverRasterInByte(name, Integer.parseInt(z), Integer.parseInt(x), Integer.parseInt(y));
    }

    @CrossOrigin
    @RequestMapping(
            value = "/raster/mzs/flood/{name}/{x}/{y}/{z}",
            method = RequestMethod.GET
    )
    public @ResponseBody byte[] getMzsFloodRasterTiles(
            @PathVariable String name, @PathVariable String x, @PathVariable String y, @PathVariable String z
    ) throws Exception {
        return rasterTileService.getMzsFloodRasterInByte(name, Integer.parseInt(z), Integer.parseInt(x), Integer.parseInt(y));
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

    @CrossOrigin
    @RequestMapping(
            value = "/raster/image/base/{x}/{y}/{z}",
            method = RequestMethod.GET
    )
    public @ResponseBody byte[] getBaseImageTiles(
            @PathVariable String x, @PathVariable String y, @PathVariable String z
    ) throws Exception {
        return rasterTileService.getBaseImageInByte(Integer.parseInt(z), Integer.parseInt(x), Integer.parseInt(y));
    }
}
