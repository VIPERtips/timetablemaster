package com.vipertips.timetable.config;


import java.util.Arrays;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.vipertips.timetable.filter.JwtAuthenticationFilter;
import com.vipertips.timetable.service.UserDetailsImpl;



@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsImpl userDetailsImpl;

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable()) 
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration corsConfig = new CorsConfiguration();
                    corsConfig.setAllowedOrigins(Arrays.asList(
                            "http://localhost:8081",
                            
                           "http://localhost:8080"
                    ));
                    corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
                    corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
                    corsConfig.setAllowCredentials(true);
                    corsConfig.setExposedHeaders(Arrays.asList("Authorization"));

                    return corsConfig;
                }))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**","/static/**","/index.html","/api/public/**","/health","/api/reviews/{businessId}").permitAll()
                        .requestMatchers( "/swagger-ui/**", "/v3/api-docs/**","/h2-console/**").permitAll()
                        .requestMatchers("/error").permitAll()
                        
                        .anyRequest().authenticated()
                )
                .formLogin().disable() 
                .httpBasic().disable() 
                .userDetailsService(userDetailsImpl)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch("/api/**")
                .build();
    }
}


