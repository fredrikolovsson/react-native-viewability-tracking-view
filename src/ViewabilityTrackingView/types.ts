import * as React from 'react'
import { ViewProps } from 'react-native'

import {
  OnViewabilityCallback,
  OnViewabilityCallbackParameters,
} from './useOnMeasure'

export { OnViewabilityCallback, OnViewabilityCallbackParameters }

export interface ViewabilityTrackingViewProps<
  Item extends Record<string, unknown>
> extends ViewProps {
  /**
   * DEV ONLY: Set to true to get console.logs of the viewability, each time it's measured.
   *
   * @type {boolean}
   * @memberof ViewabilityTrackingViewProps
   */
  __DEV__debug?: boolean

  children?: React.ReactNode

  /**
   * Requiring explicit opt-in to the tracking. This is to remind consumers that viewability tracking
   * might affect performance, so ideally it should only be enabled when there is a chance that the
   * content will come into view.
   *
   * @type {boolean}
   * @memberof ViewabilityTrackingViewProps
   */
  enabled: boolean

  /**
   * Minimum percent of pixels that need to be viewable for item to be considered in view. Defaults to 50.
   *
   * @type {number}
   * @memberof ViewabilityTrackingViewProps
   */
  itemVisiblePercentThreshold?: number

  /**
   * Item is optional, but passed into the onViewability* callbacks.
   *
   * @type {OnMeasureParameters['item']}
   * @memberof ViewabilityTrackingViewProps
   */
  item?: Item

  /**
   * Minimum view time, in milliseconds, required to trigger onViewabilityChange. Defaults to 1000.
   *
   * @type {number}
   * @memberof ViewabilityTrackingViewProps
   */
  minimumViewTime?: number

  /**
   * Use offsetBottom to set that amount of pixels as not viewable, e.g. if there is a fixed bottom
   * bar that content can be scrolled behind, while still within the window of the device.
   *
   * @type {number}
   * @memberof ViewabilityTrackingViewProps
   */
  offsetBottom?: number

  /**
   * Use offsetLeft to set that amount of pixels as not viewable, e.g. if there is a fixed sidebar
   * that content can be scrolled behind, while still within the window of the device.
   *
   * @type {number}
   * @memberof ViewabilityTrackingViewProps
   */
  offsetLeft?: number

  /**
   * Use offsetRight to set that amount of pixels as not viewable, e.g. if there is a fixed sidebar
   * that content can be scrolled behind, while still within the window of the device.
   *
   * @type {number}
   * @memberof ViewabilityTrackingViewProps
   */
  offsetRight?: number

  /**
   * Use offsetTop to set that amount of pixels as not viewable, e.g. if there is a fixed header
   * that content can be scrolled behind, while still within the window of the device.
   *
   * @type {number}
   * @memberof ViewabilityTrackingViewProps
   */
  offsetTop?: number

  /**
   * Called when the itemVisiblePercentThreshold and the minimumViewTime is met for the first time
   * since coming into view and when going out of view after having been in view. In the latter case
   * it does not matter for how long it had been in view before going out of view.
   *
   * @memberof ViewabilityTrackingViewProps
   */
  onViewabilityChange?: OnViewabilityCallback<Item>

  /**
   * Called on every viewability measurement, which is done at the viewabilityMeasurementInterval.
   *
   * @memberof ViewabilityTrackingViewProps
   */
  onViewabilityCheck?: OnViewabilityCallback<Item>

  testID?: string

  /**
   * Time between viewability measurements, in milliseconds. Defaults to 200.
   *
   * @type {number}
   * @memberof ViewabilityTrackingViewProps
   */
  viewabilityMeasurementInterval?: number
}
