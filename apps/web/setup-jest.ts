// setup-jest.ts
import "@testing-library/jest-dom";

// naver.maps Mocking
global.naver = {
  maps: {
    LatLng: jest.fn().mockImplementation((lat, lng) => ({ lat, lng })),
    Map: jest.fn().mockImplementation(() => ({
      setCenter: jest.fn(),
      setZoom: jest.fn(),
      getCenter: jest.fn(),
      getZoom: jest.fn(),
    })),
    CustomControl: jest.fn().mockImplementation(() => ({
      setMap: jest.fn(),
      getElement: jest.fn().mockReturnValue(document.createElement("div")),
    })),
    Event: {
      once: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addDOMListener: jest.fn(),
    },
    Position: {
      TOP_LEFT: 0,
      TOP_RIGHT: 1,
      RIGHT_BOTTOM: 2,
    },
    ZoomControlStyle: {
      SMALL: 0,
    },
    Marker: jest.fn().mockImplementation(() => ({
      setMap: jest.fn(),
      setPosition: jest.fn(),
    })),
    InfoWindow: jest.fn().mockImplementation(() => ({
      open: jest.fn(),
      close: jest.fn(),
      setContent: jest.fn(),
    })),
  },
} as any;

// ResizeObserver Mocking
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// scrollIntoView Mocking
window.HTMLElement.prototype.scrollIntoView = jest.fn();
