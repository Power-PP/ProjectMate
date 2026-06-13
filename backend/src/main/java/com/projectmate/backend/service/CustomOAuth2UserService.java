package com.projectmate.backend.service;

import com.projectmate.backend.model.User;
import com.projectmate.backend.model.User.AuthProvider;
import com.projectmate.backend.repository.UserRepository;
import com.projectmate.backend.security.CustomUserDetails;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        
        return processOAuth2User(registrationId, oAuth2User);
    }

    private OAuth2User processOAuth2User(String registrationId, OAuth2User oAuth2User) {
        String email = null;
        String name = null;
        String providerId = null;
        AuthProvider provider = null;

        if ("google".equalsIgnoreCase(registrationId)) {
            email = oAuth2User.getAttribute("email");
            name = oAuth2User.getAttribute("name");
            providerId = oAuth2User.getAttribute("sub");
            provider = AuthProvider.GOOGLE;
        } else if ("github".equalsIgnoreCase(registrationId)) {
            email = oAuth2User.getAttribute("email");
            name = oAuth2User.getAttribute("name");
            if (!StringUtils.hasText(name)) {
                name = oAuth2User.getAttribute("login");
            }
            Object idObj = oAuth2User.getAttribute("id");
            providerId = idObj != null ? idObj.toString() : null;
            provider = AuthProvider.GITHUB;
        }

        if (!StringUtils.hasText(email)) {
            if (provider == AuthProvider.GITHUB && providerId != null) {
                email = name + "+" + providerId + "@users.noreply.github.com";
            } else {
                throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
            }
        }

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (user.getProvider() == null) {
                user.setProvider(provider);
                user.setProviderId(providerId);
                user = userRepository.save(user);
            }
        } else {
            user = User.builder()
                    .name(name)
                    .email(email)
                    .provider(provider)
                    .providerId(providerId)
                    .build();
            user = userRepository.save(user);
        }

        return new CustomUserDetails(user, oAuth2User.getAttributes());
    }
}
