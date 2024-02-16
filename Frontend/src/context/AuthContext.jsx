import { createContext , useCallback, useState } from "react";
import { baseUrl, postRequest } from "../utils/service";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user , setUser] = useState(null);
    const [registerInfo , setRegisterInfo] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [registerError , setRegisterError] = useState(null);
    const [isRegisterLoading , setIsRegisterLoading] = useState(false);

   // console.log(registerInfo);
    const updateRegisterInfo = useCallback((info ) => {
        setRegisterInfo(info);
    },[])

    const registerUser = useCallback(async (e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        setRegisterError(null);

        const response = await postRequest(`${baseUrl}/user/signup` , JSON.stringify(registerInfo));
        setIsRegisterLoading(false);

        if(response.error){
            return setRegisterError(response);
        }
        localStorage.setItem("User" , JSON.stringify(response));
        setUser(response);
    })

    return (
        <AuthContext.Provider value={{
            user,
            registerInfo,
            updateRegisterInfo,
            registerError,
            registerUser,
            isRegisterLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};