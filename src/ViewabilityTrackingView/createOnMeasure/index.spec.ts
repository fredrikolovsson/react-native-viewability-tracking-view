import { MeasureOnSuccessCallback } from 'react-native'

import { onInView } from './onInView'
import { onOutOfView } from './onOutOfView'

import { createOnMeasure } from './index'
import { OnMeasureParameters } from './types'

jest.mock('./onInView')
jest.mock('./onOutOfView')

let __mock__DimensionsGetWindow: jest.Mock
let defaultParams: OnMeasureParameters

beforeEach(() => {
  jest.resetAllMocks()

  __mock__DimensionsGetWindow = jest.fn()

  defaultParams = {
    __mock__DimensionsGetWindow,
    debug: false,
    hasReportedViewabilityChange: false,
    inViewSince: null,
    item: undefined,
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 1000,
    offsetBottom: 0,
    offsetLeft: 0,
    offsetRight: 0,
    offsetTop: 0,
    onViewabilityChange: jest.fn(),
    outOfViewSince: null,
    setHasReportedViewabilityChange: jest.fn(),
    setInViewSince: jest.fn(),
    setOutOfViewSince: jest.fn(),
    testID: 'testId',
  }
})

describe('createOnMeasure', () => {
  it('returns a function', () => {
    expect(typeof createOnMeasure(defaultParams)).toBe('function')
  })
})

describe('onMeasure', () => {
  let onMeasure: MeasureOnSuccessCallback

  beforeEach(() => {
    onMeasure = createOnMeasure(defaultParams)
  })

  it('calls onInView when onMeasure is called with coordinates inside the window', () => {
    __mock__DimensionsGetWindow.mockImplementation(() => ({
      height: 800,
      width: 350,
    }))

    onMeasure(0, 0, 100, 100, 0, 0)

    expect(onOutOfView).not.toHaveBeenCalled()
    expect(onInView).toHaveBeenCalledWith(
      expect.objectContaining({ itemVisiblePercent: 100 })
    )
  })

  it('calls inView when view is partially but more than 50% in view', () => {
    __mock__DimensionsGetWindow.mockImplementation(() => ({
      height: 100,
      width: 100,
    }))

    onMeasure(0, 0, 100, 100, 49, 0)

    expect(onOutOfView).not.toHaveBeenCalled()
    expect(onInView).toHaveBeenCalledWith(
      expect.objectContaining({ itemVisiblePercent: 51 })
    )
  })

  it('calls onOutOfView when onMeasure is called with coordinates outside the window', () => {
    __mock__DimensionsGetWindow.mockImplementation(() => ({
      height: 800,
      width: 350,
    }))

    onMeasure(0, 0, 100, 100, 500, 1000)

    expect(onInView).not.toHaveBeenCalled()
    expect(onOutOfView).toHaveBeenCalledWith(
      expect.objectContaining({ itemVisiblePercent: 0 })
    )
  })

  it('calls onOutOfView when view is less than 50% in view', () => {
    __mock__DimensionsGetWindow.mockImplementation(() => ({
      height: 100,
      width: 100,
    }))

    onMeasure(0, 0, 100, 100, 0, 51)

    expect(onInView).not.toHaveBeenCalled()
    expect(onOutOfView).toHaveBeenCalledWith(
      expect.objectContaining({ itemVisiblePercent: 49 })
    )
  })
})
