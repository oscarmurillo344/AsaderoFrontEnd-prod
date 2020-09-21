import {Pipe,PipeTransform } from '@angular/core';


@Pipe({
    name:'filter'
})

export class FilterPipe implements PipeTransform{

    transform(value: any, args: string):any {
        if(args === '' || args.length < 2)return value;
        const restult=[];
        for(const post of value){
            if(post.nombre.toLowerCase().indexOf(args.toLowerCase()) > -1){
            restult.push(post);
            }
        }
        return restult;
    }

}