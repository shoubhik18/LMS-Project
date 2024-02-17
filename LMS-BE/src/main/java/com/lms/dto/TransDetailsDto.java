package com.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransDetailsDto {

    private String orderid;
    private String currency;
    private Integer amount;
    private String key;

}
