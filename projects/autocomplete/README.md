
# Angular Autocomplete 

A simple, powerful, lightweight and customizable autocomplete tool programmed for Angular projects!
    

## Whats better in this package?

- Lightweight
- No 3rd party packages installed
- No angular material or cdk library
- Supports large data set
- Customizable scroll functionality
- Supports custom events
- Easy virtual scrolling for large data set without 3rd party
- Custom classes and ng-styles are allowed
- Ability to use 3rd party style packages like bootstrap, tailwind. (You can update the classes from your component)
- 20 solid test cases to validate the module.


## Installation

Install ng-autosuggest with npm

```bash
  npm install ng-autosuggest --save
```




## API Usage

#### Input decorators

| Input | Type  | Required | Description |
| -------- | ------- | ------- | ------- |
| `dropdownData` | `string[] or object[]`  | **Yes**. | Accepts array of strings or numbers or array of objects |  |
| `objectProperty` | `string` |**_Yes_** | Required only if `dropdownData` is object[]. Helps to display dropdown value in dropdown list. |
| `placeholder` | `string` | `No` | Custom placeholder for auto-complete |
| `scrollData` | `number`| `No` | 1000 by default. Displays 1000 records by default. Can be changed as per project convenience. |
| `scrollThreshold` | `number` | `No` | 3 by default. Helps to boost performance. It controls the scroll data and removes top or botton records during user scroll based on the scrollThreshold & scrollData configured. Check below for more details. |
|`totalRecords` | `number` | `No` | If total number of records is known, totalRecords can be provided which will avoid extra condtions that will be executed in the package.
|`disableProperty` | `string` | `No` | To disable specific dropdown list in dropdown. User cannot select the dropdown if disabled. This property can be used for object[] dropdown and `disableProperty` should be one of the boolean property in object|
|`disableListFn` |`Function` |`No` | If disable should be calculated dynamically using a function and custom code, assign customized function to `disableListFn`. disableListFn accepts two parameters (index, data)|
|`searchFn` |`Function` |`No` | Customized search function. Customized search function accepts one parameter, `event`. On keyUp, the customized search function will be called to perform custom execution.|
|`isNumber` |`boolean` |`No` | If the displayed list is number, then sending `isNumber` as true will help to search the list efficiently |
|`noSearchResultMessage` |`string` |`No` | By default **No results found** message will be displayed when search result is 0  |
|`customTrackBy` | `Function` |`No` | Customize ngFor trackBy Function|
|`isAutoCompleteDisabled` |`boolean` |`No` | By default value is false. If updated as true, the input fields gets disabled. |
|`customClass` | `object` |`No` | Allows custom styling at various levels. Check below for more information |
|`showdropDownArrow` | `boolean` |`No` | Show or hide dropdown icon in autocomplete field. Default is `true`.  |
|`showClearOption` |`boolean` |`No` | Shows clear option to allow user to clear the selected value. Default is `true`. |
|`showLoadingSpinner` | `boolean`|`No` | Shows the spinner at the botton of the list if lazy loaded. Default is `false` |
| `triggerBlurEvent`|`boolean` |`No` | Default is false. When set to true, it emits an output event `emitBlurEvent`  |
|`triggerApiLoadEvent` |`boolean` |`No` | Default is `false`. If dropdown list is loaded through API via lazy loading, this can be set as true. Default is false. When set to true, it emits an output event `emitApiLoadEvent`. When the output event is emitted, user can take care of loading the dropdown data further.|
|`triggerAutoCompleteOpenEvent` |`boolean` |`No` | Default is false. When set to true, it emits an output event `emitAutoCompleteOpenEvent` when auto-complete dropdown list opens. |
|`triggerSearchEvent` |`boolean` |`No` | Default is false. When set to true, emits an output event `emitSearchEvent` whenever user types and search. |
|`triggerClearSelectionEvent` |`boolean` |`No` | Default is false. When set to true, emits an output event `emitClearSelectedEvent` whenever selected field is cleared.  |
|`isScrollThresholdRequired`|`boolean`|`No` | Default is true. If scrollData and scrollThreshold is performance calculation is not required, set it to false. See below for more information.|

#### Output decorators
| Output    | Required  | Description |
| --------  | ------- | ------- |
|`emitSelectedValue` |`Yes` |Emits the selected dropdown value.  |
|`emitApiLoadEvent` |`No` | To load next set of dropdownData using API or any other external means. Emits event when end of scroll is reached.`triggerApiLoadEvent` needs to be set to true to emit this event. |
|`emitAutoCompleteOpenEvent` |`No` | Emits event when dropdown is opened or displayed. `triggerAutoCompleteOpenEvent` needs to be set to true to emit this event.|
|`emitClearSelectedEvent` |`No` | Emits event when selected value is cleared. `triggerClearSelectionEvent` needs to be set to true to emit this event.|

# Using the module

import AngularAutocomplete Module into your app.

In your HTML template

For dropdown string array,Eg: ["Apple", "Banana", "Kiwi"], do as below.

```html
<angular-autocomplete
    [dropdownData]="YOUR_DROPDOWN_DATA"
    (emitSelectedValue)="YOUR_CUSTOM_FUNTION($event)">
</angular-autocomplete>
```

