import { CreateMeasurementCallbackParameters } from '../types'

type OnOutOfViewParameters = Pick<
  CreateMeasurementCallbackParameters,
  | 'debug'
  | 'item'
  | 'onViewabilityChange'
  | 'outOfViewSince'
  | 'setHasReportedViewabilityChange'
  | 'setInViewSince'
  | 'setOutOfViewSince'
  | 'testID'
> & {
  height: number
  itemVisiblePercent: number
  pageX: number
  pageY: number
  width: number
}

export function onOutOfView({
  debug,
  height,
  item,
  itemVisiblePercent,
  onViewabilityChange,
  outOfViewSince,
  pageX,
  pageY,
  setHasReportedViewabilityChange,
  setInViewSince,
  setOutOfViewSince,
  testID,
  width,
}: OnOutOfViewParameters): void {
  if (!outOfViewSince) {
    if (debug) {
      console.log(
        `testID: ${testID} went out of view: pageX, pageY, width, height`,
        pageX,
        pageY,
        width,
        height
      )
    }

    onViewabilityChange({
      isInView: false,
      item,
      itemVisiblePercent,
      testID,
    })
    setHasReportedViewabilityChange(true)
    setInViewSince(null)
    setOutOfViewSince(Date.now())
  }
}
