import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { SQLite } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { PlaceProvider } from '../providers/place-provider';
import { PlaceListPage } from '../pages/place-list/place-list';
import { PlaceAddPage } from '../pages/place-add/place-add';
import { PlaceShowPage } from '../pages/place-show/place-show';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    PlaceListPage,
    PlaceAddPage,
    PlaceShowPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    PlaceListPage,
    PlaceAddPage,
    PlaceShowPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, SQLite, Storage, PlaceProvider]
})
export class AppModule {}
