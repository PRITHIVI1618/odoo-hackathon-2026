package com.ecosphere.backend.repository;

import com.ecosphere.backend.entity.EmissionFactor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmissionFactorRepository extends JpaRepository<EmissionFactor, Long> {
}
