package ec.edu.espe.subasta.autos.security;

import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.io.IOException;
import java.security.MessageDigest;
import java.util.Collections;

public class JwtAuthorizationFilter extends OncePerRequestFilter {

    private static final String HEADER = "Authorization";

    private static final String PREFIX = "Bearer ";

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        try{
            if (checkJwtToken(request)) {
                Claims claims = validateJwtToken(request);

                if (claims.get("authority") != null) {
                    setUpSecurity(claims);
                } else {
                    SecurityContextHolder.clearContext();
                }
            } else {
                SecurityContextHolder.clearContext();
            }
            chain.doFilter(request, response);
        }
        catch (ExpiredJwtException | UnsupportedJwtException | MalformedJwtException e){
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.sendError(HttpServletResponse.SC_FORBIDDEN, e.getMessage());
        }

    }

    private boolean checkJwtToken(HttpServletRequest request){
        String authenticationHeader = request.getHeader(HEADER);
        return authenticationHeader != null && authenticationHeader.startsWith(PREFIX);
    }

    private Claims validateJwtToken(HttpServletRequest request){
        String jwtToken = request.getHeader(HEADER).replace(PREFIX, "");
        return Jwts.parser().setSigningKey(generateKeyFromSecret()).build().parseClaimsJws(jwtToken).getBody();
    }

    private void setUpSecurity(Claims claims) {
        SimpleGrantedAuthority simpleGrantedAuthority = new SimpleGrantedAuthority(claims.get("authority").toString());

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(claims.getSubject(),
                null,
                Collections.singletonList(simpleGrantedAuthority));
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    private SecretKey generateKeyFromSecret(){
        try {
            String secret = "CONTRASENIA: 1234";
            MessageDigest sha = MessageDigest.getInstance("SHA-512");
            byte[] keyBytes = sha.digest(secret.getBytes());
            return new SecretKeySpec(keyBytes, "HmacSHA512");
        } catch (Exception exception) {
            throw new RuntimeException("Erroe getting key: "+exception);
        }
    }
}
