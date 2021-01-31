import { ViewabilityTrackingViewProps } from '../types'

export interface OnMeasureParameters
  extends Required<
      Pick<
        ViewabilityTrackingViewProps,
        | 'debug'
        | 'itemVisiblePercentThreshold'
        | 'minimumViewTime'
        | 'offsetBottom'
        | 'offsetLeft'
        | 'offsetRight'
        | 'offsetTop'
        | 'onViewabilityChange'
      >
    >,
    Pick<ViewabilityTrackingViewProps, 'item' | 'testID'> {
  hasReportedViewabilityChange: boolean
  inViewSince: number | null
  outOfViewSince: number | null
  setHasReportedViewabilityChange: (bool: boolean) => void
  setInViewSince: (dateNowOrNull: number | null) => void
  setOutOfViewSince: (dateNowOrNull: number | null) => void
}
