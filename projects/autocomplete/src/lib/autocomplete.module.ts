import { NgModule } from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AutocompleteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  exports: [
    AutocompleteComponent
  ]
})
export class NgAutocompletePluginModule { }
