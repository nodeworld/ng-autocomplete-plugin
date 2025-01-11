# Module version changes and fixes.

## 2.1.3

`Users are safe to upgrade to 2.1.3 from any lower version without any module level changes.`
- Added banner for readme file. Refer [modulejs.org](https://modulejs.org) for clean documentation.

## 2.1.2

`Users are safe to upgrade to 2.1.2 from any lower version without any module level changes.`
- Added ESC keyboard event to close autocomplete on pressing ESC.

## 2.1.1

`Users are safe to upgrade to 2.1.1 from any lower version without any module level changes.`
- Added keyboard navigation events to scroll through dropdown list and select when pressing Enter Key.
- Added Aria label to the dropdown list to help the screen readers.
- Fixed a bug to not select dropdown when list is disabled

## 2.0.1

`Users are safe to upgrade to 2.0.0 from any lower version without any module level changes.`
- Added information on input property `viewMoreText` in README file.
- Added information on input property `ariaViewMore`.

## 2.0.0

`Users are safe to upgrade to 2.0.0 from any lower version without any module level changes.`

- Search algorithm has been redefined without impacting prior versions. Certain bugs are fixed.
- Added `View More` to List dropdown at the end of the list as an alternative to call API when reaching the end of scroll.
- Now the developers who consume this package can decide how they should trigger an API Call. Using `View More`, or triggering API Call when reaching end of scroll. Both can be configured as well. Refer below for more information.
- Added the input properties - inspectAutoCompleteList, viewMoreText and optViewMoreOnlyForApiCall.
- Renamed the internal class `loader`  to `autocomplete-plugin-loader` as `loader` class is too common name and may collide with other libraries.
- Updated scroll event and resize event by using `Renderer2` to efficiently manage the event listeners.
- Updated Readme file and stackblitz examples.
- Upgrade to this package is recommended.

## 1.0.3
- Readme file update

## 1.0.2
- Readme file update

## 1.0.1
- First package release.
