import { Dimensions, MeasureOnSuccessCallback } from 'react-native'

import {
  getItemViewability,
  ViewabilityMeasurementConfig,
} from './getItemViewability'

export interface OnViewabilityCallbackParameters<
  Item extends Record<string, unknown> = Record<string, never>
> {
  isInView: boolean
  item?: Item
  itemVisiblePercent: number
  testID?: string
  timeInView?: number
  timeOutOfView?: number
}

export type OnViewabilityCallback<Item extends Record<string, unknown> = Record<string, never>> = (
  params: OnViewabilityCallbackParameters<Item>
) => void

export interface ViewabilityState {
  hasCalledOnViewabilityChange: boolean
  inViewSince: number | null
  outOfViewSince: number | null
}

export interface OnMeasureParameters<
  Item extends Record<string, unknown> = Record<string, never>
> {
  __mock__DimensionsGetWindow?: () => { height: number; width: number }
  debug: boolean
  item?: Item
  minimumViewTime: number
  onViewabilityChange?: OnViewabilityCallback<Item>
  onViewabilityCheck?: OnViewabilityCallback<Item>
  setViewabilityState: (S: ViewabilityState) => void
  testID?: string
  viewabilityMeasurementConfig: ViewabilityMeasurementConfig
  viewabilityState: ViewabilityState
}

export const useOnMeasure = <Item extends Record<string, unknown> = Record<string, never>>({
  __mock__DimensionsGetWindow,
  debug,
  item,
  minimumViewTime,
  onViewabilityChange,
  onViewabilityCheck,
  testID,
  setViewabilityState,
  viewabilityMeasurementConfig,
  viewabilityState,
}: OnMeasureParameters<Item>): MeasureOnSuccessCallback => {
  return function onMeasure(_x, _y, width, height, pageX, pageY) {
    const { height: deviceHeight, width: deviceWidth } =
      (__mock__DimensionsGetWindow && __mock__DimensionsGetWindow()) ||
      Dimensions.get('window')

    const measurements = {
      deviceHeight,
      deviceWidth,
      height,
      pageX,
      pageY,
      width,
    }

    const { isInView, itemVisiblePercent } = getItemViewability({
      debug,
      measurements,
      testID,
      viewabilityMeasurementConfig,
    })

    const now = Date.now()
    const {
      hasCalledOnViewabilityChange,
      inViewSince,
      outOfViewSince,
    } = viewabilityState
    const hasBeenInViewForTheMinimumViewTime =
      !!inViewSince && now >= inViewSince + minimumViewTime

    if (onViewabilityCheck) {
      onViewabilityCheck({
        isInView,
        item,
        itemVisiblePercent,
        testID,
        // apologies for the nested ternaries...
        timeInView: isInView
          ? inViewSince
            ? now - inViewSince
            : 0
          : undefined,
        timeOutOfView: !isInView
          ? outOfViewSince
            ? now - outOfViewSince
            : 0
          : undefined,
      })
    }

    if (isInView && inViewSince === null) {
      setViewabilityState({
        hasCalledOnViewabilityChange: false,
        inViewSince: Date.now(),
        outOfViewSince: null,
      })

      return
    }

    if (
      isInView &&
      !!inViewSince && // TS demanded it even though this is part of hasBeenInViewForTheMinimumViewTime
      hasBeenInViewForTheMinimumViewTime &&
      !hasCalledOnViewabilityChange
    ) {
      if (onViewabilityChange) {
        onViewabilityChange({
          isInView: true,
          item,
          itemVisiblePercent,
          testID,
          timeInView: now - inViewSince,
        })
      }

      setViewabilityState({
        ...viewabilityState,
        hasCalledOnViewabilityChange: true,
      })

      return
    }

    if (!isInView && outOfViewSince === null) {
      if (onViewabilityChange) {
        onViewabilityChange({
          isInView: false,
          item,
          itemVisiblePercent,
          testID,
        })
      }

      setViewabilityState({
        hasCalledOnViewabilityChange: true,
        inViewSince: null,
        outOfViewSince: Date.now(),
      })
    }
  }
}
