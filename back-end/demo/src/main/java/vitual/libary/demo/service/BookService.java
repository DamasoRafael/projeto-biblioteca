package vitual.libary.demo.service;

import org.springframework.stereotype.Service;
import vitual.libary.demo.entity.Book;
import vitual.libary.demo.exception.BookNotFoundException;
import vitual.libary.demo.repository.BookRepository;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    public List<Book> listarTodos() {
        return bookRepository.findAll();
    }

    public Book buscarPorId(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Livro não encontrado com ID: " + id));
    }

    public Book salvar(Book book) {
        return bookRepository.save(book);
    }

    public Book atualizar(Long id, Book dados) {
        Book existente = buscarPorId(id);

        existente.setTitulo(dados.getTitulo());
        existente.setAutor(dados.getAutor());
        existente.setAnoPublicacao(dados.getAnoPublicacao());
        existente.setIsbn(dados.getIsbn());

        return bookRepository.save(existente);
    }

    public void deletar(Long id) {
        Book existente = buscarPorId(id);
        bookRepository.delete(existente);
    }
}
