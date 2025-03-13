package com.digital.umuganda.mbazaussd.helpers;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Choice {
    private String choicesString;

    public Choice(String choicesString) {
        this.choicesString = choicesString;
    }

    public Map<String, Object> getChoices() {
        Map<String, Object> response = formatChoicesResponse();
        return response;
    }

    private Map<String, Object> formatChoicesResponse() {
        String[] lines = this.choicesString.split("\n");
        List<Map<String, String>> choices = Arrays.stream(lines)
                .filter(line -> line.matches("^\\d+\\) .*$"))
                .map(line -> {
                    String[] parts = line.split("\\) ");
                    String input = parts[0];
                    String text = parts[1];
                    return Map.of("input", input, "text", text);
                })
                .collect(Collectors.toList());
        String message = "";
        if (!lines[0].matches("^\\d+\\) .*$")) {
            message = lines[0];
        }
        Map<String, Object> response = new HashMap<>();
        if (!message.equals("")) {
            response.put("message", message);
        }
        response.put("choices", choices);
        return response;
    }
}
