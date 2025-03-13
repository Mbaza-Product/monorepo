package com.digital.umuganda.mbazaussd.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.digital.umuganda.mbazaussd.utils.GeneralUtils;

@RestController
public class GBVController {

    @Autowired
    private GeneralUtils generalUtils;

    Logger logger = LoggerFactory.getLogger(GBVController.class);

    @GetMapping(value = "/gbv", params = { "msisdn", "input", "newRequest" })
    public ResponseEntity<String> ussdHandler(@RequestParam(value = "msisdn") String msisdn,
            @RequestParam(value = "input") String input, @RequestParam(value = "newRequest") String isnewrequest) {

        try {
            int num = Integer.parseInt(input);
            if (num < 0 || num > 999) {
                input = "999";
            }
        } catch (Exception e) {
            input = "999";
        }

        msisdn = generalUtils.mssidnHashing(msisdn);
        String[] res = generalUtils.handler(input, isnewrequest, msisdn);

        if ((res[2].equals("1") || input.equals("0")) && res[3].equals("1")) {
            res = generalUtils.handler("1", "0", msisdn);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Freeflow", res[1]);
        headers.add("Cache-Control", "max-age=0");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "-1");
        headers.add("Expires", "-1");
        headers.add("Content-Type", "text/plain;charset=UTF-8");
        return ResponseEntity.ok().headers(headers).body(res[0]);
    }
}