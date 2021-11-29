import * as React from 'react'
import { View } from 'react-native'

import { useOnMeasure, ViewabilityState } from './useOnMeasure'
import { useInterval } from './useInterval'
import { ViewabilityTrackingViewProps } from './types'

const initialState = {
  hasCalledOnViewabilityChange: false,
  inViewSince: null,
  outOfViewSince: null,
}

export const ViewabilityTrackingView = <Item extends Record<string, unknown>>({
  __DEV__debug = false,
  children = null,
  enabled,
  item,
  itemVisiblePercentThreshold = 50,
  minimumViewTime = 1000,
  offsetBottom = 0,
  offsetLeft = 0,
  offsetRight = 0,
  offsetTop = 0,
  onViewabilityChange,
  onViewabilityCheck,
  testID,
  viewabilityMeasurementInterval = 200,
  ...viewProps
}: ViewabilityTrackingViewProps<Item>): React.ReactElement => {
  const viewRef = React.useRef<View>(null)
  const [viewabilityState, setViewabilityState] = React.useState<ViewabilityState>(initialState)

  React.useEffect(() => {
    // reset to initialState if tracking becomes disabled
    if (!enabled) {
      setViewabilityState(initialState)
    }
  }, [enabled])

  const viewabilityMeasurementConfig = {
    itemVisiblePercentThreshold,
    offsetBottom,
    offsetLeft,
    offsetRight,
    offsetTop,
  }

  const onMeasure = useOnMeasure({
    debug: __DEV__debug,
    item,
    minimumViewTime,
    onViewabilityChange,
    onViewabilityCheck,
    setViewabilityState,
    testID,
    viewabilityMeasurementConfig,
    viewabilityState,
  })

  const checkViewability = () => {
    if (enabled && viewRef.current) {
      viewRef.current.measure(onMeasure)
    }
  }

  // only check viewability if tracking is enabled
  useInterval(checkViewability, enabled ? viewabilityMeasurementInterval : null)

  return (
    <View {...viewProps} collapsable={false} ref={viewRef} testID={testID}>
      {children}
    </View>
  )
}
