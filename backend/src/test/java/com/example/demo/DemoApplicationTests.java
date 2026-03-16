package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")  // ใช้ config แยกสำหรับ test
class DemoApplicationTests {

    @Test
    void contextLoads() {
    }
}