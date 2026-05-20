import '@testing-library/jest-dom'

// Mock naver maps global object
global.naver = {
  maps: {
    Size: jest.fn().mockImplementation((w, h) => ({ w, h })),
    Point: jest.fn().mockImplementation((x, y) => ({ x, y })),
    LatLng: jest.fn().mockImplementation((lat, lng) => ({ lat, lng })),
    LatLngBounds: jest.fn().mockImplementation(() => ({
      extend: jest.fn(),
      hasLatLng: jest.fn().mockReturnValue(true),
    })),
    Map: jest.fn().mockImplementation(() => ({
      setCenter: jest.fn(),
      setZoom: jest.fn(),
      fitBounds: jest.fn(),
      controls: {
        [1]: { push: jest.fn() },
      },
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
    Marker: jest.fn().mockImplementation(() => ({
      setMap: jest.fn(),
      setPosition: jest.fn(),
      addListener: jest.fn(),
    })),
    InfoWindow: jest.fn().mockImplementation(() => ({
      open: jest.fn(),
      close: jest.fn(),
      setContent: jest.fn(),
    })),
    Event: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      once: jest.fn().mockImplementation((target, eventName, callback) => {
        // Synchronously invoke for "init" event to ensure tests can assert immediately
        if (eventName === 'init') {
          callback()
        }
        return { listener: jest.fn() }
      }),
      addDOMListener: jest.fn(),
      clearInstanceListeners: jest.fn(),
    },
    CustomControl: jest.fn().mockImplementation(() => ({
      getElement: jest.fn().mockReturnValue(document.createElement('div')),
      setMap: jest.fn(),
    })),
    ControlPosition: {
      TOP_LEFT: 1,
    },
    ZoomControlStyle: {
      SMALL: 1,
      LARGE: 2,
    },
    Position: {
      TOP_LEFT: 1,
      TOP_RIGHT: 2,
    },
  },
} as any
