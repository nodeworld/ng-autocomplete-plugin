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

  @Input() placeholder = 'Select Value.';

  @Input() isNumber = false;

  @Input() isAutoCompleteDisabled = false; // autocomplete disable option.

  @Input() isCustomSpinner = false;

  @Input() showLoadingSpinner = true; // option to enable spinner for api lazy load.
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

  @ViewChild('listContainer') listContainer!: ElementRef<HTMLElement>;
  
  @ViewChild('fieldContainer') fieldContainer!: ElementRef<HTMLElement>;

  @Input() searchFn: any;

  @Input() disableListFn: Function | undefined;

  @Input() isScrollThresholdRequired = true;

  @Input() ariaRole = 'autocomplete';

  @Input() ariaNoSearchResult = "No reults found.";

  @Input() ariaULList = "Parent List";

  @Input() ariaListContainer = "List container";

  @Input() ariaInputField = "Enter text to search autocomplete.";

  @Input() ariaInputLabel = "Automcomplete search";

  @Input() showInputlabel = false;

  @Input() inputLabel = "Enter or Search value";

  @Input() defaultValue: any | undefined;

  @Input() inspectAutoCompleteList = false;

  @Input() viewMoreText = 'View more';

  @Input() showViewMore = true;

  @Input() optViewMoreOnlyForApiCall = false;

  scrollEventListener: any;

  isScrolling: any;

  isAutoCompleteDivClicked = false;

  searchValue: any;

  scrollDownIndex = 0;
  
  isInputFieldDirty = false;

  isEventEmitted = false;

  isViewMoreApiBeingExecuted = false;

  theTimeOut: any;

  displayViewMoreButton = false;

  loaderTimer: Subscription | undefined ;
  scrollTimer: Subscription | undefined ;

  numberRegex = /^\-?\d+\.?\d*$/;

  constructor() {}

  ngOnInit() {
    if (this.defaultValue) {
      if (this.objectProperty) {
        let getValue;
        if (typeof this.defaultValue === 'object') {
          if (this.isTypeNumber() || (this.isSearchValueANumber(this.defaultValue[this.objectProperty!]))) {
            getValue = this.dropdownData.find(dt => dt[this.objectProperty!]?.toString().toLowerCase().trim() === (this.defaultValue[this.objectProperty!] + '')?.toString().toLowerCase().trim());
          } else {
            getValue = this.dropdownData.find(dt => dt[this.objectProperty!]?.toString().toLowerCase().trim() === this.defaultValue[this.objectProperty!]?.toString().toLowerCase().trim());
          }
        } else {
          if (this.isTypeNumber() || (this.isSearchValueANumber(this.defaultValue))) {
            getValue = this.dropdownData.find(dt => dt?.toString().toLowerCase().trim() === (this.defaultValue + '')?.toString().toLowerCase().trim());
          } else {
            getValue = this.dropdownData.find(dt => dt?.toString().toLowerCase().trim() === this.defaultValue?.toString().toLowerCase().trim());
          }
        }
        if (getValue) {
          this.searchValue = getValue[this.objectProperty];
        }
      } else {
        let getValue;
        if (typeof this.defaultValue === 'object') {
          throw Error('defaultValue being an object, expects objectProperty value.')
        } else {
          getValue = this.dropdownData.find(dt => dt?.toString().toLowerCase().trim() === this.defaultValue?.toString().toLowerCase().trim());
        }
        if (getValue) {
          this.searchValue = getValue;
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isEventEmitted) { return; }
    if (changes['dropdownData']['previousValue'] && changes['dropdownData']['currentValue'].length > changes['dropdownData']['previousValue'].length) {
      this.isEventEmitted = false;
      this.showSpinner(false);
      if (this.isViewMoreApiBeingExecuted) {
        this.isViewMoreApiBeingExecuted = false;
      }
      if (this.searchValue) {
        const dropdownData = this.updateDropdownDataOnSearch(this.searchValue);
        this.searchedData = dropdownData;
        this.findThresholdAndSetFilteredData(dropdownData);
      } else {
        this.findThresholdAndSetFilteredData(this.dropdownData);
      }
    }
  }

  ngAfterViewInit() {
    this.scrollEventListener = this.unOrderedList.nativeElement.addEventListener('scroll', (event: any) => {
      if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
        if ((typeof this.totalRecords !== 'undefined' && this.scrollDownIndex >= this.totalRecords)) {
          this.displayViewMoreButton = false;
          return;
      }
      this.loadNextSetData();
      } else if (this.unOrderedList.nativeElement.scrollTop < 10 && this.filteredData.length > this.initialVisibleData) {
        this.initData();
      }
    });
  }

  handleOnFocusEvent(event: any) {
    if (this.isAutoCompleteDisabled) { return; }
    this.isAutoCompleteDivClicked = true;
    const getListId = this.listContainer.nativeElement.style;
    const getInputId = document.getElementById('searchInput')?.clientWidth;
    if (getListId && getInputId) {
      getListId.width = getInputId + 'px';
    }
    if (this.emitAutoCompleteOpenEvent) {
      this.emitAutoCompleteOpenEvent.emit(event)
    }
    if (this.filteredData.length <= 0) {
      if (this.isInputFieldDirty) {
        this.onSearch(null);
      } else {
        this.setData();
      }
    }
    this.isDisplayViewButton();
  }

  handleOnBlurEvent(event: any) {
    if (this.inspectAutoCompleteList) { return; }
    if ((event?.relatedTarget as HTMLElement)?.classList?.contains('arrow')) {
      return;
    }
    if ((event?.relatedTarget as HTMLElement)?.classList?.contains('unorder-list')) {
      if (!this.searchValue) {
        document.getElementById('searchInput')?.focus();
      }
      return;
    }
    if ((event?.relatedTarget as HTMLElement)?.classList?.contains('view-more')) {
      if (!this.searchValue) {
        document.getElementById('searchInput')?.focus();
      }
      return;
    }
    if ((event?.relatedTarget as HTMLElement)?.classList?.contains('autocomplete-data-list')) {
      return;
    }
    if (this.inspectAutoCompleteList) {
      console.warn(`You have turned off blur event in autocomplete module which will not close autocomplete list. Hope you know what you are doing. Update to false after inspect is complete.`)
      return;
    }
    this.closeAutoComplete();
    this.isAutoCompleteDivClicked = false;
    this.filteredData = [];

  }

  initData() {
    const data = this.isInputFieldDirty && this.searchedData.length > 0 && this.searchValue ? this.searchedData.slice(0, this.initialVisibleData) : this.dropdownData.slice(0, this.initialVisibleData);
    this.filteredData = data;
    this.scrollDownIndex = data.length;
    return;
  }

  loadNextSetData() {
    try {
      if (!this.isAutoCompleteDivClicked) { return; }
      if (this.dropdownData.length <= this.initialVisibleData && !this.triggerApiLoadEvent) {
        return;
      }
      if (this.scrollTimer) { this.scrollTimer.unsubscribe(); }
      this.scrollTimer = timer(150).subscribe(() => {
        this.nextSet();
      });
    } catch (err) {
      console.log(err);
    }
  }

  nextSet() {
    const ulHeight = this.unOrderedList.nativeElement.scrollHeight;
    const containerHeight = this.listContainer.nativeElement.scrollHeight;
    const calculateScrollDiff = Math.ceil((containerHeight * 100) / ulHeight);
    if (calculateScrollDiff > 70) {
        return;
    }
    let dropdownData;
    dropdownData = this.searchedData.length > 0 ? [...this.searchedData] : [...this.dropdownData];
    if (this.dropdownData.length === this.scrollDownIndex || this.searchedData.length === this.scrollDownIndex) {
      if (!this.isEventEmitted && this.triggerApiLoadEvent) {
        if (this.optViewMoreOnlyForApiCall) {
          this.displayViewMoreButton = true;
          this.scrollTimer = timer(150).subscribe(() => {
            this.unOrderedList.nativeElement?.scrollTo(0, this.unOrderedList.nativeElement.scrollHeight + 10);
          });
          return;
        }
        this.emitApiLoadEvent.emit({ dataIndex: this.dropdownData.length });
        this.isEventEmitted = true;
        if (this.showLoadingSpinner) {
          this.showSpinner(true);
        this.scrollTimer = timer(150).subscribe(() => {
          this.unOrderedList.nativeElement?.scrollTo(0, this.unOrderedList.nativeElement.scrollHeight + 10);
        });
        }
      }
      return;
    }
    this.findThresholdAndSetFilteredData(dropdownData);
  }

  setFilteredDataIfSearchValueExists(dropdownData: any[]) {
    let getNextDataSet: any;
    getNextDataSet = dropdownData.slice(this.scrollDownIndex, this.scrollDownIndex + this.initialVisibleData);
    if (getNextDataSet.length > 0) {
      this.scrollDownIndex = this.scrollDownIndex + getNextDataSet.length;
      if (this.isInputFieldDirty && (this.searchValue && this.searchValue !== '')) {
        if (this.objectProperty) {
          getNextDataSet = getNextDataSet.filter((dt: any) => dt[this.objectProperty!]?.toString().toLowerCase().includes(this.searchValue?.toString()?.toLowerCase().trim()));
        } else {
          getNextDataSet = getNextDataSet.filter((dt: any) => dt?.toString().toLowerCase().includes(this.searchValue?.toString()?.toLowerCase().trim()));
        }
      }
      this.filteredData.push(...getNextDataSet);
    }
  }

  findThresholdAndSetFilteredData(dropdownData: any[]) {
    if (dropdownData.length > this.filteredData.length) {
      const getThresholdData = Math.ceil(this.filteredData.length / this.scrollThreshold);
      if (this.isScrollThresholdRequired && getThresholdData >= this.initialVisibleData) {
        this.filteredData.splice(0, this.initialVisibleData);
        this.setFilteredDataIfSearchValueExists(dropdownData); 
      } else {
        this.setFilteredDataIfSearchValueExists(dropdownData); 
      }
      this.unOrderedList.nativeElement?.scrollTo(0, Math.ceil((this.unOrderedList.nativeElement.scrollHeight * 50) / 100));
      // this.scrollTimer = timer(150).subscribe(() => {
      //   this.unOrderedList.nativeElement?.scrollTo(0, Math.ceil((this.unOrderedList.nativeElement.scrollHeight * 50) / 100));
      // });
    }
  }

  updateDropdownDataOnSearch(searchedValue: any) {
    let dropdownData;
    if (this.objectProperty) {
      if (this.isTypeNumber()) {
        dropdownData = this.dropdownData.filter(dt => (dt[this.objectProperty!] + '')?.includes(searchedValue));
      } else {
        dropdownData = this.dropdownData.filter(dt => dt[this.objectProperty!]?.toString().toLowerCase().includes(searchedValue.toLowerCase().trim()));
      }
    } else {
      if (this.isTypeNumber()) {
        dropdownData = this.dropdownData.filter(dt => (dt + '')?.includes(searchedValue + ''));
      } else {
        dropdownData = this.dropdownData.filter(dt => dt?.toString().toLowerCase().includes(searchedValue?.toLowerCase().trim()));
      }
    }
    return dropdownData;
  }

  setData() {
    const data = [...this.dropdownData];
    if (data.length <= this.initialVisibleData) {
        this.filteredData = data;
        this.scrollDownIndex = data.length;
        return;
    }
    let getFirstSetData = data.slice(0, this.initialVisibleData);
    this.scrollDownIndex = getFirstSetData.length;
    if (this.isInputFieldDirty && this.isTypeNumber()) {
      if (!this.isSearchValueANumber(this.searchValue)) {
        this.filteredData = [];
        return;
      }
      if (this.objectProperty) {
        getFirstSetData = getFirstSetData.filter(dt => dt[this.objectProperty!]?.includes(this.searchValue));
      } else {
        getFirstSetData = getFirstSetData.filter(dt => dt?.includes(this.searchValue));
      }
    } else if (this.isInputFieldDirty && (this.searchValue && this.searchValue !== '')) {
      if (this.objectProperty) {
        getFirstSetData = getFirstSetData.filter(dt => dt[this.objectProperty!]?.toString().toLowerCase().includes(this.searchValue?.toString()?.toLowerCase().trim()));
      } else {
        getFirstSetData = getFirstSetData.filter(dt => dt?.toString().toLowerCase().includes(this.searchValue?.toString()?.toLowerCase().trim()));
      }
    }
    this.filteredData = getFirstSetData;
    return;
  }

  async onSearch(_event: any) {
    let searchedValue: any;
    if (this.isTypeNumber() && this.isSearchValueANumber(this.searchValue)) {
      searchedValue = Number(this.searchValue);
    } else {
      searchedValue = this.searchValue;
    }
    if ((!this.searchValue || this.searchValue?.trim() === '')) {
      this.searchedData = [];
      this.initData();
      this.unOrderedList.nativeElement?.scrollTo(0, 0);
      return;
    }
    if (!this.isInputFieldDirty) {
      this.isInputFieldDirty = true;
    }
    this.scrollDownIndex = 0; //reset
    if (this.searchFn && typeof this.searchFn === 'function') {
        const result = await this.searchFn(this.searchValue, this.dropdownData);
        if (result && result.length > 0) {
            this.searchedData = result;
            const getFirstSetData = result.slice(0, this.initialVisibleData);
            this.scrollDownIndex = this.scrollDownIndex + getFirstSetData.length;
            this.filteredData = getFirstSetData;
            this.isDisplayViewButton();
            return;
        }
    }
    const getSearchData = this.updateDropdownDataOnSearch(searchedValue);
    if (getSearchData.length > 0) {
      const getFirstSetData = getSearchData.slice(0, this.initialVisibleData);
      this.scrollDownIndex = this.scrollDownIndex + getFirstSetData.length;
      this.searchedData = getSearchData;
      this.filteredData = getFirstSetData;
      this.isDisplayViewButton();
      return;
    }
    this.filteredData = [];
    return;
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

  selectedItem(data: any) {
    try {
      if (this.objectProperty && data[this.objectProperty]) {
        this.searchValue = data[this.objectProperty] + '';
      } else {
        this.searchValue = data + '';
      }
      this.closeAutoComplete();
      this.isInputFieldDirty = false;
      this.emitSelectedValue.emit(data);
    } catch(err) {
      console.log(err);
    }
  }

  showSpinner(bool: boolean) {
    if (this.showLoadingSpinner) { this.showDataLoader = bool; }
    if (bool) {
      this.unOrderedList.nativeElement.scrollTop = this.unOrderedList.nativeElement.scrollHeight;
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
    this.displayViewMoreButton = false;
  }

  setDefaults() {
    this.filteredData = [];
    this.dropdownData = [];
    this.searchedData = [];
    this.totalRecords = undefined;
    this.isAutoCompleteDivClicked = false;
    this.triggerClearSelectionEvent = false;
    this.showClearOption = false;
    this.isInputFieldDirty = false;
    this.showSpinner(false);
    if (this.loaderTimer) { this.loaderTimer.unsubscribe(); }
    if(this.scrollTimer) { this.scrollTimer.unsubscribe(); }
    if (this.theTimeOut) { this.theTimeOut = null; }
    if (this.scrollEventListener) { document.removeEventListener('scroll', this.scrollEventListener, false); }
    if (this.searchFn) { this.searchFn = undefined; }
  }

  onViewMore(_event: any) {
    if (this.triggerApiLoadEvent && !this.isEventEmitted) {
      this.emitApiLoadEvent.emit({ dataIndex: this.dropdownData.length });
      this.isEventEmitted = true;
      this.isViewMoreApiBeingExecuted = true;
      if (this.showLoadingSpinner) {
        this.showSpinner(true);
      }
    }
  }

  /* This wont work for searchValue filter. check and fix*/
  isDisplayViewButton() {
    if (typeof this.totalRecords !== 'undefined' && this.dropdownData.length >= this.totalRecords) {
      this.displayViewMoreButton = false;
      return;
    }
    if (this.searchValue && this.searchValue !== '' && this.triggerApiLoadEvent && !this.isEventEmitted) {
      this.displayViewMoreButton = true;
      return;
    }
    if (this.scrollDownIndex >= this.dropdownData.length) {
      this.displayViewMoreButton = true;
      return;
    }
    this.displayViewMoreButton = false;
    return;
  }

  toggleDropdown(event: any) {
    if (this.isAutoCompleteDivClicked) {
      this.handleOnBlurEvent(event);
      return;
    }
    this.handleOnFocusEvent(event);
    return;
  }

  isTypeNumber() {
    return this.isNumber ? true : false;
  }

  isSearchValueANumber(value: any) {
    return this.numberRegex.test(value);
  }

  identify(index: number, item: any) { return item.index; }

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

  ngOnDestroy() {
    this.setDefaults();
  }
}
