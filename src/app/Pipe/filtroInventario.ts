import {Pipe,PipeTransform } from '@angular/core';


@Pipe({
    name:'filterInventario'
})

export class FilterInventario implements PipeTransform{

    transform(value: any, args: string):any {
        if(args === '' || args.length < 2)return value;
        const restult=[];
        for(let i=0;i < value.filteredData.length;i++){
            if(value.filteredData[i].productoId.nombre.toLowerCase().indexOf(args.toLowerCase()) > -1){
            restult.push(value.filteredData[i]);
            }
        }
        return restult;
    }

}