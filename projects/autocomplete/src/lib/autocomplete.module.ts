import { NgModule } from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AutocompleteComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    AutocompleteComponent
  ]
})
export class NgAutocompletePluginModule { }
