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

  const [
    hasReportedViewabilityChange,
    setHasReportedViewabilityChange,
  ] = React.useState<boolean>(false)
  const [inViewSince, setInViewSince] = React.useState<number | null>(null)
  const [outOfViewSince, setOutOfViewSince] = React.useState<number | null>(
    null
  )

  const checkViewability = React.useCallback(() => {
    if (isViewabilityTrackingEnabled && viewRef.current) {
      viewRef.current.measure(
        createMeasurementCallback({
          debug,
          hasReportedViewabilityChange,
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
          setHasReportedViewabilityChange,
          setInViewSince,
          setOutOfViewSince,
          testID,
        })
      )
    }
  }, [
    debug,
    hasReportedViewabilityChange,
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
    setHasReportedViewabilityChange,
    setInViewSince,
    setOutOfViewSince,
    testID,
  ])

  React.useEffect(() => {
    // reset to initialState if tracking is disabled
    if (!isViewabilityTrackingEnabled) {
      setHasReportedViewabilityChange(false)
      setInViewSince(null)
      setOutOfViewSince(null)
    }
  }, [isViewabilityTrackingEnabled])

  useInterval(checkViewability, viewabilityMeasurementInterval)

  return (
    <View {...viewProps} ref={viewRef} testID={testID}>
      {children}
    </View>
  )
}
