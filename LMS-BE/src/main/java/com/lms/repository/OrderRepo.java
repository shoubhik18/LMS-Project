package com.lms.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lms.entity.OrderEntity;

public interface OrderRepo extends JpaRepository<OrderEntity, Integer> {

    Optional<OrderEntity> findByOrderid(String orderid);

}