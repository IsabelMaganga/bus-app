import { useState, useEffect, useCallback } from "react";
import * as SecureStore from 'expo-secure-store';

import { Platform } from 'react-native';

 const storage ={
   get: async(Key: string): Promise<string | null> =>{
     try{
        if(Platform.OS ==='web'){
            return localStorage.getItem(Key);
        }
        return await SecureStore.getItemAsync(Key)
     }catch(e){
         console.error('Storage is unavailable:', e);
         return null;
     }

   }, 
   set: async(Key: string ,value: string | null): Promise<void> =>{
             try{
                if(Platform.OS ==='web'){
                    value === null
                    ? localStorage.removeItem(Key)
                    : localStorage.setItem(Key, value)
                }else{
                    value === null 
                    ? await SecureStore.deleteItemAsync(Key)
                    : await SecureStore.setItemAsync(Key, value) 
                }
            }catch(e){
                console.error('Storage is unavailable:', e);

            }

   }
 };
 type StorageState = [[boolean,string|null], (value: string | null)=>void];

 export function useStorageState(Key: string): StorageState{

    const[isLoading, setIsLoading] = useState(true);
    const [value, setValue] = useState<string| null>(null);

    useEffect(()=>{
       storage.get(Key).then(value =>{
         setValue(value);
         setIsLoading(false);
       })
    }, [Key]);

    const updatevalue =useCallback((newValue: string | null)=>{
        setValue(newValue);
        storage.set(Key, value);
    },[Key]);

    return [[isLoading, value], updatevalue];
 }