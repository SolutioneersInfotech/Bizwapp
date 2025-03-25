import { useState } from "react";
import { useEffect } from "react";

const useGetContacts =  (url)=>{

    const [ data , setData ] = useState(null);
    const [ loading , setLoading] = useState(true);
    const [ error , setError ] = useState(null)

    useEffect(()=>{
        const fetchData = async () =>{
            try {
                const response = await fetch(url)
                if (!response.ok){
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json();
                setData(result)
            } catch (error) {
                setError(error.message)
            } finally{
                setLoading(false)
            }
        }
        fetchData();

    }, [url]);

    return { data , loading , error };
};

export default useGetContacts;
