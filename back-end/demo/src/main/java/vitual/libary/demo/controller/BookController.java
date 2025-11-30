package vitual.libary.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vitual.libary.demo.entity.Book;
import vitual.libary.demo.service.BookService;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // POST /api/books - CREATE
    @PostMapping
    public ResponseEntity<Book> createBook(@Valid @RequestBody Book book) {
        Book savedBook = bookService.salvar(book);
        return new ResponseEntity<>(savedBook, HttpStatus.CREATED);
    }

    // GET /api/books - READ ALL WITH PAGINATION AND SEARCH
    @GetMapping
    public Page<Book> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String titulo) {
        
        Pageable pageable = PageRequest.of(page, size);
        
        if (titulo != null && !titulo.trim().isEmpty()) {
            return bookService.buscarPorTitulo(titulo, pageable);
        }
        
        return bookService.listarTodos(pageable);
    }

    // GET /api/books/{id} - READ ONE
    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookService.buscarPorId(id);
    }

    // PUT /api/books/{id} - UPDATE
    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @Valid @RequestBody Book bookDetails) {
        return bookService.atualizar(id, bookDetails);
    }

    // DELETE /api/books/{id} - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}