import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
toast.configure();

export const Notify =(message,type='info')=>{
    toast[type](message,{position:"top-center",hideProgressBar:true,autoClose:1000,});
}
