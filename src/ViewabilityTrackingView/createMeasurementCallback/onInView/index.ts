import { CreateMeasurementCallbackParameters } from '../types'

type OnInViewParameters = Pick<
  CreateMeasurementCallbackParameters,
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
  itemVisiblePercent: number
  now: number
}

export function onInView({
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
}: OnInViewParameters): void {
  if (!inViewSince) {
    setHasReportedViewabilityChange(false)
    setInViewSince(Date.now())
    setOutOfViewSince(null)
  } else if (
    now - inViewSince >= minimumViewTime &&
    !hasReportedViewabilityChange
  ) {
    onViewabilityChange({
      isInView: true,
      item,
      itemVisiblePercent,
      testID,
      timeInView: now - inViewSince,
    })
    setHasReportedViewabilityChange(true)
  }
}
