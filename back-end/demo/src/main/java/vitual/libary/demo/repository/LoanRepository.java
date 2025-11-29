package vitual.libary.demo.repository;

import vitual.libary.demo.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    
    Optional<Loan> findByBookIdAndReturnedFalse(Long bookId);
}
