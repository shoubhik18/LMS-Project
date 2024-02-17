import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../service-floder/auth.service';


// declare var razorPay: any;
declare var Razorpay: any;

@Component({
  selector: 'app-razorpay',
  templateUrl: './razorpay.component.html',
  styleUrls: ['./razorpay.component.css'],
  // standalone:true
})

export class RazorpayComponent {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  baseUrl: any = this.auth.getBaseUrl();
  // orderId:any
  transactionDetails = {orderid:'',transactionid:''}

  allCourses = [
    { courseName: 'Java ', price: 10999 },
    { courseName: 'React ', price: 10999 },
    { courseName: 'Angular ', price: 10999 },
    { courseName: 'Python ', price: 10999 },
    { courseName: 'Java FullStack ', price: 25000 },
    { courseName: 'MERN Stack ', price: 25000 },
    { courseName: 'MEAN Stack ', price: 25000 },
    { courseName: 'Python FullStack ', price: 25000 },
    { courseName: 'DevOps ', price: 25000 },
  ];

  searchItems: any = this.allCourses;

  search(search: string) {
    this.searchItems = this.allCourses.filter((item: { courseName: string }) =>
      item.courseName.toLowerCase().includes(search.toLowerCase())
    );
  }

  payNow(course:any) {

    this.http.post(`${this.baseUrl}/ct/${course.price}`,null).subscribe((response:any)=>{
      console.log(response);
      // this.orderId = response.orderid
      // console.log(this.orderId);
      this.transactionDetails.orderid = response.orderid
    })

    const Razorpayoptions = {
      description: 'Sample razorpay',
      currency: 'INR',
      amount: course.price * 100,
      name: course.courseName,
      key: 'rzp_test_TmccVtYk270x2a',
      image: '../../assets/DL-logo.png',
      order_id: this.transactionDetails.orderid,
      handler: (response: any) => {
        console.log(response);
        this.transactionDetails.transactionid = response.razorpay_payment_id
        console.log(this.transactionDetails);
        
        // Send the payment ID to your backend for verification 
        this.http.post(`${this.baseUrl}/successtrans`,this.transactionDetails).subscribe((response:any)=>{
          console.log(response);
          
        })
      },
      prefill: {
        name: localStorage.getItem('username'),
        email: localStorage.getItem('email'),
      },
      theme: {
        color: '#570df8',
      },
      modal: {
        ondismiss: () => {
          console.log('dismissed');
        },
      },
    };

    const successCallBack = (paymentid:any)=>{
      console.log(paymentid);
    }

    const failureCallBack = (e:any)=>{
      console.log(e);
    }

    // razorPay.open(Razorpayoptions,successCallBack,failureCallBack)
    const rzp = new Razorpay(Razorpayoptions);
    rzp.open();

  }
}
