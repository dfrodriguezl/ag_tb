import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { loadModules} from "esri-loader";
import { Indicador } from "../models/indicador";
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {SelectItem} from 'primeng/api';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {


  // @ViewChild('mapViewNode',{static: false}) private mapViewEl: ElementRef;

  indicadores: Indicador[] = [];
  resultQuery =  [];
  region = [];
  regiones: SelectItem[];
  selectedRegion: String;

  constructor() { 
    this.regiones = [
      {label: "AMAZONIA", value: "AMAZONIA"},
      {label: "ORINOQUIA", value: "ORINOQUIA"}
    ]
  }

  ngOnInit() {
    // this.ConsultaServicio();
    this.indicadores = this.ConsultaServicio();
    
  }

  ConsultaServicio(){
    let res:Indicador[] = [];
    loadModules([
      'esri/tasks/support/Query',
      'esri/tasks/QueryTask'
    ])
    .then(([Query, QueryTask]) => {
      // const map = new EsriMap({
      //   basemap: 'streets'
      // });
  
      // const mapView = new EsriMapView({
      //   container: this.mapViewEl.nativeElement,
      //   center: [-74, 4],
      //   zoom: 10,
      //   map: map
      // });
  
      var query = new Query();
      query.where = "1=1";
      query.outFields = ["*"];
      query.returnGeometry = false;
      query.orderByFields = ["id_indicador"]
  
      var querytask = new QueryTask({
        url: 'http://apps.skaphe.com:6080/arcgis/rest/services/PSA_General/MapServer/1'
      });
        
      
  
      querytask.execute(query)
        .then(result => {
          this.resultQuery = result.features;
          this.resultQuery.forEach( (v,i) => {   
            let ind: Indicador;       
            ind = v.attributes;
            ind.muy_alta = Math.round(Number(ind.muy_alta)).toLocaleString('es');
            ind.alta = Math.round(Number(ind.alta)).toLocaleString('es');;
            ind.media = Math.round(Number(ind.media)).toLocaleString('es');;
            ind.baja = Math.round(Number(ind.baja)).toLocaleString('es');;
            ind.muy_baja = Math.round(Number(ind.muy_baja)).toLocaleString('es');;
            res.push(ind);
            // console.log(typeof(this.indicadores));
            // console.log(v.attributes);
          })
          // console.log(this.indicadores);
          this.PrintJson();
          this.region = this.getDistinct(this.indicadores);
          let select = document.getElementById("region_");
          for(let i = 0; i< this.region.length; i++){
            let opt = this.region[i];
            let el = document.createElement("option");
            el.text = opt;
            el.value = opt;
            select.appendChild(el);
          }

          this.region.forEach((v,i) => {
            let sel = {
              label:v,
              value: v
            };
            this.regiones.push(sel); 
          });
          console.log(this.regiones);
        })
        .otherwise(e => {
          console.log(e);
        })
  
        
        
  
    })
    .catch(err => {
      console.log(err);
    })
  // return this.indicadores;
  return res;
  }


  PrintJson(){
    console.log(this.selectedRegion);
  }

  getDistinct(array){
    const distinct = [...new Set(array.map(x => x.region))];
    return distinct;
  }

}
