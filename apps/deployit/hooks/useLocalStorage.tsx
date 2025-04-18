import { useState } from "react";

export const useLocalStorage = (key: string, initialValue: boolean) => {


 const  [storedValue, setStoredValue] = useState(() => {
    try{
        if(typeof window === "undefined")
            return initialValue
       const item = window.localStorage.getItem(key)
       return item ? JSON.parse(item) : initialValue
    }catch(error) {
        console.error(error)
        return initialValue
    }
 })



 const setValue = (value: boolean | ((val: boolean) => boolean)) => {
    try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
            value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
    } catch (error) {
        console.error(error);
    }
}

return [storedValue, setValue] as const
}