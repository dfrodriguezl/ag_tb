import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { loadModules} from "esri-loader";
import { Indicador } from "../models/indicador";
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {SelectItem} from 'primeng/api';
import { environment } from "../../environments/environment.prod";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {


  // @ViewChild('mapViewNode',{static: false}) private mapViewEl: ElementRef;
  urlServicioRegion:String = environment.url_servicio_region;
  urlServicioDepto: String = environment.url_servicio_depto;
  urlServicioMcipio: String = environment.url_servicio_mcipio;
  indicadores: Indicador[] = [];
  resultQuery =  [];
  region = [];
  departamento = [];
  regiones: SelectItem[];
  departamentos: SelectItem[];
  selectedRegion: String;
  selectedDepartamento: String;

  constructor() { 

  }

  ngOnInit() {
    // this.ConsultaServicio();
    // this.indicadores = this.ConsultaServicio();
    this.ConsultaServicio();
    
  }

  ConsultaServicio(){
    let res:Indicador[] = [];
    let resDep:Indicador[] = [];
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
        url: this.urlServicioRegion
      });

      var queryDep = new Query();
      queryDep.where = "1=1";
      queryDep.outFields = ["*"];
      queryDep.returnGeometry = false;
      queryDep.orderByFields = ["id_indicador"]
  
      var querytaskDep = new QueryTask({
        url: this.urlServicioDepto
      });
        
      
  
      querytask.execute(query)
        .then(result => {
          this.resultQuery = result.features;
          this.resultQuery.forEach( (v,i) => {   
            let ind: Indicador;       
            ind = v.attributes;
            ind.muy_alta = Math.round(Number(ind.muy_alta)).toLocaleString('es');
            ind.alta = Math.round(Number(ind.alta)).toLocaleString('es');
            ind.media = Math.round(Number(ind.media)).toLocaleString('es');
            ind.baja = Math.round(Number(ind.baja)).toLocaleString('es');
            ind.muy_baja = Math.round(Number(ind.muy_baja)).toLocaleString('es');
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

          

          

          // this.region.forEach((v,i) => {
          //   let sel = {
          //     label:v,
          //     value: v
          //   };
          //   this.regiones.push(sel); 
          // });
          console.log(this.regiones);
        })
        .otherwise(e => {
          console.log(e);
        })

        querytaskDep.execute(queryDep)
        .then(result => {
          this.resultQuery = result.features;
          this.resultQuery.forEach( (v,i) => {   
            let ind: Indicador;       
            // console.log(v.attributes);

            ind = v.attributes;
            resDep.push(ind);
            // console.log(typeof(this.indicadores));
            // console.log(v.attributes);
          })
          // console.log(this.indicadores);
          this.PrintJson();
          this.departamento = this.getDistinctDeptos(resDep).sort();
          let select = document.getElementById("departamento_");
          for(let i = 0; i< this.departamento.length; i++){
            let opt = this.departamento[i];
            let el = document.createElement("option");
            el.text = opt;
            el.value = opt;
            select.appendChild(el);
          }

          

          

          // this.region.forEach((v,i) => {
          //   let sel = {
          //     label:v,
          //     value: v
          //   };
          //   this.regiones.push(sel); 
          // });
          // console.log(this.regiones);
        })
        .otherwise(e => {
          console.log(e);
        })
  
        
        
  
    })
    .catch(err => {
      console.log(err);
    })
  // return this.indicadores;
  // return res;
  this.indicadores = res;
  }


  getDepto($event){
    this.indicadores = null;
    console.log(this.indicadores);
    let resDep:Indicador[] = [];
    let depto = $event.target.options[$event.target.options.selectedIndex].text;
    console.log(depto);
    if(depto != 'TODOS'){
    
    loadModules([
      'esri/tasks/support/Query',
      'esri/tasks/QueryTask'
    ])
    .then(([Query, QueryTask]) => {
      var query = new Query();
      query.where = "descripcion='" + depto + "'";
      query.outFields = ["*"];
      query.returnGeometry = false;
      query.orderByFields = ["id_indicador"]
  
      var querytask = new QueryTask({
        url: this.urlServicioDepto
      });

      querytask.execute(query)
        .then(result => {
          this.resultQuery = result.features;
          this.resultQuery.forEach( (v,i) => {   
            let ind: Indicador;       
            ind = v.attributes;
            ind.muy_alta = Math.round(Number(ind.muy_alta)).toLocaleString('es');
            ind.alta = Math.round(Number(ind.alta)).toLocaleString('es');
            ind.media = Math.round(Number(ind.media)).toLocaleString('es');
            ind.baja = Math.round(Number(ind.baja)).toLocaleString('es');
            ind.muy_baja = Math.round(Number(ind.muy_baja)).toLocaleString('es');
            resDep.push(ind);
            
            // console.log(typeof(this.indicadores));
            // console.log(v.attributes);
          })
          // console.log(resDep);
          // console.log(this.indicadores);
          // this.PrintJson();
          // this.region = this.getDistinct(this.indicadores);
          // let select = document.getElementById("region_");
          // for(let i = 0; i< this.region.length; i++){
          //   let opt = this.region[i];
          //   let el = document.createElement("option");
          //   el.text = opt;
          //   el.value = opt;
          //   select.appendChild(el);
          // }

          

          

          // this.region.forEach((v,i) => {
          //   let sel = {
          //     label:v,
          //     value: v
          //   };
          //   this.regiones.push(sel); 
          // });
          // console.log(this.regiones);
        })
        .otherwise(e => {
          console.log(e);
        })

      
    })
    this.indicadores = resDep;
    console.log(this.indicadores);
  }else{
    let selectDepto = document.getElementById("departamento_");
    let selectRegion = document.getElementById("region_");
    selectDepto.innerHTML = "";
    selectRegion.innerHTML = "";
    let el = document.createElement("option");
    let opt = "TODOS";
    el.text = opt;
    el.value = opt;
    selectDepto.appendChild(el);
    this.ConsultaServicio(); 

  }
  }


  PrintJson(){
    console.log(this.selectedRegion);
  }

  getDistinct(array){
    const distinct = [...new Set(array.map(x => x.region))];
    return distinct;
  }

  getDistinctDeptos(array){
    const distinct = [...new Set(array.map(x => x.descripcion))];
    return distinct;
  }

  UpdateMcipios($event){
    let depto = $event.target.options[$event.target.options.selectedIndex].text;
    console.log(depto);
    let DistMun = [];
    let selectMcipio = document.getElementById("municipio_");
    selectMcipio.innerHTML = "";
    let el = selectMcipio.appendChild(document.createElement("option"));
    el.text = "TODOS";
    el.value = "TODOS";
    
    loadModules([
      'esri/tasks/support/Query',
      'esri/tasks/QueryTask'
    ])
    .then(([Query, QueryTask]) => {
      var query = new Query();
      query.where = "depto='" + depto + "'";
      query.outFields = ["descripcion"];
      query.returnGeometry = false;
      query.returnDistinctValues = true;
      query.orderByFields = ["descripcion"]
  
      var querytask = new QueryTask({
        url: this.urlServicioMcipio
      });

      querytask.execute(query)
      .then(result => {
        this.resultQuery = result.features;
        this.resultQuery.forEach( (v,i) => { 
          DistMun.push(v.attributes);
        });
        console.log(DistMun);
          let select = document.getElementById("municipio_");
          for(let i = 0; i< DistMun.length; i++){
            let opt = DistMun[i].descripcion;
            let el = document.createElement("option");
            el.text = opt;
            el.value = opt;
            select.appendChild(el);
          }
      });

    })
  }

  getMcipio($event){
    let mcipio = $event.target.options[$event.target.options.selectedIndex].text;
    console.log(mcipio);
    let resMun: Indicador[] = [];
    if(mcipio != 'TODOS'){
    loadModules([
      'esri/tasks/support/Query',
      'esri/tasks/QueryTask'
    ])
    .then(([Query, QueryTask]) => {
      var query = new Query();
      query.where = "descripcion='" + mcipio + "'";
      query.outFields = ["*"];
      query.returnGeometry = false;
      query.orderByFields = ["id_indicador"]

  
      var querytask = new QueryTask({
        url: this.urlServicioMcipio
      });

      querytask.execute(query)
        .then(result => {
          this.resultQuery = result.features;
          this.resultQuery.forEach( (v,i) => {   
            let ind: Indicador;       
            ind = v.attributes;
            ind.muy_alta = Math.round(Number(ind.muy_alta)).toLocaleString('es');
            ind.alta = Math.round(Number(ind.alta)).toLocaleString('es');
            ind.media = Math.round(Number(ind.media)).toLocaleString('es');
            ind.baja = Math.round(Number(ind.baja)).toLocaleString('es');
            ind.muy_baja = Math.round(Number(ind.muy_baja)).toLocaleString('es');
            resMun.push(ind);
            
            // console.log(typeof(this.indicadores));
            // console.log(v.attributes);
          })
          // console.log(resDep);
          // console.log(this.indicadores);
          // this.PrintJson();
          // this.region = this.getDistinct(this.indicadores);
          // let select = document.getElementById("region_");
          // for(let i = 0; i< this.region.length; i++){
          //   let opt = this.region[i];
          //   let el = document.createElement("option");
          //   el.text = opt;
          //   el.value = opt;
          //   select.appendChild(el);
          // }

          

          

          // this.region.forEach((v,i) => {
          //   let sel = {
          //     label:v,
          //     value: v
          //   };
          //   this.regiones.push(sel); 
          // });
          // console.log(this.regiones);
        })
        .otherwise(e => {
          console.log(e);
        })

      
    })
    this.indicadores = resMun;
    console.log(this.indicadores);
  }else{
    let selectMcipio = document.getElementById("municipio_");
    let selectDepto = document.getElementById("departamento_");
    let selectRegion = document.getElementById("region_");
    selectMcipio.innerHTML = "";
    selectDepto.innerHTML = "";
    selectRegion.innerHTML = "";
    let el = document.createElement("option");
    let opt = "TODOS";
    el.text = opt;
    el.value = opt;
    selectDepto.appendChild(el);
    selectMcipio.appendChild(el);
    this.getDepto($event);
  }
  }
}
