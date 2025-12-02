package vitual.libary.demo.security;

import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.*;

/**
 * Anotação para proteger endpoints que requerem permissão de BIBLIOTECARIO
 * 
 * Uso: @RequiresLibrarian
 *      public ResponseEntity<Book> createBook(...) { ... }
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@PreAuthorize("hasAuthority('BIBLIOTECARIO')")
public @interface RequiresLibrarian {
}
