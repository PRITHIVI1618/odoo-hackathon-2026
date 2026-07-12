package com.ecosphere.backend.repository;

import com.ecosphere.backend.entity.CSRActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CSRActivityRepository extends JpaRepository<CSRActivity, Long> {
    List<CSRActivity> findByStatus(String status);
}
