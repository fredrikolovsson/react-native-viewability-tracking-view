import { Dimensions, MeasureOnSuccessCallback } from 'react-native'

import { onInView } from './onInView'
import { onOutOfView } from './onOutOfView'
import { CreateMeasurementCallbackParameters } from './types'

export const createMeasurementCallback = ({
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
}: CreateMeasurementCallbackParameters): MeasureOnSuccessCallback => (
  _x,
  _y,
  width,
  height,
  pageX,
  pageY
) => {
  const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window')

  const isCoveringFullHeight =
    pageY <= offsetTop && pageY + height >= deviceHeight - offsetBottom
  const isCoveringFullWidth =
    pageX <= offsetLeft && pageX + width >= deviceWidth - offsetRight

  const heightOutOfView = Math.min(
    height,
    Math.max(offsetTop - pageY, 0) +
      Math.max(pageY + height - (deviceHeight - offsetBottom), 0)
  )
  const widthOutOfView = Math.min(
    width,
    Math.max(offsetLeft - pageX, 0) +
      Math.max(pageX + width - (deviceWidth - offsetRight), 0)
  )

  const fractionHeightInView =
    height === 0 || isCoveringFullHeight ? 1 : 1 - heightOutOfView / height
  const fractionWidthInView =
    width === 0 || isCoveringFullWidth ? 1 : 1 - widthOutOfView / width
  const itemVisiblePercent = fractionHeightInView * fractionWidthInView * 100

  const now = Date.now()
  const isInView =
    (isCoveringFullHeight && isCoveringFullWidth) ||
    itemVisiblePercent >= itemVisiblePercentThreshold

  if (isInView) {
    onInView({
      debug,
      hasReportedViewabilityChange,
      height,
      inViewSince,
      item,
      itemVisiblePercent,
      minimumViewTime,
      now,
      onViewabilityChange,
      pageX,
      pageY,
      setHasReportedViewabilityChange,
      setInViewSince,
      setOutOfViewSince,
      testID,
      width,
    })
  } else if (!outOfViewSince) {
    onOutOfView({
      debug,
      height,
      item,
      itemVisiblePercent,
      onViewabilityChange,
      pageX,
      pageY,
      setHasReportedViewabilityChange,
      setInViewSince,
      setOutOfViewSince,
      testID,
      width,
    })
  }
}
