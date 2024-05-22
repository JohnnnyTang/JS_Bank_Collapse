package com.johnny.bank.model.resource.dataResource;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import org.springframework.data.annotation.Id;

import java.sql.Timestamp;

/**
 * @projectName: backEnd
 * @package: com.johnny.bank.model.resource.dataResource
 * @className: CollapseHistory
 * @author: Johnny Tang
 * @description: TODO
 * @date: 2024/1/24 14:58
 * @version: 1.0
 */
@Getter
@Setter
@EqualsAndHashCode()
@ToString()
@JsonInclude(JsonInclude.Include.NON_NULL)
@NoArgsConstructor
@Builder
public class DeviceWarning {
    @Id
    private String id;
    private String deviceId;
    private String deviceCode;
    private Timestamp warnTime;
    private double threeDiff;
    private Integer ifDealt;

    public DeviceWarning(
            String id, String deviceId, String deviceCode,
            Timestamp warnTime, double threeDiff, Integer ifDealt
    ) {
        this.id = id;
        this.deviceId = deviceId;
        this.deviceCode = deviceCode;
        this.warnTime = warnTime;
        this.threeDiff = threeDiff;
        this.ifDealt = ifDealt;
    }
}
