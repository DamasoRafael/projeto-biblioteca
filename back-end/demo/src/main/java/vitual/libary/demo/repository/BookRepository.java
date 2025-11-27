package vitual.libary.demo.repository;

import vitual.libary.demo.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // Métodos CRUD básicos herdados.
}