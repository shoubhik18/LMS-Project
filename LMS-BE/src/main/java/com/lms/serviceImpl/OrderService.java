package com.lms.serviceImpl;

import java.util.Optional;

import com.lms.repository.OrderRepo;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.lms.dto.OrderDto;
import com.lms.dto.TransDetailsDto;
import com.lms.entity.OrderEntity;
import com.lms.repository.OrderRepo;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

    private static final String key_id = "rzp_test_TmccVtYk270x2a";
    private static final String key_secret = "8Q5i53RABxRiG5fUQKiRoWJh";
    private static final String currency = "INR";

    @Autowired
    private OrderRepo or;

    @Transactional
    public TransDetailsDto createTrans(Double amount) throws RazorpayException {

        JSONObject jo = new JSONObject();
        jo.put("amount", amount * 100);
        jo.put("currency", currency);

        RazorpayClient rc = new RazorpayClient(key_id, key_secret);
        com.razorpay.Order create = rc.orders.create(jo);

        TransDetailsDto td = new TransDetailsDto(create.get("id").toString(), create.get("currency").toString(),
                create.get("amount"), key_id);

        OrderEntity oe = new OrderEntity();
        oe.setAmount(Double.valueOf(amount * 100).intValue());
        oe.setCurrency(currency);
        oe.setOrderid(create.get("id").toString());

        or.save(oe);
        return td;
    }

    public void saveTrans(OrderDto dto) {
        Optional<OrderEntity> findByOrderid = or.findByOrderid(dto.getOrderid());

//        findByOrderid.get().setTransactionid(dto.getTransactionid());

        findByOrderid.ifPresent(orderEntity -> {
            orderEntity.setTransactionid(dto.getTransactionid());
            or.save(orderEntity);
        });

    }

}
