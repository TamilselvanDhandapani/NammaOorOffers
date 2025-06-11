import { useContext } from "react";
import AnalyticsContext from "../context/AnalyticsContext";

 const useAnalytics = () => useContext(AnalyticsContext);


 export default useAnalytics;