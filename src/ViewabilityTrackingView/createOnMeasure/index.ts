import { Dimensions, MeasureOnSuccessCallback } from 'react-native'

import { onInView } from './onInView'
import { onOutOfView } from './onOutOfView'
import { OnMeasureParameters } from './types'

export const createOnMeasure = ({
  __mock__DimensionsGetWindow,
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
}: OnMeasureParameters): MeasureOnSuccessCallback => (
  _x,
  _y,
  width,
  height,
  pageX,
  pageY
) => {
  const now = Date.now()
  const { height: deviceHeight, width: deviceWidth } =
    (__mock__DimensionsGetWindow && __mock__DimensionsGetWindow()) ||
    Dimensions.get('window')

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

  const isInView =
    (isCoveringFullHeight && isCoveringFullWidth) ||
    itemVisiblePercent >= itemVisiblePercentThreshold

  if (debug) {
    console.log(`testID: ${testID}`, {
      fractionHeightInView,
      fractionWidthInView,
      height,
      heightOutOfView,
      isCoveringFullHeight,
      isCoveringFullWidth,
      isInView,
      itemVisiblePercent,
      pageX,
      pageY,
      width,
      widthOutOfView,
    })
  }

  if (isInView) {
    onInView({
      hasReportedViewabilityChange,
      inViewSince,
      item,
      itemVisiblePercent,
      minimumViewTime,
      now,
      onViewabilityChange,
      setHasReportedViewabilityChange,
      setInViewSince,
      setOutOfViewSince,
      testID,
    })
  } else {
    onOutOfView({
      item,
      itemVisiblePercent,
      now,
      onViewabilityChange,
      outOfViewSince,
      setHasReportedViewabilityChange,
      setInViewSince,
      setOutOfViewSince,
      testID,
    })
  }
}
