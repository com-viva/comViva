package com.comviva;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling 
public class ComvivaApplication {

	public static void main(String[] args) {
		SpringApplication.run(ComvivaApplication.class, args);
	}

}
