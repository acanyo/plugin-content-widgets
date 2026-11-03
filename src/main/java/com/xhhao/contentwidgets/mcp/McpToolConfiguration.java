package com.xhhao.contentwidgets.mcp;

import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * 仅在安装了 MCP Server 插件时才注册 MCP 工具提供者。
 * 该 API 依赖为 compileOnly，运行时由 MCP Server 插件提供。
 */
@Configuration
@ConditionalOnClass(name = "run.halo.mcpserver.api.McpToolProvider")
public class McpToolConfiguration {

    @Bean
    WidgetManifestLoader widgetManifestLoader() {
        return new WidgetManifestLoader();
    }

    @Bean
    ContentWidgetsMcpToolProvider contentWidgetsMcpToolProvider(WidgetManifestLoader loader) {
        return new ContentWidgetsMcpToolProvider(loader);
    }
}
