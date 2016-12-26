import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaceProvider } from '../../providers/place-provider';

@Component({
  selector: 'page-place-add',
  templateUrl: 'place-add.html'
})

export class PlaceAddPage {
	
	description;
  address;
  placeAddForm: FormGroup;
   
  constructor (
 		public navCtrl: NavController, 
 		public viewCtrl: ViewController,
    public formBuilder: FormBuilder,
    public dataService: PlaceProvider) {

      this.placeAddForm = formBuilder.group({
          'description': ['', Validators.required],
          'address': ['', Validators.required]
      });
 	}

  ionViewDidLoad() {
   	console.log('Hello AddItemPage Page');
  }

  saveItem() {
    let newItem = {
		  description: this.description,
      address: this.address
	  }; 
   	this.viewCtrl.dismiss(newItem);
 	}

 	close() {
   	this.viewCtrl.dismiss();
 	}
}
