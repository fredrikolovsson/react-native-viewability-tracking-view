import { CreateMeasurementCallbackParameters } from '../types'

type OnInViewParameters = Pick<
  CreateMeasurementCallbackParameters,
  | 'debug'
  | 'hasReportedViewabilityChange'
  | 'inViewSince'
  | 'item'
  | 'minimumViewTime'
  | 'onViewabilityChange'
  | 'setHasReportedViewabilityChange'
  | 'setInViewSince'
  | 'setOutOfViewSince'
  | 'testID'
> & {
  height: number
  itemVisiblePercent: number
  now: number
  pageX: number
  pageY: number
  width: number
}

export function onInView({
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
}: OnInViewParameters): void {
  if (!inViewSince) {
    if (debug) {
      console.log(
        `testID: ${testID} came into view: pageX, pageY, width, height`,
        pageX,
        pageY,
        width,
        height
      )
    }

    setHasReportedViewabilityChange(false)
    setInViewSince(Date.now())
    setOutOfViewSince(null)
  } else if (
    now - inViewSince >= minimumViewTime &&
    !hasReportedViewabilityChange
  ) {
    if (debug) {
      console.log(
        `testID: ${testID} has been in view more than the minimumViewTime: pageX, pageY, width, height`,
        pageX,
        pageY,
        width,
        height
      )
    }

    onViewabilityChange({
      isInView: true,
      item,
      itemVisiblePercent,
      testID,
      timeInView: now - inViewSince,
    })
    setHasReportedViewabilityChange(true)
  } else {
    if (debug) {
      console.log(
        `testID: ${testID} is in view: pageX, pageY, width, height`,
        pageX,
        pageY,
        width,
        height
      )
    }
  }
}
