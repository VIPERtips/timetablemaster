package com.vipertips.timetable.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.vipertips.timetable.filter.JwtAuthenticationFilter;
import com.vipertips.timetable.repository.UserRepository;


@Service
public class UserDetailsImpl implements UserDetailsService {
	@Autowired
	private UserRepository userRepository;
	
	 private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		logger.info("Trying to find user by: {} ",email);
		return userRepository.findByEmail(email)
	            .orElseThrow(() -> {
	               
	                return new UsernameNotFoundException("User not found: " + email);
	            });
	}

}
