import {empty} from 'most'

export class MockedDOMSource {
  constructor (_mockConfig) {
    this._mockConfig = _mockConfig
    if (_mockConfig['elements']) {
      this.elements = _mockConfig['elements']
    } else {
      this.elements = empty()
    }
  }

  events (eventType) {
    const mockConfig = this._mockConfig
    const keys = Object.keys(mockConfig)
    const keysLen = keys.length
    for (let i = 0; i < keysLen; i++) {
      const key = keys[i]
      if (key === eventType) {
        return mockConfig[key]
      }
    }
    return empty()
  }

  select (selector) {
    const mockConfig = this._mockConfig
    const keys = Object.keys(mockConfig)
    const keysLen = keys.length
    for (let i = 0; i < keysLen; i++) {
      const key = keys[i]
      if (key === selector) {
        return new MockedDOMSource(mockConfig[key])
      }
    }
    return new MockedDOMSource({})
  }
}

export function mockDOMSource (mockConfig) {
  return new MockedDOMSource(mockConfig)
}
