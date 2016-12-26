import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PlaceProvider } from '../../providers/place-provider';

@Component({
  selector: 'page-place-show',
  templateUrl: 'place-show.html'
})
export class PlaceShowPage {

  place: any;

  constructor (
  	public navCtrl: NavController,
  	public placeProvider: PlaceProvider,
  	private navParams: NavParams) {

  		this.place = navParams.get('place') || {};
  }

  ionViewDidLoad() {
    console.log('Hello PlaceShowPage Page');
  }

}
