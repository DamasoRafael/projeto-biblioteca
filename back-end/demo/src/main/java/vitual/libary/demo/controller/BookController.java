package vitual.libary.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
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
        return new ResponseEntity<>(savedBook, HttpStatus.CREATED); // Status 201
    }

    // GET /api/books - READ ALL
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.listarTodos(); // Status 200
    }

    // GET /api/books/{id} - READ ONE
    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        // O serviço lança BookNotFoundException (retorna 404)
        return bookService.buscarPorId(id); // Status 200 ou 404
    }

    // PUT /api/books/{id} - UPDATE
    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @Valid @RequestBody Book bookDetails) {
        // O serviço lança BookNotFoundException (retorna 404)
        return bookService.atualizar(id, bookDetails); // Status 200 ou 404
    }

    // DELETE /api/books/{id} - DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        // O serviço lança BookNotFoundException se não encontrado
        bookService.deletar(id);
        return ResponseEntity.noContent().build(); // Status 204
    }
}