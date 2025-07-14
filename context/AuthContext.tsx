import { useContext, createContext, type PropsWithChildren, useEffect} from "react";
import { useStorageState } from "@/hooks/useStorageState";
import { router, Router } from "expo-router";
import axios from "axios";
import axiosInstance from "@/config/axiosConfig";

interface user{
    id: number,
    name: string,
    email: string,
    email_verifed_at: string | null,
    tickets: number | null
}
interface AuthContextType{
    signIn: (token :string ,user: user) => void,
    signOut: () => void,
    session?: string | null,
    user?: user | null,
    isLoading : boolean,
    updateUser: (useData: any) => Promise<void>
}
const AuthContext = createContext<AuthContextType>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    user: null,
    isLoading : false,
    updateUser: async() => {}
});
export function useSession(){
    const value = useContext(AuthContext);

    if(process.env.NODE_ENV !== 'production'){
        if(!value){
            throw new Error ('useSession must be wrapped in a <SessionProvider />') 
        }
    }
    return value
}
export function SessionProvider({children}: PropsWithChildren){
    const [[isLoading, session], setSession] = useStorageState('session');
    const [[,user],setUser] = useStorageState('user');

    const updateUser = async (useData: any) =>{
         await setUser(useData)
    }
    const signOut = async () =>{
          try{
            if(session){
                await axiosInstance.post('/api/logout',null ,{
                    headers: {
                        'Authorization' : `Bearer ${session}`
                    }
                })
            }
            setSession(null);
            setUser(null);
            router.replace('/sign-in')

          }catch(error){
            console.error('LogOut error: ', error);
            
          }
    }
    const loadUserInfo = async (token: string) =>{
         try{
     

               const respose = await axiosInstance.post('/api/user',null ,{
                    headers: {
                        'Authorization' : `Bearer ${session}`
                    }
                })
                setUser(JSON.stringify(respose.data))
            }catch(error){
              if(axios.isAxiosError(error) && error.response?.status == 401){
                    setSession(null);
                    setUser(null);
                    router.replace('/sign-in')
              }else{
                console.error('Error fetching user: ',error);
              }
            
            };
          
    };
      useEffect(()=>{
         if(session){
            loadUserInfo(session)
           }
       },[session]);


    const parsedUser = user ? (() => {
        try{
            return JSON.parse(user);
        }catch(error){
            console.error('fail to parse use: ',error);
            return null
        }
    }) (): null;

    const handleUserUpdate =async (useData: any) =>{
        try{
            const userString = JSON.stringify(useData);
            await setUser(userString);
        }catch(error){
            console.error('fail to update user: ',error);
            throw error
        }
    }
    const handleSignIn = async(token: string, userData: user)=>{
        try{
           await setSession(token);
           await setUser(JSON.stringify(userData));
        }catch(error){
             console.error('failed to sign in : ', error);
             throw error
        }
    }
    return(
        <AuthContext.Provider value={{
            signIn: handleSignIn,
            signOut: signOut,
            session,
            user: parsedUser,
            isLoading,
            updateUser: handleUserUpdate
        }}>
            {children}
        </AuthContext.Provider>

    );
}