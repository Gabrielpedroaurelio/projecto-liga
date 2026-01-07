import { useState } from "react";

export default function useGetData({data}) {
    const [getdata,setData]=useState({data})
    return {getdata,setData}
    
}