import { CreateMeasurementCallbackParameters } from '../types'

type OnOutOfViewParameters = Pick<
  CreateMeasurementCallbackParameters,
  | 'item'
  | 'onViewabilityChange'
  | 'outOfViewSince'
  | 'setHasReportedViewabilityChange'
  | 'setInViewSince'
  | 'setOutOfViewSince'
  | 'testID'
> & {
  itemVisiblePercent: number
  now: number
}

export function onOutOfView({
  item,
  itemVisiblePercent,
  onViewabilityChange,
  outOfViewSince,
  setHasReportedViewabilityChange,
  setInViewSince,
  setOutOfViewSince,
  testID,
}: OnOutOfViewParameters): void {
  if (!outOfViewSince) {
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
