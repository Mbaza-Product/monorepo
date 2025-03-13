package com.digital.umuganda.mbazaussd.helpers;

import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;

import com.digital.umuganda.mbazaussd.entity.AlphaCode;
import com.digital.umuganda.mbazaussd.entity.Category;
import com.digital.umuganda.mbazaussd.entity.ZammadDistrict;
import com.digital.umuganda.mbazaussd.entity.ZammadUser;
import com.digital.umuganda.mbazaussd.entity.address.Province;

public class Zammad {
    public static ZammadUser generateUser(String phoneNumber, String password) {
        ZammadUser user = new ZammadUser();
        user.setLogin(phoneNumber);
        user.setPassword(password);
        return user;
    }

    public static String generateBasicAuth(String username, String password) {
        String authString = username + ":" + password;
        byte[] authEncBytes = Base64.getEncoder().encode(authString.getBytes());
        String authStringEnc = new String(authEncBytes);

        return authStringEnc;
    }

    public static String encrypt(String input, String secretKey) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, keySpec);
        byte[] encryptedBytes = cipher.doFinal(input.getBytes());
        return Base64.getEncoder().encodeToString(encryptedBytes);
    }

    public static String decrypt(String encryptedInput, String secretKey) throws Exception {
        SecretKeySpec keySpec = new SecretKeySpec(secretKey.getBytes(), "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, keySpec);
        byte[] encryptedBytes = Base64.getDecoder().decode(encryptedInput);
        byte[] decryptedBytes = cipher.doFinal(encryptedBytes);
        return new String(decryptedBytes);
    }

    public static String formatAddress(ZammadDistrict district, AlphaCode code) {
        StringBuilder sb = new StringBuilder();

        sb.append(district.getName());

        Province province = district.getProvince();

        if (province != null) {
            switch (code) {
                case EN:
                    sb.append(", " + province.getNameEn());
                    break;
                case FR:
                    sb.append(", " + province.getNameFr());
                    break;
                default:
                    sb.append(", " + province.getNameRw());
                    break;
            }
        }

        String response = sb.toString();

        return response;

    }

    public static String formatComplaint(Category category) {
        StringBuilder sb = new StringBuilder();

        Category parent = category.getParent();
        if (parent != null) {
            sb.append("Category: " + parent.getName() + "\n");
        }

        sb.append("Complaint: " + category.getName() + "\n");

        return sb.toString();
    }
}
