import { MeasureOnSuccessCallback } from 'react-native'

import { OnMeasureParameters, useOnMeasure } from '.'

const realDateNow = Date.now.bind(global.Date)
const sampleDateNow = 1612297448227
const windowHeight = 800
const windowWidth = 250
const __mock__DimensionsGetWindow = () => ({
  height: windowHeight,
  width: windowWidth,
})

let dateNowMock: jest.Mock
let onViewabilityChange: jest.Mock
let onViewabilityCheck: jest.Mock
let setViewabilityState: jest.Mock
let defaultParams: OnMeasureParameters<Record<string, unknown>>

beforeEach(() => {
  jest.resetAllMocks()

  dateNowMock = jest.fn()
  global.Date.now = dateNowMock

  onViewabilityChange = jest.fn()
  onViewabilityCheck = jest.fn()
  setViewabilityState = jest.fn()

  defaultParams = {
    __mock__DimensionsGetWindow,
    debug: false,
    item: undefined,
    minimumViewTime: 1000,
    onViewabilityChange,
    onViewabilityCheck,
    setViewabilityState,
    testID: 'testId',
    viewabilityMeasurementConfig: {
      itemVisiblePercentThreshold: 50,
      offsetBottom: 0,
      offsetLeft: 0,
      offsetRight: 0,
      offsetTop: 0,
    },
    viewabilityState: {
      hasCalledOnViewabilityChange: false,
      inViewSince: null,
      outOfViewSince: null,
    },
  }
})

afterEach(() => {
  global.Date.now = realDateNow
})

describe('useOnMeasure', () => {
  it('returns a function', () => {
    expect(typeof useOnMeasure(defaultParams)).toBe('function')
  })
})

it('calls onViewabilityCheck when provided on every measure', () => {
  dateNowMock.mockReturnValue(sampleDateNow)

  const constantViewabilityCheckParams = {
    item: { id: '1' },
    testID: defaultParams.testID,
  }
  const params = { ...defaultParams, ...constantViewabilityCheckParams }

  let onMeasure = useOnMeasure(params)
  onMeasure(0, 0, 100, 100, 0, 0)

  expect(onViewabilityCheck).toHaveBeenLastCalledWith({
    ...constantViewabilityCheckParams,
    isInView: true,
    itemVisiblePercent: 100,
    timeInView: 0,
    timeOutOfView: undefined,
  })

  dateNowMock.mockReturnValue(sampleDateNow + 200)
  const updatedParams = { ...params }
  updatedParams.viewabilityState.inViewSince = sampleDateNow
  onMeasure = useOnMeasure(updatedParams)
  onMeasure(0, 0, 100, 100, 0, 0)

  expect(onViewabilityCheck).toHaveBeenLastCalledWith({
    ...constantViewabilityCheckParams,
    isInView: true,
    itemVisiblePercent: 100,
    timeInView: 200,
    timeOutOfView: undefined,
  })

  dateNowMock.mockReturnValue(sampleDateNow + 400)
  onMeasure = useOnMeasure(updatedParams)
  onMeasure(0, 0, 100, 100, 0, 0)

  expect(onViewabilityCheck).toHaveBeenLastCalledWith({
    ...constantViewabilityCheckParams,
    isInView: true,
    itemVisiblePercent: 100,
    timeInView: 400,
    timeOutOfView: undefined,
  })

  dateNowMock.mockReturnValue(sampleDateNow + 600)
  onMeasure = useOnMeasure(updatedParams)
  onMeasure(0, 0, 100, 100, 23456, 23456)

  expect(onViewabilityCheck).toHaveBeenLastCalledWith({
    ...constantViewabilityCheckParams,
    isInView: false,
    itemVisiblePercent: 0,
    timeInView: undefined,
    timeOutOfView: 0,
  })
})

const inViewCoordinates = [
  {
    // item fully contained in window
    itemVisiblePercent: 100,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    pageX: 0,
    pageY: 0,
  },
  {
    // item bigger than window but fully in window
    itemVisiblePercent: 100,
    x: 0,
    y: 0,
    width: windowWidth * 2,
    height: windowHeight * 2,
    pageX: -200,
    pageY: -200,
  },
  {
    // item filling the window height but has only half of the width in window
    itemVisiblePercent: 50,
    x: 0,
    y: 0,
    width: windowWidth,
    height: windowHeight * 2,
    pageX: windowWidth / 2,
    pageY: 0,
  },
  {
    // half of the item below the window
    itemVisiblePercent: 50,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    pageX: 0,
    pageY: windowHeight - 50,
  },
  {
    // half of the item to the left of the window
    itemVisiblePercent: 50,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    pageX: -50,
    pageY: 0,
  },
  {
    // part of the item outside to the top right
    itemVisiblePercent: 81,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    pageX: windowWidth - 90,
    pageY: -10,
  },
]

