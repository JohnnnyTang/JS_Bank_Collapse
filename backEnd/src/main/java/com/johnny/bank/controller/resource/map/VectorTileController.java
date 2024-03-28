package com.johnny.bank.controller.resource.map;

import com.johnny.bank.service.resource.map.impl.RasterTileService;
import com.johnny.bank.service.resource.map.impl.VectorTileService;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/27
 * @Description:
 */
@RestController
@RequestMapping("api/v1/tile/")
@Slf4j
public class VectorTileController {

    private final VectorTileService vectorTileService;
    private final RasterTileService rasterTileService;


    @Autowired
    public VectorTileController(VectorTileService vectorTileService, RasterTileService rasterTileService) {
        this.vectorTileService = vectorTileService;
        this.rasterTileService = rasterTileService;
    }

    @CrossOrigin
    @RequestMapping(value = "/vector/contour/{year}/{tide}/{x}/{y}/{z}", method = RequestMethod.GET)
    public void getVectorTiles(@PathVariable String year, @PathVariable String tide,@PathVariable int x, @PathVariable int y, @PathVariable int z, HttpServletResponse response) throws Exception {
        byte[] tileRes = vectorTileService.getContourVectorTiles(x, y, z, year, tide);
        ServletOutputStream sos = null;
        try {
            response.setContentType("application/octet-stream");
            sos = response.getOutputStream();
            sos.write(tileRes);
            sos.flush();
            sos.close();
        } catch (Exception e) {
            log.error(e.getMessage());
            try {
                if (sos != null) {
                    sos.close();
                }
            } catch (Exception exception) {
                log.error(exception.getMessage());
                throw new Exception(exception.getMessage());
            }
            throw new Exception("vector tile error");
        }
    }

    @CrossOrigin
    @RequestMapping(
            value = "/raster/mzs/{year}/{tide}/{x}/{y}/{z}",
            method = RequestMethod.GET
    )
    public @ResponseBody byte[] getRasterTiles(@PathVariable String year, @PathVariable String tide,@PathVariable String x, @PathVariable String y, @PathVariable String z) throws Exception {
        return rasterTileService.getMXZRasterInByte(year, tide, Integer.parseInt(z), Integer.parseInt(x), Integer.parseInt(y));
    }
}
