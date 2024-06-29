import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AutocompleteComponent } from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;
  let debugElement: DebugElement;
  let simpleArrayData = ["Apple", "Banana", "Orange", "Kiwi"];
  let objectArrayData = [{fruit: "Apple"},{fruit: "Banana"}, {fruit: "Orange"}, {fruit: "Kiwi"}];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutocompleteComponent ],
      imports: [FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.setDefaults();
  })

  /* Standard testcase. */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* Testcase to check dropdownData and filteredData if they are empty. */
  it("Expect Initial dropdown data to be empty", () => {
    expect(component.dropdownData).toEqual([]);
    expect(component.filteredData).toEqual([]);
  });

  /* Testcase to check rxjs timer events or undefined initially to avoid performance issues. */
  it("Expect rxjs timers to be undefined intially", () => {
    /* To avoid memory consumption or leak */
    expect(component.scrollTimer).toBeUndefined();
    expect(component.loaderTimer).toBeUndefined();
  });

  /* Testcase to check programatically if autocomplete dropdown is closed when not touched. */
  it("Expect autocomplete dropdown to be closed intially if not touched.", () => {
    expect(component.isAutoCompleteDivClicked).toBeFalse();
  });

  /* Testcase to check if autocomplete is not disabled during load. */
  it("Expect autocomplete field not to be disabled during load.", () => {
    component.dropdownData = simpleArrayData;
    component.ngOnInit();
    component.ngAfterViewInit();
    const element = debugElement.query(By.css(".auto-complete-textfield")).nativeElement;
    expect(element.disabled).toBe(false);
  });

  /* Testcase to check if filteredData is not empty. */
  /* Filtered data is the virtual data displayed as dropdown in DOM */
  it("Expect filtered data not to be empty when dropdown data is assigned or updated.", () => {
    component.ngOnInit();
    expect(component.filteredData).not.toBe([]);
  });

  /* Testcase to check if dropdown list is visible. */
  it("Expect dropdown list is visible or opened on focus.", () => {
    component.ngOnInit();
    component.onFocus();
    expect(component.isAutoCompleteDivClicked).toBeTrue();
  });

  /* Testcase to check if dropdown list is not visible after closed. */
  it("Expect dropdown list is not visible when clicked closed.", () => {
    component.ngOnInit();
    component.onFocus();
    component.closeAutoComplete();
    expect(component.isAutoCompleteDivClicked).toBeFalse();
  });

  /* Testcase to check total records is same as dropdown if applicable. */
  it("Expect total records to be same as dropdown records.", () => {
    component.totalRecords = 4;
    component.dropdownData = simpleArrayData;
    expect(component.dropdownData.length).toBe(component.totalRecords);
  });

  /* Testcase to check if searched value is found in dropdown list. */
  it("Expect searched value to be found in dropdown filtered list", () => {
    component.searchValue = "Apple";
    component.dropdownData = objectArrayData;
    component.objectProperty = "fruit";
    const e: any = {};
    component.ngOnInit();
    spyOn(component, 'isInputEvent').and.returnValue(true);
    component.onSearch(e);
    expect(component.searchedData).toEqual([{fruit: "Apple"}]);
  });

  /* Testcase to check if filtered data is empty when value is not found in dropdown list. */
  it("Expect filtered data to be empty when searched value not found in dropdown list.", () => {
    component.searchValue = "potato";
    component.dropdownData = objectArrayData;
    component.objectProperty = "fruit";
    const e: any = {};
    component.onSearch(e);
    expect(component.filteredData).toEqual([]);
  });

  /* Testcase to check if custom search function is being called. */
  it("Expect user's custom search function to have been called during custom search.", fakeAsync((done: any) => {
    component.searchFn = () => {};
    const data = [{fruit: "Banana"}]
    const response = Promise.resolve(data);
    spyOn(component, 'searchFn').and.returnValue(response);
    component.customSearch(data);
    expect(component.searchFn).toHaveBeenCalled();
  }));

  /* Testcase to check if custom search function works and gives back the results. */
  it("Expect user's custom search function to have been called during custom search and giving back results.", fakeAsync(() => {
    component.searchFn = () => {};
    const data = [{fruit: "Banana"}]
    const response = Promise.resolve(data)
    spyOn(component, 'searchFn').and.returnValue(response);
    component.customSearch({});
    response.then(() => {
      expect(component.filteredData.length).toBeGreaterThan(0);
    });
  }));

  /* Testcase to check if ngModel is updated after dropdown is selected. */
  it("Expect selected dropdown value is assigned to ngModel variable.", () => {
    const fruit = "Apple";
    component.selectedItem(fruit);
    spyOn(component, 'closeAutoComplete').and.stub();
    expect(component.searchValue).toEqual(fruit);
  });

  /* Testcase to check if API event is triggered when triggerApiLoadEvent is true. */
  it("Expect autocomplete dropdown to be closed after value selection from dropdown.", () => {
    component.dropdownData= simpleArrayData;
    component.ngOnInit();
    component.searchValue = "Apple";
    component.showClearOption = true;
    component.triggerClearSelectionEvent = true;
    fixture.detectChanges();
    debugElement.query(By.css(".auto-complete-remove-selection")).triggerEventHandler("click", {});
    fixture.detectChanges();
    expect(component.searchValue).toBe(null);
  });

  /* Testcase to check if no result message is displayed when search result is empty. */
  it("Expect to show no result message when filtered data is empty and autocomplete is on focus.", () => {
    const message = "No search results found.";
    component.dropdownData= [];
    component.noSearchResultMessage = message;
    component.ngOnInit();
    component.onFocus();
    const text = debugElement.query(By.css(".noSearchResult")).nativeElement;
    fixture.detectChanges();
    expect(text.textContent).toContain(message);
  });

  /* Testcase to check if event is emitted after dropdown select. */
  it("Expect to call emit event on dropdown select", () => {
    component.dropdownData= simpleArrayData;
    component.ngOnInit();
    component.onFocus();
    spyOn(component, "closeAutoComplete").and.stub();
    spyOn(component.emitSelectedValue, 'emit').and.stub();
    component.selectedItem("Apple");
    expect(component.emitSelectedValue.emit).toHaveBeenCalled();
  });

  /* Testcase to check if autocomplete dropdown is closed after value is selected. */
  it("Expect to close autocomplete after dropdown is selected.", () => {
    component.dropdownData= simpleArrayData;
    component.ngOnInit();
    component.onFocus();
    spyOn(component.emitSelectedValue, 'emit').and.stub();
    component.selectedItem("Apple");
    expect(component.isAutoCompleteDivClicked).toBeFalse();
  });

  /* Testcase to check if API event is triggered when triggerApiLoadEvent is true. */
  it("Expect to call custom function which triggers API event if triggerApiLoadEvent is set to true.", () => {
    component.dropdownData= simpleArrayData;
    component.ngOnInit();
    component.triggerApiLoadEvent = true;
    spyOn(component.emitApiLoadEvent, 'emit').and.stub();
    component.nextSet(component.dropdownData);
    expect(component.emitApiLoadEvent.emit).toHaveBeenCalled();
  });

  /* Test case to check custom css applied or not. */
  it("Expect to assign custom css class if user chooses to use custom css classes", () => {
    const customClassName = 'test-parent-container';
    component.customClass= {
      parentContainerClass: customClassName
    };
    component.dropdownData= simpleArrayData;
    component.ngOnInit();
    component.ngAfterViewInit();
    fixture.detectChanges();
    const element: HTMLElement = debugElement.query(By.css(`.${customClassName}`)).nativeElement;
    expect(element.classList).toContain(customClassName);
  });

  /* Test case to check performance and virtual data. */
  it("Expect filteredData to contain only 1000 records as virtual data when there are 4000 records in actual dropdown.", () => {
    component.initialVisibleData = 1000;
    const data = [];
    for (let i=0; i<4000; i++) {
      data.push(i)
    }
    component.dropdownData= data;
    component.ngOnInit();
    expect(component.filteredData.length).toBe(1000);
  });

});