inViewCoordinates.forEach(
  ({ itemVisiblePercent, x, y, width, height, pageX, pageY }) => {
    let onMeasure: MeasureOnSuccessCallback

    describe('when viewable pixels are above or at the itemVisiblePercentThreshold', () => {
      describe(`with onMeasure(${x}, ${y}, ${width}, ${height}, ${pageX}, ${pageY}) and itemVisiblePercent: ${itemVisiblePercent}`, () => {
        describe('for the first time, i.e. inViewSince is null', () => {
          it('does not call onViewabilityChange, but sets inViewSince to Date.now', () => {
            dateNowMock.mockReturnValue(sampleDateNow)

            const params = { ...defaultParams }
            params.viewabilityState.inViewSince = null

            onMeasure = useOnMeasure(params)
            onMeasure(x, y, width, height, pageX, pageY)

            expect(onViewabilityChange).not.toHaveBeenCalled()
            expect(setViewabilityState).toHaveBeenCalledWith({
              hasCalledOnViewabilityChange: false,
              inViewSince: sampleDateNow,
              outOfViewSince: null,
            })
          })
        })

        describe('for a subsequent time but with less time passed than the minimumViewTime', () => {
          it('does not call onViewabilityChange and does not change inViewSince', () => {
            const laterButBeforeTheMinimumViewTime =
              sampleDateNow + defaultParams.minimumViewTime - 1
            dateNowMock.mockReturnValue(laterButBeforeTheMinimumViewTime)

            const params = { ...defaultParams }
            params.viewabilityState.inViewSince = sampleDateNow

            onMeasure = useOnMeasure(params)
            onMeasure(x, y, width, height, pageX, pageY)

            expect(onViewabilityChange).not.toHaveBeenCalled()
            expect(setViewabilityState).not.toHaveBeenCalled()
          })
        })

        describe('for a subsequent time with more time passed than the minimumViewTime', () => {
          it('calls onViewabilityChange and sets hasCalledOnViewabilityChange true', () => {
            const timeInView = defaultParams.minimumViewTime
            const atMinimumViewTime = sampleDateNow + timeInView
            dateNowMock.mockReturnValue(atMinimumViewTime)

            const params = { ...defaultParams }
            params.viewabilityState.inViewSince = sampleDateNow

            onMeasure = useOnMeasure(params)
            onMeasure(x, y, width, height, pageX, pageY)

            expect(onViewabilityChange).toHaveBeenCalledWith({
              isInView: true,
              item: undefined,
              itemVisiblePercent,
              testID: 'testId',
              timeInView,
            })
            expect(setViewabilityState).toHaveBeenCalledWith({
              hasCalledOnViewabilityChange: true,
              inViewSince: sampleDateNow,
              outOfViewSince: null,
            })
          })
        })
      })
    })
  }
)

const outOfViewCoordinates = [
  {
    // item fully outside window
    itemVisiblePercent: 0,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    pageX: windowWidth + 200,
    pageY: windowHeight + 200,
  },
  {
    // item bigger than window but outside it
    itemVisiblePercent: 0,
    x: 0,
    y: 0,
    width: windowWidth * 2,
    height: windowHeight * 2,
    pageX: windowWidth * 2,
    pageY: windowHeight * 2,
  },
  {
    // item filling the window height but has only 49% of the width in window
    itemVisiblePercent: 49,
    x: 0,
    y: 0,
    width: windowWidth,
    height: windowHeight * 2,
    pageX: windowWidth * 0.51,
    pageY: 0,
  },
  {
    // more than half of the item below the window
    itemVisiblePercent: 49,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    pageX: 0,
    pageY: windowHeight - 49,
  },
  {
    // more than half of the item to the left of the window
    itemVisiblePercent: 49,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    pageX: -51,
    pageY: 0,
  },
  {
    // too big part of the item outside to the top right
    itemVisiblePercent: 1,
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    pageX: windowWidth - 10,
    pageY: -90,
  },
]

