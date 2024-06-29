import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TrackByFunction, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { CustomClassType, CustomNgStyleType } from '../types/autocomplete-type';

@Component({
  selector: 'ng-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() initialVisibleData = 1000;

  @Input() scrollThreshold = 3;

  @Input() totalRecords: number | undefined; // If user knows total number of records, it can be sent as props.

  @Input() dropdownData: any[] = [];

  searchedData: any[] = [];

  filteredData: any[] = [];

  @Input() objectProperty: string | undefined;

  @Input() disableProperty: string | undefined;

  @Input() noSearchResultMessage = 'No results found.';

  @Input() placeholder = 'Select a value.';

  @Input() isNumber = false;

  @Input() isAutoCompleteDisabled = false; // autocomplete disable option.

  @Input() isCustomSpinner = false;

  @Input() showLoadingSpinner = false; // option to enable spinner for api lazy load.
  showDataLoader = false;

  @Input() customClass: CustomClassType = {};

  @Input() customStyle: CustomNgStyleType = {};

  @Input() customTrackBy: TrackByFunction<any> | undefined;

  @Input() showdropDownArrow = true;

  @Input() showClearOption = true;

  @Input() triggerBlurEvent = false;
  @Output() emitBlurEvent = new EventEmitter(); // emits emit when autocomplete is closed or outside div clicked.

  @Input() triggerApiLoadEvent = false; // user has to send as true  to enable apilaztload event
  @Output() emitApiLoadEvent = new EventEmitter(); // when scroll is in botton, emit event for further API load.

  @Input() triggerAutoCompleteOpenEvent = false;
  @Output() emitAutoCompleteOpenEvent = new EventEmitter();

  /* No input required from user. Its mandatory to emit selected value. */
  @Output() emitSelectedValue = new EventEmitter(); // emits selected value.

  @Input() triggerClearSelectionEvent = false;
  @Output() emitClearSelectedEvent = new EventEmitter(); // emits event when selectedValue is cleared.

  @ViewChild('unOrderedList') unOrderedList!: ElementRef<HTMLElement>;

  @ViewChild('autoCompleteContainer') autoCompleteContainer!: ElementRef<HTMLElement>;

  @Input() searchFn: any;

  @Input() disableListFn: Function | undefined;

  @Input() isScrollThresholdRequired = false;

  @Input() ariaRole = 'autocomplete';

  @Input() ariaNoSearchResult = "No reults found.";

  @Input() ariaULList = "Parent List";

  @Input() ariaListContainer = "List container";

  @Input() ariaInputField = "Enter text to search autocomplete.";

  @Input() ariaInputLabel = "Automcomplete search";

  @Input() showInputlabel = false;

  @Input() inputLabel = "Enter or Search value";

  scrollEventListener: any;
  clickEventListener: any;

  isScrolling: any;

  isAutoCompleteDivClicked = false;

  searchValue: any;

  scrollDownIndex = 0;

  theTimeOut: any;

  loaderTimer: Subscription | undefined ;
  scrollTimer: Subscription | undefined ;

  constructor() {}

  ngAfterViewInit() {
    this.scrollEventListener = this.unOrderedList.nativeElement.addEventListener('scroll', (event: any) => {
      if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
        this.loadNextSetData();
      } else if (this.unOrderedList.nativeElement.scrollTop < 10 && this.filteredData.length > this.initialVisibleData) {
        this.removeTopData();
      }
    });

    this.clickEventListener = window.addEventListener('click', (event: any) => {   
      if (!this.autoCompleteContainer.nativeElement.contains(event.target)){
        this.closeAutoComplete();
      }
    });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dropdownData']['previousValue']) {
      /* No need to update scrollIndex here as scroll event listener itself getting executed. */
      if (changes['dropdownData']['currentValue'].length > changes['dropdownData']['previousValue'].length) {
        this.showSpinner(false);
        if (this.loaderTimer) {
          this.loaderTimer.unsubscribe();
          this.loaderTimer = undefined;
        }
        this.unOrderedList.nativeElement.scrollTo(0, Math.ceil((this.unOrderedList.nativeElement.scrollHeight! * 50) / 100));
      }
    }
  }

  showSpinner(bool: boolean) {
    if (this.showLoadingSpinner) { this.showDataLoader = bool; }
    if (bool) {
      this.unOrderedList.nativeElement.scrollTop = this.unOrderedList.nativeElement.scrollHeight;
    }
  }

  nextSet(data: any) {
    this.scrollTimer?.unsubscribe();
    if (this.triggerApiLoadEvent && (!this.searchValue || this.searchValue !== '')
      && this.filteredData[this.filteredData.length - 1] === this.dropdownData[this.dropdownData.length - 1]) {
      let flag = false;
      if (this.objectProperty) {
        if (this.filteredData[this.filteredData.length - 1][this.objectProperty] === this.dropdownData[this.dropdownData.length - 1][this.objectProperty]) {
          flag = true;
        }
      } else if (this.filteredData[this.filteredData.length - 1] === this.dropdownData[this.dropdownData.length - 1]) {
        flag = true;
      }
      if (flag) {
        if (this.totalRecords && this.totalRecords === this.dropdownData.length) {
          return;
        }
        if(this.showDataLoader) { return; }
        this.showSpinner(true);
        this.emitApiLoadEvent.emit({ dataIndex: data.length });
        this.loaderTimer = timer(150).subscribe(() => {
          this.unOrderedList.nativeElement.scrollTop = this.unOrderedList.nativeElement.scrollHeight;
        });
        return;
      }
    }
    if (this.scrollDownIndex >= data.length) {
      return;
    }
    const dt = data.slice(this.scrollDownIndex, this.scrollDownIndex + this.initialVisibleData);
    this.filteredData.push(...dt);
    this.scrollDownIndex = this.scrollDownIndex + dt.length;
    if (!this.isScrollThresholdRequired) { 
      this.unOrderedList.nativeElement.scrollTo(0, Math.ceil((this.unOrderedList.nativeElement.scrollHeight * 50) / 100));
      return;
    }
    const getThresholdData = Math.ceil(this.filteredData.length / this.scrollThreshold);
    if (getThresholdData >= this.initialVisibleData) {
      this.filteredData.splice(0, this.initialVisibleData);
      this.unOrderedList.nativeElement.scrollTo(0, Math.ceil((this.unOrderedList.nativeElement.scrollHeight * 50) / 100));
      return;
    }
  }

  loadNextSetData() {
    try {
      if (!this.isAutoCompleteDivClicked) {
        return;
      }
      const data = this.searchValue && this.searchedData.length > 0 ? this.searchedData : this.dropdownData;
      if (data.length <= this.initialVisibleData) {
        return;
      }
      if (this.scrollTimer) { this.scrollTimer.unsubscribe(); }
      this.scrollTimer = timer(150).subscribe(() => {
        this.nextSet(data);
      });
    } catch (err) {
      console.log(err);
    }
  }

  removeTopData() {
    const data = this.searchValue && this.searchedData.length > 0 ? this.searchedData : this.dropdownData;
    if (data.length <= 0) { return; }
    this.filteredData = data.slice(0, this.initialVisibleData);
    this.scrollDownIndex = 0;
  }

  ngOnInit() {
    try {
      if (this.scrollThreshold <= 0) {
        this.scrollThreshold = 1;
      }
      this.setData();
    } catch (err) {
      console.log(err);
    }
  }

  closeAutoComplete() {
      this.unOrderedList.nativeElement.scrollTo(0, 0);
      this.filteredData = [];
      this.scrollDownIndex = 0;
      this.isAutoCompleteDivClicked = false;
      if (this.triggerBlurEvent) {
        this.emitBlurEvent.emit(true);
      }
  }

  setData() {
    if (this.dropdownData.length <= this.initialVisibleData) {
      this.filteredData = [...this.dropdownData];
    } else {
      this.filteredData = this.dropdownData.slice(0, this.initialVisibleData);
    }
    this.scrollDownIndex = this.scrollDownIndex + this.filteredData.length;
  }

  identify(index: number, item: any) { return item.index; }

  onFocus() {
    try {
      if(this.isAutoCompleteDivClicked) { return; }
      this.isAutoCompleteDivClicked = true;
      if (this.filteredData.length <= 0) { this.setData(); }
      if (this.triggerAutoCompleteOpenEvent) {
        this.emitAutoCompleteOpenEvent.emit({open: true});
      }
    } catch (err) {
      console.log(err);
    }
  }

  selectedItem(data: any) {
    try {
      if (this.objectProperty && data[this.objectProperty]) {
        this.searchValue = data[this.objectProperty];
      } else {
        this.searchValue = data;
      }
      this.closeAutoComplete();
      this.emitSelectedValue.emit(data);
    } catch(err) {
      console.log(err);
    }
  }

  clearSearch() {
    this.searchValue = null;
    if (this.triggerClearSelectionEvent) {
      this.emitClearSelectedEvent.emit({clear: true});
    }
  }

  isInputEvent(event: any) {
    if(event.constructor !== InputEvent) { return false; }
    return true;
  }

  onSearch(event: any) {
    try {
      if(!this.isInputEvent(event)) { return; }
      if (!this.searchValue || this.searchValue === '') {
        this.filteredData = this.dropdownData.slice(0, this.initialVisibleData);
        this.unOrderedList.nativeElement.scrollTo(0, 0);
        this.scrollDownIndex = 0;
        return;
      }
      if (this.objectProperty) {
        if (!this.isNumber) {
          this.searchedData = this.dropdownData.filter(dt => (dt[this.objectProperty!] + '').toLowerCase().includes(this.searchValue.toLowerCase()));
        } else {
          if (typeof Number(this.searchValue) !== 'number') {
            this.filteredData = [];
            return;
          }
          this.searchedData = this.dropdownData.filter(dt => (dt[this.objectProperty!] + '').toLowerCase().includes(this.searchValue));
        }
      } else {
        if (!this.isNumber) {
          this.searchedData = this.dropdownData.filter(dt => (dt + '').toLowerCase().includes(this.searchValue.toLowerCase()));
        } else {
          if (typeof Number(this.searchValue) !== 'number') {
            this.filteredData = [];
            return;
          }
          this.searchedData = this.dropdownData.filter(dt => (dt + '').toLowerCase().includes(this.searchValue));
        }
      }
      if (this.searchedData.length > 0) {
        if(this.searchedData.length > this.initialVisibleData) {
          this.filteredData = this.searchedData.slice(0, this.initialVisibleData);
        } else {
          this.filteredData = [...this.searchedData];
        }
        this.unOrderedList.nativeElement.scrollTo(0, 0);
      } else {
        this.filteredData = [];
      }
    } catch(err) {
      console.log(err);
    }
  }

  async customSearch(event: any) {
    try {
      if (!this.searchFn || this.searchFn.constructor !== Function) { throw new Error("Custom search should be a function."); }
      const filteredData = await this.searchFn(event)
      this.filteredData = [...filteredData];
    } catch (err) {
      console.log(err);
    }
  }

  setDefaults() {
    this.filteredData = [];
    this.dropdownData = [];
    this.searchedData = [];
    this.totalRecords = 0;
    this.isAutoCompleteDivClicked = false;
    this.triggerClearSelectionEvent = false;
    this.showClearOption = false;
    this.showSpinner(false);
    if (this.loaderTimer) { this.loaderTimer.unsubscribe(); }
    if(this.scrollTimer) { this.scrollTimer.unsubscribe(); }
    if (this.theTimeOut) { this.theTimeOut = null; }
    if (this.scrollEventListener) { document.removeEventListener('scroll', this.scrollEventListener, false); }
    if (this.clickEventListener) { document.removeEventListener('click', this.clickEventListener, false); }
    if (this.searchFn) { this.searchFn = undefined; }
  }

  ngOnDestroy() {
    this.setDefaults();
  }
}
