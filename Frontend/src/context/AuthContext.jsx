import { createContext , useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/service";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user , setUser] = useState(null);
    const [registerInfo , setRegisterInfo] = useState({
        name: "",
        email: "",
        password: ""
    })
    const [loginInfo , setLoginInfo] = useState({
        email: "",
        password: ""
    })
    const [registerError , setRegisterError] = useState(null);
    const [isRegisterLoading , setIsRegisterLoading] = useState(false);

    const [loginError , setLoginError] = useState(null);
    const [isLoginLoading , setIsLoginLoading] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("User");
        setUser(JSON.parse(user));
    } , [])

   // console.log(registerInfo);
   //console.log(loginInfo);
    const updateRegisterInfo = useCallback((info ) => {
        setRegisterInfo(info);
    },[])

    const updateLoginInfo = useCallback((info ) => {
        setLoginInfo(info);
    },[])

    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    } , []);

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
        //console.log(response);
        setUser(response);
    } , [registerInfo])

    const loginUser = useCallback( async(e) => {
        e.preventDefault();
        setIsLoginLoading(true);
        setLoginError(null);
        const response = await postRequest(`${baseUrl}/user/signin` , JSON.stringify(loginInfo));
        setIsLoginLoading(false);
        if(response.error){
            return setLoginError(response);
        }
        localStorage.setItem("User" , JSON.stringify(response));
        //console.log(response);
        setUser(response);
    } , [loginInfo])

    return (
        <AuthContext.Provider value={{
            user,
            registerInfo,
            updateRegisterInfo,
            registerError,
            registerUser,
            isRegisterLoading,
            logoutUser,
            loginUser,
            loginError,
            loginInfo,
            updateLoginInfo,
            isLoginLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};