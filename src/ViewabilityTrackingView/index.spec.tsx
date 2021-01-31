import * as React from 'react'
import { View } from 'react-native'
import { render } from '@testing-library/react-native'

import { ViewabilityTrackingView } from './index'
import { useInterval } from './useInterval'

jest.mock('../useInterval')

beforeEach(() => {
  jest.resetAllMocks()
})

test('renders ViewabilityTrackingView without error', () => {
  const onViewabilityChange = jest.fn()

  expect(() => {
    render(
      <ViewabilityTrackingView
        key="test"
        onViewabilityChange={onViewabilityChange}
        testID="test"
      />
    )
  }).not.toThrow()
})

test('renders a View with children and passes through testID and other built-in View props', () => {
  const onViewabilityChange = jest.fn()

  const { getByTestId } = render(
    <ViewabilityTrackingView
      accessibilityLabel="Tap me!"
      onViewabilityChange={onViewabilityChange}
      style={{ backgroundColor: 'red' }}
      testID="ViewabilityTrackingView"
    >
      <View style={{ height: 30, width: 30 }} testID="child" />
    </ViewabilityTrackingView>
  )

  const trackingView = getByTestId('ViewabilityTrackingView')

  expect(trackingView.type).toBe('View')
  expect(trackingView.props).toMatchInlineSnapshot(`
    Object {
      "accessibilityLabel": "Tap me!",
      "children": <Component
        style={
          Object {
            "height": 30,
            "width": 30,
          }
        }
        testID="child"
      />,
      "style": Object {
        "backgroundColor": "red",
      },
      "testID": "ViewabilityTrackingView",
    }
  `)
})

test('calls useInterval with function and viewabilityMeasurementInterval', () => {
  const onViewabilityChange = jest.fn()

  const { update } = render(
    <ViewabilityTrackingView
      key="view"
      onViewabilityChange={onViewabilityChange}
      viewabilityMeasurementInterval={123}
    />
  )

  expect(useInterval).toHaveBeenCalledTimes(1)
  expect(useInterval).toHaveBeenCalledWith(expect.any(Function), 123)

  update(
    <ViewabilityTrackingView
      key="view"
      onViewabilityChange={onViewabilityChange}
      viewabilityMeasurementInterval={999}
    />
  )

  expect(useInterval).toHaveBeenCalledTimes(2)
  expect(useInterval).toHaveBeenLastCalledWith(expect.any(Function), 999)
})
