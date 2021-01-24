import * as React from 'react'
import { View } from 'react-native'

import { createMeasurementCallback } from './createMeasurementCallback'
import { useInterval } from '../useInterval'
import { ViewabilityTrackingViewProps } from './types'

export function ViewabilityTrackingView({
  children = null,
  debug = false,
  isViewabilityTrackingEnabled = true,
  item,
  itemVisiblePercentThreshold = 50,
  minimumViewTime = 1000,
  offsetBottom = 0,
  offsetLeft = 0,
  offsetRight = 0,
  offsetTop = 0,
  onViewabilityChange,
  testID,
  viewabilityMeasurementInterval = 250,
  ...viewProps
}: ViewabilityTrackingViewProps): React.ReactElement {
  const viewRef = React.useRef<View>(null)

  const [inViewSince, setInViewSince] = React.useState<number | null>(null)
  const [outOfViewSince, setOutOfViewSince] = React.useState<number | null>(
    null
  )

  const checkViewability = React.useCallback(() => {
    if (isViewabilityTrackingEnabled && viewRef.current) {
      viewRef.current.measure(
        createMeasurementCallback({
          debug,
          inViewSince,
          item,
          itemVisiblePercentThreshold,
          minimumViewTime,
          offsetBottom,
          offsetLeft,
          offsetRight,
          offsetTop,
          onViewabilityChange,
          outOfViewSince,
          setInViewSince,
          setOutOfViewSince,
          testID,
        })
      )
    }
  }, [
    debug,
    inViewSince,
    isViewabilityTrackingEnabled,
    item,
    itemVisiblePercentThreshold,
    minimumViewTime,
    offsetBottom,
    offsetLeft,
    offsetRight,
    offsetTop,
    onViewabilityChange,
    outOfViewSince,
    setInViewSince,
    setOutOfViewSince,
    testID,
  ])

  useInterval(checkViewability, viewabilityMeasurementInterval)

  return (
    <View {...viewProps} ref={viewRef} testID={testID}>
      {children}
    </View>
  )
}
