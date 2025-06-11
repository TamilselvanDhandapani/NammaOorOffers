import { useContext } from "react";
import StoreContext from "../context/StoreContext";

const useStore = () => useContext(StoreContext);


export default useStore;
