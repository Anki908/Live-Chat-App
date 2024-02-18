import { useEffect, useState } from "react"
import { baseUrl, getRequest } from "../utils/service";

export const useFetchRecp = ( chat , user ) => {

    const[recpUser , setRecpUser] = useState(null);
    const[error , setError] = useState(null);

    const recpId = chat?.members?.find((id) => id !== user?._id)

    useEffect(() => {
        const getUser = async() => {
            if(!recpId) return null;
            const response = await getRequest(`${baseUrl}/user/finduser/${recpId}`);
            if(response.error){
                return setError(response);
            }
            console.log(response);
            setRecpUser(response);
        }
        getUser();
    } , [recpId]);
    return {recpUser};
}