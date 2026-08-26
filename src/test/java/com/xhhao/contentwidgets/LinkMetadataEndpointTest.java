package com.xhhao.contentwidgets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.net.InetAddress;
import org.junit.jupiter.api.Test;

public class LinkMetadataEndpointTest {

    @Test
    void detectsSupportedPlatforms() {
        assertEquals("github", LinkMetadataEndpoint.detectPlatform("github.com"));
        assertEquals("bilibili", LinkMetadataEndpoint.detectPlatform("www.bilibili.com"));
        assertEquals("behance", LinkMetadataEndpoint.detectPlatform("www.behance.net"));
        assertEquals("xiaohongshu", LinkMetadataEndpoint.detectPlatform("xhslink.com"));
        assertEquals("xinpianchang", LinkMetadataEndpoint.detectPlatform("www.xinpianchang.com"));
        assertEquals("website", LinkMetadataEndpoint.detectPlatform("example.com"));
    }

    @Test
    void normalizesSharedUrlAndRejectsUnsafeTargets() {
        assertEquals(
            "https://github.com/acanyo/plugin-content-widgets",
            LinkMetadataEndpoint.normalizeAndValidate(
                "参考链接：https://github.com/acanyo/plugin-content-widgets。"
            ).toString()
        );
        assertThrows(
            IllegalArgumentException.class,
            () -> LinkMetadataEndpoint.normalizeAndValidate("javascript:alert(1)")
        );
        assertThrows(
            IllegalArgumentException.class,
            () -> LinkMetadataEndpoint.normalizeAndValidate("http://127.0.0.1")
        );
        assertThrows(
            IllegalArgumentException.class,
            () -> LinkMetadataEndpoint.normalizeAndValidate("https://example.com:7897")
        );
    }

    @Test
    void rejectsIpv4MappedLoopbackAddresses() throws Exception {
        var mappedLoopback = InetAddress.getByAddress(
            new byte[] {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, (byte) 0xff, (byte) 0xff, 127, 0, 0, 1}
        );
        assertFalse(LinkMetadataEndpoint.isPublicAddress(mappedLoopback));

        var mappedPrivateAddress = InetAddress.getByAddress(
            new byte[] {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, (byte) 0xff, (byte) 0xff, 10, 0, 0, 1}
        );
        assertFalse(LinkMetadataEndpoint.isPublicAddress(mappedPrivateAddress));
    }
}
