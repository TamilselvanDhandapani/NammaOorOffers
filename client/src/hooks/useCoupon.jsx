import { useContext } from "react";
import CouponContext from "../context/CouponContext";

const useCoupon = () => useContext(CouponContext);

export default useCoupon;

