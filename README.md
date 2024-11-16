
# Angular Autocomplete 

A simple, powerful, lightweight and customizable autocomplete tool programmed for Angular projects.

## Recommended Angular version 

Angular 14+


## Whats better in this package?

- Lightweight module
- No 3rd party packages installed
- Ability to use 3rd party style packages like bootstrap, tailwind or any css libraries. (You can update the classes from your component)
- No angular material or cdk library
- Supports large data set
- Customizable scroll functionality
- Supports custom events
- Easy virtual scrolling for large data set without 3rd party
- Custom classes and ng-styles are allowed
- Keyboard navigation events to scroll through dropdown list
- 22+ solid test cases to validate the module
- Eventful module.

## What's new in ^2.0.0?

- Search algorithm has been redefined without impacting prior versions.
- Added `View More` to List dropdown at the end of the list as an alternative to call API when reaching the end of scroll.
- Now the developers who consume this package can decide how they should trigger an API Call. Using `View More`, or triggering API Call when reaching end of scroll. Both can be configured as well. Refer below for more information.
- Renamed the internal class `loader`  to `autocomplete-plugin-loader` as `loader` class is too common name and may collide with other libraries.
- Updated scroll event and resize event by using `Renderer2` to efficiently manage the event listeners.
- Added ARIA label by introducing an input property `ariaViewMore`.
- Added keyboard navigation events to scroll through dropdown list and select the list when pressing Enter Key

## How to make best use of this package ?

Read the full documentation without skipping, to know the flexibility of this module and refer the examples provided. Apart from the general use, this package comes handy when

- Lazy loading is required. A custom function can be executed from the application which may be an API call with offset or paginated params or any other custom function that is suitable for the requirement.
- Effortless styling of the input field and dropdown using custom css, or with libraries like bootstrap, tailwind and so on.
- Handling large dataset with or without lazy load configuration
- When `triggerApiLoadEvent` is set to `true`, its developers responsibility to set it as `false` once the custom function is executed and expected result is achieved. 
- If `totalRecords` is known during the initialization of the module, the module will act pro-actively based on this input and will not call any custom functions once the `totalRecords` match the actual dropdownData and when scroll is complete.

## Installation

Install ng-autocomplete-plugin with npm

```bash
  npm install ng-autocomplete-plugin --save

  or

  npm i ng-autocomplete-plugin
```

## Running Tests

ng-autocomplete-plugin has 20+ solid test cases to make sure components executes without any issues.

To run tests, run the following command

```bash
  npm run test
  or
  ng test
```
## Package version

| ng-autocomplete-plugin version | Description | 
| :-------- | :-----------|
| `2.1.1`  | Recommended. Added keyboard navigation events to scroll through dropdown list. Refer changelog for more information. |
| 2.0.1    | No code changes were done. Only README file updated. |
| 2.0.0    | Major Upgrade in search algorithm with certain bugs fixed. Added View More Button as a new feature. |
| 1.0.3    | Updated readme file with few changes. |
| 1.0.2    | Only Read me file updated. |
| 1.0.1    | First major version |

## Demo & Examples

