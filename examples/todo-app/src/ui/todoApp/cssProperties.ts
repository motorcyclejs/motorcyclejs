import { types } from 'typestyle';

export namespace todoAppCssProperties {
  export const inputPlaceholder: types.NestedCSSProperties =
    {
      $unique: true,
      fontStyle: 'italic',
      fontWeight: 300,
      color: `#e6e6e6`,
    };


  export const itemInput: types.NestedCSSProperties =
    {
      position: 'relative',
      margin: 0,
      width: `100%`,
      fontSize: `24px`,
      fontFamily: `inherit`,
      fontWeight: 'inherit',
      lineHeight: `1.4em`,
      color: `inherit`,
      padding: `6px`,
      border: `1px solid #999`,
      boxShadow: `inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2)`,
      boxSizing: 'border-box',
      '-webkit-font-smoothing': `antialiased`,
      '-moz-osx-font-smoothing': `grayscale`,
    };
}
