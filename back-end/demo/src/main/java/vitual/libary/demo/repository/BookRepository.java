package vitual.libary.demo.repository;

import vitual.libary.demo.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    /**
     * Busca livros pelo título contendo a string fornecida (case-insensitive)
     * @param titulo parte do título a buscar
     * @param pageable informações de paginação e ordenação
     * @return página com livros encontrados
     */
    Page<Book> findByTituloContainingIgnoreCase(String titulo, Pageable pageable);
}