outOfViewCoordinates.forEach(
  ({ itemVisiblePercent, x, y, width, height, pageX, pageY }) => {
    let onMeasure: MeasureOnSuccessCallback

    describe('when viewable pixels are below itemVisiblePercentThreshold', () => {
      describe(`with onMeasure(${x}, ${y}, ${width}, ${height}, ${pageX}, ${pageY}) and itemVisiblePercent: ${itemVisiblePercent}`, () => {
        describe('for the first time, i.e. outOfViewSince is null', () => {
          it('calls onViewabilityChange and sets hasCalledOnViewabilityChange and outOfViewSince', () => {
            dateNowMock.mockReturnValue(sampleDateNow)

            const params = { ...defaultParams }
            params.viewabilityState.inViewSince = sampleDateNow

            onMeasure = useOnMeasure(params)
            onMeasure(x, y, width, height, pageX, pageY)

            expect(onViewabilityChange).toHaveBeenCalledWith({
              isInView: false,
              item: undefined,
              itemVisiblePercent,
              testID: 'testId',
            })
            expect(setViewabilityState).toHaveBeenCalledWith({
              hasCalledOnViewabilityChange: true,
              inViewSince: null,
              outOfViewSince: sampleDateNow,
            })
          })
        })

        describe('for a subsequent time', () => {
          it('does not call onViewabilityChange and does not change outOfViewSince', () => {
            const later = sampleDateNow + defaultParams.minimumViewTime
            dateNowMock.mockReturnValue(later)

            const params = { ...defaultParams }
            params.viewabilityState.outOfViewSince = sampleDateNow

            onMeasure = useOnMeasure(params)
            onMeasure(x, y, width, height, pageX, pageY)

            expect(onViewabilityChange).not.toHaveBeenCalled()
            expect(setViewabilityState).not.toHaveBeenCalled()
          })
        })
      })
    })
  }
)

