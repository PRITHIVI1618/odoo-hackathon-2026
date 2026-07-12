package com.ecosphere.backend.repository;

import com.ecosphere.backend.entity.CarbonTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarbonTransactionRepository extends JpaRepository<CarbonTransaction, Long> {
    List<CarbonTransaction> findByDepartmentId(Long departmentId);
}
