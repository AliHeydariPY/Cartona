import { useEffect, useState } from "react";
import { getPayments } from "../../services/cartAPIServices";
import { getProduct } from "../../services/productAPIServices";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  
  useEffect(() => {
    const fetchPayments = async () => {
      const productPaymentsRes = await getPayments(``);
      const productPayments = await Promise.all(
        productPaymentsRes.data.map(async (productPayment) => {
            const product = await getProduct(productPayment.product)
            if(product.data.storekeeper == localStorage.getItem('storekeeperID')){
                return {...productPayment, product: product.data}
            } else {
                return null
            }
        })
      );
      console.log(productPayments.filter(Boolean))
    };
    fetchPayments();
  });

  return <div>payments</div>;
};

export default Payments;
