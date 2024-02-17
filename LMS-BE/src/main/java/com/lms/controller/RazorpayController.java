package com.lms.controller;

        import com.lms.serviceImpl.OrderService;
        import org.springframework.beans.factory.annotation.Autowired;
        import org.springframework.web.bind.annotation.PathVariable;
        import org.springframework.web.bind.annotation.PostMapping;
        import org.springframework.web.bind.annotation.RequestBody;
        import org.springframework.web.bind.annotation.RestController;

        import com.razorpay.RazorpayException;
        import com.lms.dto.OrderDto;
        import com.lms.dto.TransDetailsDto;

@RestController
public class RazorpayController {

    @Autowired
    private OrderService os;

    @PostMapping("/ct/{amount}")
    public TransDetailsDto createTransaction(@PathVariable Double amount) throws RazorpayException {
        TransDetailsDto createTrans = os.createTrans(amount);

        return createTrans;
    }

    @PostMapping("/successtrans")
    public String saveTrans(@RequestBody OrderDto od) throws RazorpayException {

        os.saveTrans(od);
        return "Trans saved ";
    }
}

