export class LocalStorage {

    SetStorage(key: string,data: any)
   {
     try
     {
      localStorage.setItem(key,JSON.stringify(data));
     }catch(e){
      console.log(e);
     }
   }

   GetStorage(key: string)
   {
     try
     {
    return JSON.parse(localStorage.getItem(key));
     }catch(e){
      console.log(e);
     }
   }

   RemoveStorage(key: string){
    try{
      localStorage.removeItem(key);
    }catch(e){
      console.log("error al remover "+e);
    }
   }

   RemoveAll(){
    try{
      localStorage.clear();
    }catch(e){
      console.log("error al remover "+e);
    }
   }
}