For dropdown object array, Eg: [{"name": "Alex"}, {"name": "John"}], do as below.

```html
<angular-autocomplete
    [dropdownData]="YOUR_DROPDOWN_DATA"
    (emitSelectedValue)="YOUR_CUSTOM_FUNTION($event)"
    [objectProperty]="'name'">
</angular-autocomplete>
```
## Setting `scrollThreshold` & `initialVisibleData` for maximizng performance

By default, `initialVisibleData` is set to 1000 and `scrollThreshold` is set to 3. It can be customized as per requirement.

#### What is `scrollThreshold` & `initialVisibleData`?

Both `scrollThreshold` & `initialVisibleData` helps to improve virtual scrolling for better performance.

`initialVisibleData` is the number of records / data that will be loaded virtually during initial load.

Consider, there are 5000 records to be shown. `initialVisibleData` is 1000 and `scrollThreshold` is 3.

During initial load, dropdown list will show 1000 records. When user reaches the end of scroll, the formula will be calculated based on `initialVisibleData` & `scrollThreshold` and number of filteredData records.

```js
Math.ceil(filteredData.length /scrollThreshold);

Math.ceil(1000/3);
```
If calculated result does not exceed `initialVisibleData`, next set of data will be loaded. And now the dropdown list(filteredData) will hold 2000 records.

Similary same calculation will be performed during the end of scroll and when the result exceeds `initialVisibleData`, first set of records will be removed from the dropdown list and next set of records will be loaded everytime, to improve performance.

When `scrollThreshold` is set to 1, the virtual dropdown list will hold the records based on `initialVisibleData` configuration. When end of scroll is reached, the current set will be replaced by next set.

`initialVisibleData` & `scrollThreshold` does not affect or mutate original data and will update only the virtually filtered data.

`initialVisibleData` & `scrollThreshold` is customizable based on project needs. If this performance calculation is not required, set `isScrollThresholdRequired` to `false`.


## Adding Custom CSS Class to autocomplete

#### Import CustomClassType from the module (Optional).


| CustomClassTypes              | Required    | Description |
| :--------                     | :-----------| :-----------|
| `parentContainerClass`        | `No` | Adds class to `div` surrounding the input field and dropdown list. |
| `inputFieldClass`             | `No` | Adds class to `input textfield`|
| `listContainerClass`          | `No` | Adds class to `div` that surrounds `ul` of dropdown list. |
| `dropdownUnorderedListClass`  | `No` | Adds class to `ul` of dropdown list. |
| `dropdownListClass`           | `No` | Adds class to each `li` items|
| `noResultClass`               | `No` | Adds class to separate `li` item to show no result message. |
| `disableListClass`            | `No` | Adds class to each `li` items. Depends on `disableListFn` function or `disableProperty`  |
| `inputLabelClass`             | `No` | Adds class to `<label>` field |

```ts
customClassType: CustomClassType = {
    inputFieldClass: 'class1',
    dropdownListClass: 'class1 class2'
}
```

```html
<angular-autocomplete
    [dropdownData]="YOUR_DROPDOWN_DATA"
    (emitSelectedValue)="YOUR_CUSTOM_FUNTION($event)"
    [objectProperty]="'name'"
    [customClassType]="customClassType">
</angular-autocomplete>
```

## Adding Custom NgStyle to autocomplete

#### Import CustomNgStyleType from the module (Optional).


| CustomNgStyleTypes | Required | Description |
| :-------- | :-----------| :-----------|
| `parentContainerStyle`      | `No` | Adds style to `div` surrounding the input field and dropdown list. |
| `inputFieldStyle`      | `No` | Adds style to `input textfield`|
| `listContainerStyle`      | `No` | Adds style to `div` that surrounds `ul` of dropdown list. |
| `dropdownUnorderedListStyle`      | `No` | Adds style to `ul` of dropdown list. |
| `dropdownListStyle`      | `No` | Adds style to each `li` items|
| `noResultStyle`      | `No` | Adds style to separate `li` item to show no result message. |
| `inputLabelStyle`      | `No` | Adds style to `<label>` field |

```ts
customClassType: CustomNgStyleType = {
    inputFieldStyle: {color: '#FFFFFF' },
    dropdownListStyle: {padding: 2px }
}
```

```html
<angular-autocomplete
    [dropdownData]="YOUR_DROPDOWN_DATA"
    (emitSelectedValue)="YOUR_CUSTOM_FUNTION($event)"
    [objectProperty]="'name'"
    [customClassType]="customClassType">
</angular-autocomplete>

```
## Adding Accessible Rich Internet Applications (ARIA)

#### ARIA provides easy access to the content for people with disabilities with help of screen reader.

| Attributes | Required | Description |
| :-------- | :-----------| :-----------|
| `ariaRole`            | `No` | Adds ARIA role  to `input textfield` |
| `ariaInputField`      | `No` | Adds ARIA label  to `input textfield`|
| `ariaNoSearchResult`  | `No` | Adds ARIA label to no result found `li` item|
| `ariaULList`          | `No` | Adds ARIA label to `ul` list item |
| `ariaListContainer`   | `No` | Adds ARIA label to list container `div`. |
| `ariaInputLabel`   | `No` | Adds ARIA label to `label field`. |