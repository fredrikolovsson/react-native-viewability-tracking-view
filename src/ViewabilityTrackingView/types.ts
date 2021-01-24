import { ViewProps } from 'react-native'

export interface OnViewabilityChangeParameters {
  isInView: boolean
  item?: Record<string, unknown>
  itemVisiblePercent: number
  testID?: string
  timeInView: number
  timeOutOfView: number
}

export interface Props extends ViewProps {
  children?: React.ReactNode
  debug?: boolean
  isViewabilityTrackingEnabled?: boolean
  item?: Record<string, unknown>
  itemVisiblePercentThreshold?: number
  minimumViewTime?: number
  offsetBottom?: number
  offsetLeft?: number
  offsetRight?: number
  offsetTop?: number
  onViewabilityChange: (data: OnViewabilityChangeParameters) => void
  testID?: string
  viewabilityMeasurementInterval?: number
}
