package com.xhhao.contentwidgets.theme;

import java.util.Properties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.PropertyPlaceholderHelper;
import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IModel;
import org.thymeleaf.model.IModelFactory;
import org.thymeleaf.processor.element.IElementModelStructureHandler;
import reactor.core.publisher.Mono;
import run.halo.app.plugin.PluginContext;
import run.halo.app.theme.dialect.TemplateHeadProcessor;

@Component
@RequiredArgsConstructor
public class ContentWidgetsHeadProcessor implements TemplateHeadProcessor {

    static final PropertyPlaceholderHelper PROPERTY_PLACEHOLDER_HELPER =
        new PropertyPlaceholderHelper("${", "}");

    private final PluginContext pluginContext;

    @Override
    public Mono<Void> process(ITemplateContext context, IModel model,
        IElementModelStructureHandler structureHandler) {
        final IModelFactory modelFactory = context.getModelFactory();
        model.add(modelFactory.createText(contentWidgetsAssets()));
        return Mono.empty();
    }

    private String contentWidgetsAssets() {
        final Properties properties = new Properties();
        properties.setProperty("name", pluginContext.getName());
        properties.setProperty("version", pluginContext.getVersion());

        return PROPERTY_PLACEHOLDER_HELPER.replacePlaceholders("""
            <!-- plugin-content-widgets start -->
            <link rel="stylesheet" href="/plugins/${name}/assets/static/content-widgets.css?version=${version}" />
            <script defer src="/plugins/${name}/assets/static/content-widgets.iife.js?version=${version}"></script>
            <!-- plugin-content-widgets end -->
            """, properties);
    }
}
