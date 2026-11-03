package com.xhhao.contentwidgets.mcp;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.io.InputStream;

/** 从 classpath 加载构建期生成的 {@code content-widgets-manifest.json}。 */
public class WidgetManifestLoader {

    private static final String DEFAULT_RESOURCE = "/content-widgets-manifest.json";

    private final ObjectMapper objectMapper;

    public WidgetManifestLoader() {
        this(new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false));
    }

    WidgetManifestLoader(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public WidgetManifest load() {
        return load(DEFAULT_RESOURCE);
    }

    WidgetManifest load(String resource) {
        try (InputStream input = getClass().getResourceAsStream(resource)) {
            if (input == null) {
                throw new IllegalStateException("Classpath resource not found: " + resource);
            }
            return read(input);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to read " + resource, e);
        }
    }

    public WidgetManifest read(InputStream input) throws IOException {
        return objectMapper.readValue(input, WidgetManifest.class);
    }
}
