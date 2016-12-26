import { Component } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { PlaceProvider } from '../../providers/place-provider';
import { PlaceAddPage } from '../../pages/place-add/place-add';
import { PlaceShowPage } from '../../pages/place-show/place-show';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'page-place-list',
  templateUrl: 'place-list.html'
})

export class PlaceListPage {

  searchTerm: string = '';
  searchControl: FormControl;
  places: any[];
  searching: any = false;

  constructor (
  	public navCtrl: NavController, 
  	public modalCtrl: ModalController,
  	public placeProvider: PlaceProvider) {

      this.searchControl = new FormControl();
  }

  ngOnInit(): void {
    this.placeProvider.getAllPlaces()
      .then(places => this.places = places)
      .catch(error => console.log(error));
  }

  ionViewDidLoad() {
    this.setFilteredItems();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  onSearchInput() {
    this.searching = true;
  }
 
  setFilteredItems() {
    this.places = this.placeProvider.filterItems(this.searchTerm);
  }

  getAll() { 
    this.placeProvider.getAllPlaces();
    //alert(this.placeProvider.places);
  }


  showItem(place) {
    this.placeProvider.getPlace(place);
    this.navCtrl.push(PlaceShowPage, {place: place});
  }

  addItem() {
    let addModal = this.modalCtrl.create(PlaceAddPage);
    // call back when modal dismissed
    addModal.onDidDismiss((data) => {
      if(data){
        this.saveItem(data); //Armazena no banco de dados
        //this.places.push(data); //Inclui no this.places (array)
        this.places.unshift(data); //Inclui no inicio this.places (array)
      }
    });
    addModal.present();
  }
 
  saveItem(data) {
    this.placeProvider.placeSave(data);
  } 

  doRefresh(refresher) {
    setTimeout(() => {
      this.ngOnInit();
      refresher.complete();
    }, 2000);
  } 
 		 
}