describe('custom configurations', () => {
  describe('with itemVisiblePercentThreshold=75 and minimumViewTime=500', () => {
    describe('when having been in view long enough', () => {
      it('calls onViewabilityChange and sets hasCalledOnViewabilityChange true', () => {
        const itemVisiblePercentThreshold = 75
        const minimumViewTime = 500
        const timeInView = minimumViewTime
        const atMinimumViewTime = sampleDateNow + timeInView
        dateNowMock.mockReturnValue(atMinimumViewTime)

        const params = {
          ...defaultParams,
          itemVisiblePercentThreshold,
          minimumViewTime,
        }
        params.viewabilityState.inViewSince = sampleDateNow

        const onMeasure = useOnMeasure(params)
        onMeasure(0, 0, 100, 100, 0, -25)

        expect(onViewabilityChange).toHaveBeenCalledWith({
          isInView: true,
          item: undefined,
          itemVisiblePercent: 75,
          testID: 'testId',
          timeInView,
        })
        expect(setViewabilityState).toHaveBeenCalledWith({
          hasCalledOnViewabilityChange: true,
          inViewSince: sampleDateNow,
          outOfViewSince: null,
        })
      })
    })

    describe('when going out of view', () => {
      it('calls onViewabilityChange and sets outOfViewSince', () => {
        const itemVisiblePercentThreshold = 75
        const minimumViewTime = 500
        const later = sampleDateNow + minimumViewTime
        dateNowMock.mockReturnValue(later)

        const params = {
          ...defaultParams,
          minimumViewTime,
        }
        params.viewabilityMeasurementConfig.itemVisiblePercentThreshold = itemVisiblePercentThreshold
        params.viewabilityState.inViewSince = sampleDateNow

        const onMeasure = useOnMeasure(params)
        onMeasure(0, 0, 100, 100, 0, -26)

        expect(onViewabilityChange).toHaveBeenCalledWith({
          isInView: false,
          item: undefined,
          itemVisiblePercent: 74,
          testID: 'testId',
        })
        expect(setViewabilityState).toHaveBeenCalledWith({
          hasCalledOnViewabilityChange: true,
          inViewSince: null,
          outOfViewSince: later,
        })
      })
    })

    describe('when in view, but not yet for long enough', () => {
      it('does not call onViewabilityChange', () => {
        const itemVisiblePercentThreshold = 75
        const minimumViewTime = 500
        const timeInView = minimumViewTime - 1
        const beforeMinimumViewTime = sampleDateNow + timeInView
        dateNowMock.mockReturnValue(beforeMinimumViewTime)

        const params = {
          ...defaultParams,
          minimumViewTime,
        }
        params.viewabilityMeasurementConfig.itemVisiblePercentThreshold = itemVisiblePercentThreshold
        params.viewabilityState.inViewSince = sampleDateNow

        const onMeasure = useOnMeasure(params)
        onMeasure(0, 0, 100, 100, 0, 0)

        expect(onViewabilityChange).not.toHaveBeenCalled()
        expect(setViewabilityState).not.toHaveBeenCalled()
      })
    })
  })

  describe('with offsets', () => {
    describe('on first measure', () => {
      it('respects offsetTop=50', () => {
        const offsetTop = 50
        dateNowMock.mockReturnValue(sampleDateNow)

        const params = { ...defaultParams }
        params.viewabilityMeasurementConfig.offsetTop = offsetTop

        let onMeasure = useOnMeasure(params)
        onMeasure(0, 0, 100, 100, 0, 0) // 50% in view

        const updatedViewabilityState = {
          hasCalledOnViewabilityChange: false, // minimumViewTime has not yet elapsed
          inViewSince: sampleDateNow,
          outOfViewSince: null,
        }
        expect(setViewabilityState).toHaveBeenLastCalledWith(
          updatedViewabilityState
        )

        dateNowMock.mockReturnValue(sampleDateNow + 100)
        onMeasure = useOnMeasure({
          ...params,
          viewabilityState: updatedViewabilityState,
        })
        onMeasure(0, 0, 100, 100, 0, -1) // 49% in view

        expect(setViewabilityState).toHaveBeenLastCalledWith({
          hasCalledOnViewabilityChange: true, // called immediately when going out of view
          inViewSince: null,
          outOfViewSince: sampleDateNow + 100,
        })
      })

      it('respects offsetBottom=20', () => {
        const offsetBottom = 20
        dateNowMock.mockReturnValue(sampleDateNow)

        const params = { ...defaultParams }
        params.viewabilityMeasurementConfig.offsetBottom = offsetBottom

        let onMeasure = useOnMeasure(params)
        onMeasure(0, 0, 100, 100, 0, windowHeight - (offsetBottom + 50)) // 50% in view

        const updatedViewabilityState = {
          hasCalledOnViewabilityChange: false, // minimumViewTime has not yet elapsed
          inViewSince: sampleDateNow,
          outOfViewSince: null,
        }
        expect(setViewabilityState).toHaveBeenLastCalledWith(
          updatedViewabilityState
        )

        dateNowMock.mockReturnValue(sampleDateNow + 100)
        onMeasure = useOnMeasure({
          ...params,
          viewabilityState: updatedViewabilityState,
        })
        onMeasure(0, 0, 100, 100, 0, windowHeight - (offsetBottom + 49)) // 49% in view

        expect(setViewabilityState).toHaveBeenLastCalledWith({
          hasCalledOnViewabilityChange: true, // called immediately when going out of view
          inViewSince: null,
          outOfViewSince: sampleDateNow + 100,
        })
      })

      it('respects offsetLeft=40', () => {
        const offsetLeft = 40
        dateNowMock.mockReturnValue(sampleDateNow)

        const params = { ...defaultParams }
        params.viewabilityMeasurementConfig.offsetLeft = offsetLeft

        let onMeasure = useOnMeasure(params)
        onMeasure(0, 0, 100, 100, -10, 0) // 50% in view

        const updatedViewabilityState = {
          hasCalledOnViewabilityChange: false, // minimumViewTime has not yet elapsed
          inViewSince: sampleDateNow,
          outOfViewSince: null,
        }
        expect(setViewabilityState).toHaveBeenLastCalledWith(
          updatedViewabilityState
        )

        dateNowMock.mockReturnValue(sampleDateNow + 100)
        onMeasure = useOnMeasure({
          ...params,
          viewabilityState: updatedViewabilityState,
        })
        onMeasure(0, 0, 100, 100, -11, 0) // 49% in view

        expect(setViewabilityState).toHaveBeenLastCalledWith({
          hasCalledOnViewabilityChange: true, // called immediately when going out of view
          inViewSince: null,
          outOfViewSince: sampleDateNow + 100,
        })
      })

      it('respects offsetRight=25', () => {
        const offsetRight = 25
        dateNowMock.mockReturnValue(sampleDateNow)

        const params = { ...defaultParams }
        params.viewabilityMeasurementConfig.offsetRight = offsetRight

        let onMeasure = useOnMeasure(params)
        onMeasure(0, 0, 100, 100, windowWidth - (offsetRight + 50), 0) // 50% in view

        const updatedViewabilityState = {
          hasCalledOnViewabilityChange: false, // minimumViewTime has not yet elapsed
          inViewSince: sampleDateNow,
          outOfViewSince: null,
        }
        expect(setViewabilityState).toHaveBeenLastCalledWith(
          updatedViewabilityState
        )

        dateNowMock.mockReturnValue(sampleDateNow + 100)
        onMeasure = useOnMeasure({
          ...params,
          viewabilityState: updatedViewabilityState,
        })
        onMeasure(0, 0, 100, 100, windowWidth - (offsetRight + 49), 0) // 49% in view

        expect(setViewabilityState).toHaveBeenLastCalledWith({
          hasCalledOnViewabilityChange: true, // called immediately when going out of view
          inViewSince: null,
          outOfViewSince: sampleDateNow + 100,
        })
      })
    })
  })
})
