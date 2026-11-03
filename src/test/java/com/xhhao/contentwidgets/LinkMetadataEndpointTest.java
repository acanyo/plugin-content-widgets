package com.xhhao.contentwidgets;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.net.InetAddress;
import java.net.UnknownHostException;
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
            LinkMetadataEndpoint.normalizeUrl(
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

    @Test
    void rejectsReservedAndDocumentationAddresses() throws Exception {
        for (var value : new String[] {
            "192.0.2.1",
            "198.51.100.10",
            "203.0.113.20",
            "240.0.0.1",
            "2001:db8::1"
        }) {
            assertFalse(
                LinkMetadataEndpoint.isPublicAddress(InetAddress.getByName(value)),
                value
            );
        }
    }

    @Test
    void rejectsPrivateMetadataAssets() {
        assertEquals(
            "",
            LinkMetadataEndpoint.firstPublicHttpUrl("http://127.0.0.1/private.png")
        );
        assertEquals(
            "https://8.8.8.8/favicon.ico",
            LinkMetadataEndpoint.firstPublicHttpUrl("https://8.8.8.8/favicon.ico")
        );
    }

    @Test
    void pinsValidatedDnsAnswersToTheRequestedHost() throws Exception {
        var expected = new InetAddress[] {
            InetAddress.getByAddress(new byte[] {8, 8, 8, 8})
        };
        var resolver = LinkMetadataEndpoint.pinnedDnsResolver("example.com", expected);

        assertArrayEquals(expected, resolver.resolve("EXAMPLE.COM"));
        assertThrows(
            UnknownHostException.class,
            () -> resolver.resolve("redirected.example.com")
        );

        var mutableResult = resolver.resolve("example.com");
        mutableResult[0] = InetAddress.getByAddress(new byte[] {1, 1, 1, 1});
        assertArrayEquals(expected, resolver.resolve("example.com"));
    }
}
