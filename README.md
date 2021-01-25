# react-native-viewability-tracking-view

> WARNING! This component is still under development, it is lacking automated tests and there might be bugs and the API can change between minor versions until it is published as 1.0.0.

## TL;DR

By default, `onViewabilityChange` will be called when at least 50% of the `ViewabilityTrackingView` has been rendered within the device's screen dimensions for at least 1000 ms.

```tsx
import ViewabilityTrackingView from 'react-native-viewability-tracking-view'

export const MyComponent = ({ title }: { title: string }) => {
  const onViewabilityChange = React.useCallback(
    (data: {
      isInView: boolean
      item?: Record<string, unknown>
      itemVisiblePercent: number
      testID?: string
      timeInView: number
      timeOutOfView: number
    }) => {
      // do something
    }
  )

  return (
    <ViewabilityTrackingView
      onViewabilityChange={onViewabilityChange}
      testID={title}
    >
      <Text>{title}</Text>
    </ViewabilityTrackingView>
  )
}
```

## Docs

TBD. Check source code for what props can be passed to configure the viewability tracking :-)
