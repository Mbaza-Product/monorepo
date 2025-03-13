package com.digital.umuganda.mbazaussd.utils;

public class testUtils {
    
public static String getStatusCode(String response){
    String code="";
    for (int i=1;i<=3;i++){
        char status=response.charAt(i);
        code=code+status;
    }

    return code;
}



}
