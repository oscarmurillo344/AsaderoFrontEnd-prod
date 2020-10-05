import {Pipe,PipeTransform } from '@angular/core';


@Pipe({
    name:'convertir'
})

export class FilterArray implements PipeTransform{

    transform(value: any):any {
        if(value === '' || value.length < -1)return value;
        let restult='';
        for(const post of value){
            if(post.rolNombre ==='ROLE_USER'){
              if(value.length===1){
                restult+='User';
            }else{
                restult+='User,';
            }
         }
            if(post.rolNombre ==='ROLE_ADMIN'){
                if(value.length===1){
                    restult+='Admin';
                }else{
                    restult+='Admin,';
                }
            }
        }
        return restult;
    }

}