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
  __mock__DimensionsGetWindow?: jest.Mock<{ height: number; width: number }>
  hasReportedViewabilityChange: boolean
  inViewSince: number | null
  outOfViewSince: number | null
  setHasReportedViewabilityChange: (bool: boolean) => void
  setInViewSince: (dateNowOrNull: number | null) => void
  setOutOfViewSince: (dateNowOrNull: number | null) => void
}