| Demo Description | Stackblitz Example | 
| :-------- | :-----------|
| Autocomplete Example   | [Autocomplete - Stackblitz](https://stackblitz.com/edit/stackblitz-starters-fheu3d) |
| API Call Event Example      | [Autocomplete with API call event -  Stackblitz](https://stackblitz.com/edit/angular-ivy-bee32e) |
| Autocomplete With Bootstrap    | [Autocomplete with bootstrap](https://stackblitz.com/edit/angular-ivy-44evld)|
| Autocomplete With Tailwind    | [Autocomplete with tailwind](https://stackblitz.com/edit/starters-tailwind-by-ven-vcksuf)|
| Turn off performance calculation during scroll  | [Turn off performance calculation during scroll](https://stackblitz.com/edit/angular-ivy-mqghge)|
| Disabling a list in dropdown| [Disabling a list in dropdown](https://stackblitz.com/edit/angular-ivy-cnzhan)|
| View More button for API lazy load| [View More button for API lazy load](https://stackblitz.com/edit/ng-autocomplete-view-more)|

## API Usage

#### Input decorators

| Input | Type  | Required | Description |
| -------- | ------- | ------- | ------- |
| `dropdownData` | `string[] or object[]`  | **Yes**. | Accepts array of strings or numbers or array of objects |  |
| `objectProperty` | `string` |**_Yes_** | Required only if `dropdownData` is object[]. Helps to display dropdown value in dropdown list. |
| `placeholder` | `string` | `No` | Custom placeholder for autocomplete input field. |
| `defaultValue` | `string` or `object` | `No` | To pre-select a value from dropdown. |
| `initialVisibleData` | `number`| `No` | Displays 1000 records in dropdown by default. Can be changed as per project requirement. |
| `scrollThreshold` | `number` | `No` | 3 by default. Helps to boost performance. It controls the scroll data and removes top or botton records during user scroll based on the scrollThreshold & initialVisibleData configured. Check below for more details. |
|`totalRecords` | `number` | `No` | If total number of records is known, totalRecords can be provided which will avoid extra events getting executed.
|`disableProperty` | `string` | `No` | To disable specific dropdown list item in dropdown. User cannot select the dropdown if disabled. This property can be used for object[] dropdown and `disableProperty` should be one of the boolean property in object|
|`disableListFn` |`Function` |`No` | If disabling a list item should be calculated dynamically using a function and custom code, assign customized function to `disableListFn`. disableListFn accepts two parameters (index, data)|
|`searchFn` |`Function` |`No` | Customized search function. Customized search function accepts one parameter, `event`. On keyUp, the customized search function will be called to perform custom execution.|
|`isNumber` |`boolean` |`No` | If the displayed list is number, then sending `isNumber` as true will help to search the list efficiently |
|`noSearchResultMessage` |`string` |`No` | By default **No results found** message will be displayed when search result is 0. It can be changed with this input property.  |
|`customTrackBy` | `Function` |`No` | Custom ngFor trackBy Function|
|`isAutoCompleteDisabled` |`boolean` |`No` | Default is `false`. When set to `true`, the input field gets disabled. |
|`isCustomSpinner` |`boolean` |`No` | Default is `false`. When set to `true`, custom spinner can be implemented with custom class. |
|`customClass` | `object` |`No` | Allows custom class styling at various dom levels. Check below for more information |
|`customStyle` | `object` |`No` | Allows custom ng-style. Check below for more information |
|`showdropDownArrow` | `boolean` |`No` | Default is `true`. Show or hide dropdown icon in autocomplete field.  |
|`showClearOption` |`boolean` |`No` | Default is `true`. Shows clear option to allow the user to reset or clear the selected value. |
|`showLoadingSpinner` | `boolean`|`No` | Default is `true`. Shows the spinner at the botton of the list during lazy loading API call. If set to `false`, spinner will not be shown. |
| `triggerBlurEvent`|`boolean` |`No` | Default is `false`. When set to `true`, it emits an output event `emitBlurEvent` during focusOut  |
|`triggerApiLoadEvent` |`boolean` |`No` | Default is `false`. If dropdown list is loaded through API via lazy loading, this can be set as true, it emits an event `emitApiLoadEvent`. When the output event is emitted, user can take care of loading the dropdown data further.|
|`triggerAutoCompleteOpenEvent` |`boolean` |`No` | Default is `false`. When set to `true`, it emits an output event `emitAutoCompleteOpenEvent` when auto-complete dropdown list opens. |
|`triggerSearchEvent` |`boolean` |`No` | Default is `false`. When set to `true`, emits an output event `emitSearchEvent` whenever user types and search. |
|`triggerClearSelectionEvent` |`boolean` |`No` | Default is `false`. When set to `true`, emits an output event `emitClearSelectedEvent` whenever selected field is cleared.  |
|`isScrollThresholdRequired`|`boolean`|`No` | Default is `true`. If initialVisibleData and scrollThreshold is performance calculation is not required, set it to `false`. See below for more information.|
|`inspectAutoCompleteList`|`boolean`|`No` | Default is `false`. When set to `true`, autocomplete dropdown will not be closed or hidden during onBlur or onFocusOut events. This is intended only for debugging and development purposes. For production it should be always `false` to avoid interruption. |
|`showViewMore`|`boolean`|`No` | Default is `true`. `View More` List will be shown at the end of dropdown if user has enabled lazy loading (`triggerApiLoadEvent`). `View More` will appear only when API call is to be executed. |
|`optViewMoreOnlyForApiCall`|`boolean`|`No` | Default is `false`. When set to `true`, API Call will not be executed on reaching the end of the scroll, instead `View More` button has to be clicked to call the API or any custom function. |
|`viewMoreText`|`string`|`No` | Default text is `View More`. It can be customized with this input property.|

#### Output decorators
| Output    | Required  | Description |
| --------  | ------- | ------- |
|`emitSelectedValue` |`Yes` |Emits the selected dropdown value.  |
|`emitApiLoadEvent` |`No` | To load next set of dropdownData using API or any other external means. Emits event when end of scroll is reached.`triggerApiLoadEvent` needs to be set to true to emit this event. |
|`emitAutoCompleteOpenEvent` |`No` | Emits event when dropdown is opened or displayed. `triggerAutoCompleteOpenEvent` needs to be set to true to emit this event.|
|`emitClearSelectedEvent` |`No` | Emits event when selected value is cleared. `triggerClearSelectionEvent` needs to be set to true to emit this event.|
|`emitBlurEvent` |`No` | Emits event during focus out. `triggerBlurEvent` needs to be set to true to emit this event.|

# Using the module

import `NgAutocompletePluginModule` into your app module.

```ts
import { NgAutocompletePluginModule } from 'ng-autocomplete-plugin';
```

In your HTML template

For dropdown string array,Eg: ["Apple", "Banana", "Kiwi"], do as below.

```html
<ng-autocomplete
    [dropdownData]="YOUR_DROPDOWN_DATA"
    (emitSelectedValue)="YOUR_CUSTOM_FUNTION($event)">
</ng-autocomplete>
```

For dropdown object array, Eg: [{"name": "Alex"}, {"name": "John"}], do as below.

```html
<ng-autocomplete
    [dropdownData]="YOUR_DROPDOWN_DATA"
    (emitSelectedValue)="YOUR_CUSTOM_FUNTION($event)"
    [objectProperty]="'name'">
</ng-autocomplete>
```

To control the width of autocomplete, wrap a div and specify the width. Custom CSS classes can also be used(Scroll below).
```html
<div style="width: 200px">
    <ng-autocomplete
        [dropdownData]="YOUR_DROPDOWN_DATA"
        (emitSelectedValue)="YOUR_CUSTOM_FUNTION($event)"
        [objectProperty]="'name'">
    </ng-autocomplete>
</div>
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

## CSS Classes used in npm-autocomplete-plugin html template

#### This is for informational purpose only. Be cautious if you are overriding these CSS as it may affect dropdown style if updated incorrectly.

###### It is always recommended to add class through customClass or customStyle Input() properties.

| Classes | Description | Comments |
| :-------- | :-----------| :-----------| 
| `auto-complete-textfield-container`    | Class of parent html div template | Able to override through `parentContainerClass` or `parentContainerStyle`  |
| `label-container`      |  Class of label tag |Able to override through `inputLabelContainerClass` or `inputLabelContainerStyle` |
| `label-value`      |  Class of `<label>` tag |Able to override through `inputLabelClass` or `inputLabelStyle` |
| `field-container`      |  Class of `div` that surrounds `input` field and autocomplete `li` | Able to override through `inputFieldContainerClass` or `inputFieldContainerStyle` |
| `auto-complete-textfield`      | Class of `input` text field| Able to override through `inputFieldClass` or `inputFieldStyle`
| `auto-complete-list`      |  Class of `div` that surrounds `li`|Able to override through `listContainerClass` or `listContainerStyle` |
| `unorder-list`      |  Class of `ul`  |Able to override through `dropdownUnorderedListClass` or `dropdownUnorderedListStyle` |
| `autocomplete-data-list`      |  Class of `li`  |Able to override through `disableListClass` or `dropdownListStyle` |
| `autocomplete-data-list noSearchResult`      |  Class of `li` if search result not found.  |Able to override through `noResultClass` or `noResultStyle` |

## Adding Custom CSS Class to autocomplete

#### Import CustomClassType from the module (Optional).


| CustomClassTypes              | Required    | Description |
| :--------                     | :-----------| :-----------|
| `parentContainerClass`        | `No` | Adds class to `div` surrounding the input field and dropdown list. |
| `inputFieldContainerClass`    | `No` | Adds class to the parent div of `input` field |
| `inputFieldClass`             | `No` | Adds class to `input textfield`|
| `listContainerClass`          | `No` | Adds class to `div` that surrounds `ul` of dropdown list. |
| `dropdownUnorderedListClass`  | `No` | Adds class to `ul` of dropdown list. |
| `dropdownListClass`           | `No` | Adds class to each `li` items|
| `noResultClass`               | `No` | Adds class to separate `li` item to show no result message. |
| `disableListClass`            | `No` | Adds class to each `li` items. Depends on `disableListFn` function or `disableProperty`  |
| `inputLabelClass`             | `No` | Adds class to `<label>` field |
| `inputLabelContainerClass`    | `No` | Adds class to parent div of `<label>` field |
| `viewMoreClass`               | `No` | Adds class to View More `li` item |


import `CustomClassType` Type into your app, to see the custom class types available. Its optional, but would be good to use. Write your custom class in global css file or use ::ng-deep from specific components.

```ts
import { CustomClassType } from 'ng-autocomplete-plugin';
```

In your template, do the following:

```ts
customClassType: CustomClassType = {
    inputFieldClass: 'class1',
    dropdownListClass: 'class1 class2'
}
```

```html
<ng-autocomplete
    [dropdownData]="YOUR_DROPDOWN_DATA"
    (emitSelectedValue)="YOUR_CUSTOM_FUNTION($event)"
    [objectProperty]="'name'"
    [customClassType]="customClassType">
</ng-autocomplete>
```

## Adding Custom NgStyle to autocomplete

#### Import CustomNgStyleType from the module (Optional).


| CustomNgStyleTypes | Required | Description |
| :-------- | :-----------| :-----------|
| `parentContainerStyle`      | `No` | Adds style to `div` surrounding the input field and dropdown list. |
| `inputFieldContainerStyle`  | `No` | Adds style to the parent div of `input` field |
| `inputFieldStyle`      | `No` | Adds style to `input textfield`|
| `listContainerStyle`      | `No` | Adds style to `div` that surrounds `ul` of dropdown list. |
| `dropdownUnorderedListStyle`      | `No` | Adds style to `ul` of dropdown list. |
| `dropdownListStyle`      | `No` | Adds style to each `li` items|
| `noResultStyle`      | `No` | Adds style to separate `li` item to show no result message. |
| `inputLabelStyle`      | `No` | Adds style to `<label>` field |
| `inputLabelContainerStyle`    | `No` | Adds style to parent div of `<label>` field |
| `viewMoreStyle`      | `No` | Adds style to View More `li` item. |

import `CustomNgStyleType` Type into your app, to see the custom class types available. Its optional, but would be good to use.

```ts
import { CustomNgStyleType } from 'ng-autocomplete-plugin';
```

In your template, do the following:

```ts
customClassType: CustomNgStyleType = {
    inputFieldStyle: {color: '#FFFFFF' },
    dropdownListStyle: {padding: 2px }
}
```

```html
<ng-autocomplete
    [dropdownData]="YOUR_DROPDOWN_DATA"
    (emitSelectedValue)="YOUR_CUSTOM_FUNTION($event)"
    [objectProperty]="'name'"
    [customClassType]="customClassType">
</ng-autocomplete>

```

## Adding custom Spinner

To add a custom spinner, do the following. Recommended to use custom spinner to have better control of project requirement.

Update @Input() properties like below

```ts
showLoadingSpinner = true; // Turn this ON so that module will show the spinner. By default it is ON (true)
```

```ts
isCustomSpinner = true;
```
```html
<ng-autocomplete
    [dropdownData]="YOUR_DROPDOWN_DATA"
    (emitSelectedValue)="YOUR_CUSTOM_FUNTION($event)"
    [showLoadingSpinner]="true"
    [isCustomSpinner]="true">
    <span customSpinner class="YOUR_CLASS"> </span>
</ng-autocomplete>
```

##### customSpinner in the span represents ng-content select attribute

## Using custom content in the input textfield

A flexible option is provided to add custom functionality in the input text field.

```html
<ng-autocomplete
    [dropdownData]="YOUR_DROPDOWN_DATA"
    (emitSelectedValue)="YOUR_CUSTOM_FUNTION($event)"
    [showdropDownArrow]="false"
    [showClearOption]="false">
    <span textField class="YOUR_CLASS">YOUR_CONTENT</span>
</ng-autocomplete>
```
`showdropDownArrow` and `showClearOption` can be set as false for better placement of the customized ng-content.

##### textField in the span represents ng-content select attribute



## Adding Accessible Rich Internet Applications (ARIA)

#### ARIA provides easy access to the content for people with disabilities with help of screen reader.

| Attributes | Decorator | Required | Description |
| :-------- | :-----------| :-----------|:-----------|
| `ariaRole`            | @Input    | `No` | Adds ARIA role  to `input textfield` |
| `ariaInputField`      | @Input    | `No` | Adds ARIA label  to `input textfield`|
| `ariaNoSearchResult`  | @Input    | `No` | Adds ARIA label to no result found `li` item|
| `ariaULList`          | @Input    | `No` | Adds ARIA label to `ul` list item |
| `ariaListContainer`   | @Input    | `No` | Adds ARIA label to list container `div`. |
| `ariaInputLabel`      | @Input    | `No` | Adds ARIA label to `label field`. |
| `ariaViewMore`        | @Input    | `No` | Adds ARIA label to View More `li` item |

## Change Logs and version history

Refer the change history by viewing this link - [CHANGELOG](https://github.com/nodeworld/ng-autocomplete-plugin/blob/release/CHANGELOG.md)

## Github link

Github Link - [ng-autocomplete-plugin](https://github.com/nodeworld/ng-autocomplete-plugin)

## Support

Please raise an issue in github repository

Github Link - [Raise an issue](https://github.com/nodeworld/ng-autocomplete-plugin/issues)

## Roadmap

- Multiselect dropdown before Q1 2025
- Extensive search - Ability to search entire object in the list
