export interface ViewabilityMeasurementConfig {
  itemVisiblePercentThreshold: number
  offsetBottom: number
  offsetLeft: number
  offsetRight: number
  offsetTop: number
}

export interface GetItemViewabilityParameters {
  debug: boolean
  measurements: {
    deviceHeight: number
    deviceWidth: number
    height: number
    pageX: number
    pageY: number
    width: number
  }
  testID?: string
  viewabilityMeasurementConfig: ViewabilityMeasurementConfig
}

export function getItemViewability({
  debug,
  measurements: { deviceHeight, deviceWidth, height, pageX, pageY, width },
  viewabilityMeasurementConfig: {
    itemVisiblePercentThreshold,
    offsetBottom,
    offsetLeft,
    offsetRight,
    offsetTop,
  },
  testID,
}: GetItemViewabilityParameters): {
  isInView: boolean
  itemVisiblePercent: number
} {
  // TODO: add unit tests, although useOnMeasure.native.spec.ts should serve as integration tests
  const isCoveringFullHeight =
    pageY <= offsetTop && pageY + height >= deviceHeight - offsetBottom
  const isCoveringFullWidth =
    pageX <= offsetLeft && pageX + width >= deviceWidth - offsetRight
  const isCoveringWindow = isCoveringFullHeight && isCoveringFullWidth

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

  // round to avoid things like 0.1 * 0.1 * 100 = 1.0000000000000002
  const itemVisiblePercent = Math.round(
    fractionHeightInView * fractionWidthInView * 100
  )

  const isInView =
    isCoveringWindow || itemVisiblePercent >= itemVisiblePercentThreshold

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

  return { isInView, itemVisiblePercent }
}
