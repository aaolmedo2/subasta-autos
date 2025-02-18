package ec.edu.espe.subasta.autos.service;

import ec.edu.espe.subasta.autos.api.DTO.UsuarioDTO;
import ec.edu.espe.subasta.autos.entity.UsuarioEntity;
import ec.edu.espe.subasta.autos.exception.InsertException;
import ec.edu.espe.subasta.autos.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    private String msgError;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }


}
