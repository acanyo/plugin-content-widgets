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

    // 与 packages/content-widgets/src/loader/registry.ts 中的标签保持一致
    static final String WIDGET_TAGS =
        "xhhao-com-alert,xhhao-com-badge,xhhao-com-button,xhhao-com-tab,xhhao-com-copy,"
            + "xhhao-com-folding,xhhao-com-tip,xhhao-com-blur,xhhao-com-timeline,xhhao-com-quote,"
            + "xhhao-com-chat,xhhao-com-task-list,xhhao-com-key,xhhao-com-card-list,xhhao-com-pdf,"
            + "xhhao-com-bilibili,xhhao-com-pic,xhhao-com-progress,xhhao-com-emoji-clock,"
            + "xhhao-com-status,xhhao-com-annotation,xhhao-com-command-group,xhhao-com-result,"
            + "xhhao-com-reading-time,xhhao-com-compare,xhhao-com-split,xhhao-com-stepper,"
            + "xhhao-com-note";

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
        properties.setProperty("widgetTags", WIDGET_TAGS);

        return PROPERTY_PLACEHOLDER_HELPER.replacePlaceholders("""
            <!-- plugin-content-widgets start -->
            <style id="xhhao-com-widgets-fouc">
            ${widgetTags}{visibility:hidden}
            @media print{${widgetTags}{visibility:visible}}
            </style>
            <noscript><style>${widgetTags}{visibility:visible!important}</style></noscript>
            <script type="module" src="/plugins/${name}/assets/static/content-widgets-loader.js?version=${version}"></script>
            <!-- plugin-content-widgets end -->
            """, properties);
    }
}
