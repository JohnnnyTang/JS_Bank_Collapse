package com.johnny.bank.model.common;

import lombok.*;

/**
 * @Author: Johnny Tang
 * @Date: 2024/3/27
 * @Description:
 */
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@Data
public class DepthLineTileBox extends TileBox{
    String year;

    public DepthLineTileBox(TileBox tileBox, String year){
        this.name = tileBox.getName();
        this.projection = tileBox.getProjection();
        this.visualId = tileBox.getVisualId();
        this.xMax = tileBox.getXMax();
        this.xMin = tileBox.getXMin();
        this.yMax = tileBox.getYMax();
        this.yMin = tileBox.getYMin();
        this.year = year;
    }
}
